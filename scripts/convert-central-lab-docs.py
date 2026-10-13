from __future__ import annotations

import html
import posixpath
import re
import shutil
import zipfile
from pathlib import Path, PurePosixPath
from xml.etree import ElementTree as ET


ROOT = Path(__file__).resolve().parent.parent
SOURCE_DIR = ROOT / "المعمل المركزى"
OUTPUT_DIR = ROOT / "public" / "central-lab"
IMAGE_DIR = OUTPUT_DIR / "images"

NS = {
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "mc": "http://schemas.openxmlformats.org/markup-compatibility/2006",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
    "wp": "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing",
}
REL_NS = {"rel": "http://schemas.openxmlformats.org/package/2006/relationships"}
W = f"{{{NS['w']}}}"
A = f"{{{NS['a']}}}"
R = f"{{{NS['r']}}}"


def local_name(tag: str) -> str:
    return tag.rsplit("}", 1)[-1]


def relationship_targets(archive: zipfile.ZipFile, part_path: str) -> dict[str, str]:
    part = PurePosixPath(part_path)
    rels_path = str(part.parent / "_rels" / f"{part.name}.rels")
    if rels_path not in archive.namelist():
        return {}
    rels = ET.fromstring(archive.read(rels_path))
    targets = {}
    for relation in rels.findall("rel:Relationship", REL_NS):
        target = relation.attrib.get("Target", "")
        if target.startswith("/"):
            normalized = PurePosixPath(target.lstrip("/"))
        else:
            normalized = PurePosixPath(posixpath.normpath(str(part.parent / target)))
        targets[relation.attrib["Id"]] = str(normalized)
    return targets


def image_markup(
    node: ET.Element,
    targets: dict[str, str],
    archive: zipfile.ZipFile,
    document_number: int,
) -> str:
    blips = node.findall(f".//{A}blip")
    if not blips:
        return ""
    extent = node.find(".//wp:extent", NS)
    width = ""
    if extent is not None and extent.attrib.get("cx", "").isdigit():
        width = f' style="width:min(100%, {max(1, int(extent.attrib["cx"]) // 9525)}px)"'
    doc_properties = node.find(".//wp:docPr", NS)
    alternative_text = ""
    if doc_properties is not None:
        alternative_text = doc_properties.attrib.get("descr", "") or doc_properties.attrib.get("title", "")

    rendered_images = []
    seen_relationships = set()
    for blip in blips:
        relationship_id = blip.attrib.get(f"{R}embed")
        target = targets.get(relationship_id or "")
        if not target or target not in archive.namelist() or relationship_id in seen_relationships:
            continue
        seen_relationships.add(relationship_id)

        original_name = PurePosixPath(target).name
        output_name = f"{document_number}-{original_name}"
        destination = IMAGE_DIR / output_name
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_bytes(archive.read(target))
        rendered_images.append(
            f'<img class="document-image" src="/central-lab/images/{html.escape(output_name, quote=True)}" '
            f'alt="{html.escape(alternative_text, quote=True)}" loading="lazy" decoding="async"{width}>'
        )
    return "".join(rendered_images)


def render_run(
    run: ET.Element,
    targets: dict[str, str],
    archive: zipfile.ZipFile,
    document_number: int,
) -> str:
    pieces = []
    for child in run:
        if child.tag == f"{W}t":
            pieces.append(html.escape(child.text or ""))
        elif child.tag == f"{W}tab":
            pieces.append('<span class="document-tab">&emsp;</span>')
        elif child.tag == f"{W}br":
            if child.attrib.get(f"{W}type") == "page":
                pieces.append('<span class="document-page-break" aria-hidden="true"></span>')
            else:
                pieces.append("<br>")
        elif child.tag in (f"{W}drawing", f"{W}pict"):
            pieces.append(image_markup(child, targets, archive, document_number))
        elif child.tag == f"{{{NS['mc']}}}AlternateContent":
            choice = child.find(f"{{{NS['mc']}}}Choice")
            fallback = child.find(f"{{{NS['mc']}}}Fallback")
            selected_content = choice if choice is not None else fallback
            if selected_content is not None:
                for drawing in selected_content.findall(f".//{W}drawing"):
                    pieces.append(image_markup(drawing, targets, archive, document_number))

    value = "".join(pieces)
    properties = run.find(f"{W}rPr")
    if properties is None:
        return value

    if properties.find(f"{W}b") is not None:
        value = f"<strong>{value}</strong>"
    if properties.find(f"{W}i") is not None:
        value = f"<em>{value}</em>"
    if properties.find(f"{W}u") is not None:
        value = f"<u>{value}</u>"
    color = properties.find(f"{W}color")
    color_value = color.attrib.get(f"{W}val", "") if color is not None else ""
    if re.fullmatch(r"[0-9A-Fa-f]{6}", color_value):
        value = f'<span style="color:#{color_value}">{value}</span>'
    return value


def paragraph_classes(paragraph: ET.Element) -> tuple[list[str], str, str]:
    classes = ["document-paragraph"]
    direction = "rtl"
    alignment = "right"

    properties = paragraph.find(f"{W}pPr")
    if properties is not None:
        style = properties.find(f"{W}pStyle")
        if style is not None:
            style_id = style.attrib.get(f"{W}val", "").lower()
            if "title" in style_id:
                classes.append("document-title")
            elif "heading" in style_id or "subtitle" in style_id:
                classes.append("document-heading")
        outline = properties.find(f"{W}outlineLvl")
        if outline is not None:
            classes.append("document-heading")
        alignment_property = properties.find(f"{W}jc")
        if alignment_property is not None:
            alignment_value = alignment_property.attrib.get(f"{W}val", "")
            alignment = {
                "left": "left",
                "center": "center",
                "both": "justify",
                "distribute": "justify",
            }.get(alignment_value, "right")
        if properties.find(f"{W}bidi") is not None:
            direction = "rtl"

        num_properties = properties.find(f"{W}numPr")
        if num_properties is not None:
            classes.append("document-list-item")

    return classes, direction, alignment


def numbering_styles(archive: zipfile.ZipFile) -> dict[tuple[str, str], tuple[str, str, int]]:
    if "word/numbering.xml" not in archive.namelist():
        return {}
    root = ET.fromstring(archive.read("word/numbering.xml"))
    abstract_levels: dict[tuple[str, str], tuple[str, str, int]] = {}
    for abstract in root.findall(f"{W}abstractNum"):
        abstract_id = abstract.attrib.get(f"{W}abstractNumId", "")
        for level in abstract.findall(f"{W}lvl"):
            level_id = level.attrib.get(f"{W}ilvl", "0")
            number_format = level.find(f"{W}numFmt")
            level_text = level.find(f"{W}lvlText")
            start = level.find(f"{W}start")
            abstract_levels[(abstract_id, level_id)] = (
                number_format.attrib.get(f"{W}val", "bullet") if number_format is not None else "bullet",
                level_text.attrib.get(f"{W}val", "•") if level_text is not None else "•",
                int(start.attrib.get(f"{W}val", "1")) if start is not None else 1,
            )

    numbering: dict[tuple[str, str], tuple[str, str, int]] = {}
    for number in root.findall(f"{W}num"):
        number_id = number.attrib.get(f"{W}numId", "")
        abstract_reference = number.find(f"{W}abstractNumId")
        if abstract_reference is None:
            continue
        abstract_id = abstract_reference.attrib.get(f"{W}val", "")
        for (candidate_id, level_id), value in abstract_levels.items():
            if candidate_id == abstract_id:
                numbering[(number_id, level_id)] = value
    return numbering


def number_text(value: int, number_format: str) -> str:
    if number_format in ("upperLetter", "lowerLetter"):
        remaining = max(1, value)
        result = ""
        while remaining:
            remaining, remainder = divmod(remaining - 1, 26)
            result = chr(ord("A") + remainder) + result
        return result.lower() if number_format == "lowerLetter" else result
    if number_format in ("upperRoman", "lowerRoman"):
        remaining = max(1, value)
        result = ""
        for number, numeral in (
            (1000, "M"), (900, "CM"), (500, "D"), (400, "CD"),
            (100, "C"), (90, "XC"), (50, "L"), (40, "XL"),
            (10, "X"), (9, "IX"), (5, "V"), (4, "IV"), (1, "I"),
        ):
            count, remaining = divmod(remaining, number)
            result += numeral * count
        return result.lower() if number_format == "lowerRoman" else result
    return str(value)


def list_marker(
    paragraph: ET.Element,
    counters: dict[tuple[str, str], int],
    numbering: dict[tuple[str, str], tuple[str, str, int]],
) -> str:
    properties = paragraph.find(f"{W}pPr")
    num_properties = properties.find(f"{W}numPr") if properties is not None else None
    if num_properties is None:
        return ""
    number_id = num_properties.find(f"{W}numId")
    level = num_properties.find(f"{W}ilvl")
    key = (
        number_id.attrib.get(f"{W}val", "0") if number_id is not None else "0",
        level.attrib.get(f"{W}val", "0") if level is not None else "0",
    )
    number_format, level_text, start = numbering.get(key, ("bullet", "•", 1))
    if number_format == "bullet":
        marker = level_text if level_text and "%" not in level_text else "•"
    else:
        counters[key] = counters.get(key, start - 1) + 1
        marker = re.sub(r"%\d+", number_text(counters[key], number_format), level_text)
    return f'<span class="document-list-marker">{html.escape(marker)}</span>'


def render_paragraph(
    paragraph: ET.Element,
    targets: dict[str, str],
    archive: zipfile.ZipFile,
    document_number: int,
    counters: dict[tuple[str, str], int],
    numbering: dict[tuple[str, str], tuple[str, str, int]],
) -> str:
    classes, direction, alignment = paragraph_classes(paragraph)
    content = []
    for child in paragraph:
        if child.tag == f"{W}r":
            content.append(render_run(child, targets, archive, document_number))
        elif child.tag == f"{W}hyperlink":
            content.extend(
                render_run(run, targets, archive, document_number)
                for run in child.findall(f"{W}r")
            )
    if not "".join(content).strip():
        return ""

    marker = list_marker(paragraph, counters, numbering)
    class_name = " ".join(classes)
    return (
        f'<p class="{class_name}" dir="{direction}" style="text-align:{alignment}">'
        f"{marker}{''.join(content)}</p>"
    )


def render_table(
    table: ET.Element,
    targets: dict[str, str],
    archive: zipfile.ZipFile,
    document_number: int,
    counters: dict[tuple[str, str], int],
    numbering: dict[tuple[str, str], tuple[str, str, int]],
) -> str:
    rows = []
    for row in table.findall(f"{W}tr"):
        cells = []
        for cell in row.findall(f"{W}tc"):
            cell_parts = []
            for child in cell:
                if child.tag == f"{W}p":
                    cell_parts.append(
                        render_paragraph(
                            child, targets, archive, document_number, counters, numbering
                        )
                    )
                elif child.tag == f"{W}tbl":
                    cell_parts.append(
                        render_table(child, targets, archive, document_number, counters, numbering)
                    )
            cells.append(f"<td>{''.join(cell_parts)}</td>")
        rows.append(f"<tr>{''.join(cells)}</tr>")
    return f'<div class="document-table-wrap"><table><tbody>{"".join(rows)}</tbody></table></div>'


def render_document(path: Path, document_number: int) -> None:
    with zipfile.ZipFile(path) as archive:
        document = ET.fromstring(archive.read("word/document.xml"))
        document_targets = relationship_targets(archive, "word/document.xml")
        numbering = numbering_styles(archive)
        body = document.find(f".//{W}body")
        if body is None:
            raise ValueError(f"Missing document body: {path}")

        counters: dict[tuple[str, str], int] = {}
        header_content = []
        footer_content = []
        for reference_tag, content_blocks in (
            ("headerReference", header_content),
            ("footerReference", footer_content),
        ):
            related_parts = []
            for reference in document.findall(f".//{W}{reference_tag}"):
                relationship_id = reference.attrib.get(f"{R}id", "")
                related_part = document_targets.get(relationship_id)
                if related_part and related_part not in related_parts:
                    related_parts.append(related_part)
            for part_path in related_parts:
                if part_path not in archive.namelist():
                    continue
                part = ET.fromstring(archive.read(part_path))
                part_targets = relationship_targets(archive, part_path)
                blocks = []
                for block in part:
                    if block.tag == f"{W}p":
                        blocks.append(
                            render_paragraph(
                                block, part_targets, archive, document_number, counters, numbering
                            )
                        )
                    elif block.tag == f"{W}tbl":
                        blocks.append(
                            render_table(
                                block, part_targets, archive, document_number, counters, numbering
                            )
                        )
                rendered_part = "".join(blocks)
                content_blocks.append(rendered_part)

        content = header_content
        for child in body:
            if child.tag == f"{W}p":
                content.append(
                    render_paragraph(
                        child, document_targets, archive, document_number, counters, numbering
                    )
                )
            elif child.tag == f"{W}tbl":
                content.append(
                    render_table(
                        child, document_targets, archive, document_number, counters, numbering
                    )
                )
        content.extend(f'<footer class="document-footer">{part}</footer>' for part in footer_content)

    page_title = html.escape(path.stem, quote=True)
    page = f"""<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{page_title}</title>
  <link rel="stylesheet" href="/central-lab/documents.css">
</head>
<body>
  <main class="document-content">
    {''.join(content)}
  </main>
</body>
</html>
"""
    (OUTPUT_DIR / f"{document_number}.html").write_text(page, encoding="utf-8")


def main() -> None:
    documents = []
    for path in SOURCE_DIR.glob("*.docx"):
        match = re.match(r"^(\d+)", path.name)
        if match:
            documents.append((int(match.group(1)), path))

    documents.sort(key=lambda item: item[0])
    expected_numbers = list(range(1, 9))
    actual_numbers = [number for number, _ in documents]
    if actual_numbers != expected_numbers:
        raise ValueError(f"Expected Word documents 1–8; found {actual_numbers}")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    if IMAGE_DIR.exists():
        shutil.rmtree(IMAGE_DIR)
    IMAGE_DIR.mkdir(parents=True)

    for number, path in documents:
        render_document(path, number)
        print(f"Rendered {number}: {path.name}")


if __name__ == "__main__":
    main()
