import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { CENTRAL_LAB_DOCUMENTS } from '../constants/centralLabDocuments';
import { useSiteLanguage } from '../context/SiteLanguageContext';
import './LaboratoriesSectorCentralLab.css';

function normalizeBulletMarkers(content: Element) {
  content.querySelectorAll('.document-list-marker').forEach((marker) => {
    const markerText = marker.textContent ?? '';
    const containsPrivateUseGlyph = Array.from(markerText).some((character) => {
      const codePoint = character.codePointAt(0) ?? 0;
      return codePoint >= 0xe000 && codePoint <= 0xf8ff;
    });

    if (containsPrivateUseGlyph) marker.textContent = '•';
  });

  const walker = content.ownerDocument.createTreeWalker(content, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode as Text);
  }

  textNodes.forEach((textNode) => {
    const text = textNode.textContent ?? '';
    const bulletPattern = /\uF0B7(?:\uF020)?/g;
    if (!bulletPattern.test(text)) return;

    bulletPattern.lastIndex = 0;
    const fragment = content.ownerDocument.createDocumentFragment();
    let lastIndex = 0;
    let match = bulletPattern.exec(text);
    while (match) {
      fragment.append(text.slice(lastIndex, match.index));
      const bullet = content.ownerDocument.createElement('span');
      bullet.className = 'document-inline-bullet';
      bullet.textContent = '•';
      fragment.append(bullet);
      lastIndex = match.index + match[0].length;
      match = bulletPattern.exec(text);
    }
    fragment.append(text.slice(lastIndex));
    textNode.replaceWith(fragment);
  });
}

function arrangeOrganicLabListsInTables(content: Element) {
  const children = Array.from(content.children);
  let index = 0;

  while (index < children.length) {
    if (!children[index].classList.contains('document-list-item')) {
      index += 1;
      continue;
    }

    const listItems: Element[] = [];
    while (index < children.length && children[index].classList.contains('document-list-item')) {
      listItems.push(children[index]);
      index += 1;
    }

    const firstItem = listItems[0];
    const parent = firstItem.parentElement;
    if (!parent) continue;

    const wrapper = content.ownerDocument.createElement('div');
    wrapper.className = 'document-table-wrap document-list-table-wrap';
    const table = content.ownerDocument.createElement('table');
    table.className = 'document-list-table';
    const body = content.ownerDocument.createElement('tbody');

    parent.insertBefore(wrapper, firstItem);
    wrapper.append(table);
    table.append(body);

    for (let itemIndex = 0; itemIndex < listItems.length; itemIndex += 3) {
      const row = content.ownerDocument.createElement('tr');
      listItems.slice(itemIndex, itemIndex + 3).forEach((item) => {
        const cell = content.ownerDocument.createElement('td');
        cell.append(item);
        row.append(cell);
      });
      body.append(row);
    }
  }
}

function removeOrganicLabHeader(content: Element, isEnglish: boolean) {
  const header = content.firstElementChild;
  const headerText = header?.textContent ?? '';

  if (
    header?.classList.contains('document-table-wrap')
    && header.querySelector('img')
    && (isEnglish
      ? headerText.includes('Drinking water and sanitation company') && headerText.includes('Laboratories and quality sector')
      : headerText.includes('شركة مياه الشرب') && headerText.includes('قطاع المعامل'))
  ) {
    header.remove();
  }
}

function removePageMetadataHeading(content: Element) {
  const heading = Array.from(content.querySelectorAll('p')).find((paragraph) => {
    const text = paragraph.textContent?.replace(/\s+/g, ' ').trim().toLowerCase() ?? '';
    const isArabicMetadata = text.includes('بيانات صفحة')
      && text.includes('website')
      && text.includes('الشركة');
    const isEnglishMetadata = text.includes('page data')
      && text.includes('website')
      && text.includes('company');
    return isArabicMetadata || isEnglishMetadata;
  });

  heading?.remove();
}

function removePageEditorialNotes(content: Element) {
  content.querySelectorAll('p').forEach((paragraph) => {
    const text = paragraph.textContent?.replace(/\s+/g, ' ').trim() ?? '';
    if (/^(صفحة لوحدها|page alone)$/i.test(text)) {
      paragraph.remove();
    }
  });
}

function arrangeLaboratoryOverviewArticle(content: Element, markUnnumberedListEntries = true) {
  const tableWrapper = Array.from(content.querySelectorAll(':scope > .document-table-wrap')).find((wrapper) =>
    Array.from(wrapper.querySelectorAll('tr')).some((row) => {
      const heading = row.cells[0]?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
      return /^وصف المعمل$/i.test(heading) || /^laboratory description$/i.test(heading);
    })
  );
  if (!tableWrapper) return;

  const article = content.ownerDocument.createElement('article');
  article.className = 'laboratory-overview-article';

  Array.from(tableWrapper.querySelectorAll('tr')).forEach((row) => {
    const [headingCell, contentCell] = Array.from(row.cells);
    if (!headingCell || !contentCell) return;

    const section = content.ownerDocument.createElement('section');
    section.className = 'laboratory-overview-section';
    const sectionTitle = headingCell.textContent?.replace(/\s+/g, ' ').trim() ?? '';
    const paragraphs = Array.from(contentCell.querySelectorAll<HTMLElement>('.document-paragraph'));
    const isAnalysisSection = /التحاليل|الاختبارات|laboratory tests/i.test(sectionTitle);
    const isEquipmentSection = /الأجهزة|الأجهزه|devices|equipment/i.test(sectionTitle);

    Array.from(headingCell.querySelectorAll<HTMLElement>('.document-paragraph')).forEach((heading) => {
      heading.classList.add('document-heading');
      section.append(heading);
    });

    paragraphs.forEach((paragraph, index) => {
      const isExistingListItem = paragraph.classList.contains('document-list-item');
      if (
        isExistingListItem
        || (markUnnumberedListEntries && (isEquipmentSection || (isAnalysisSection && index > 0)))
      ) {
        paragraph.classList.add('laboratory-overview-list-item');
      }
      section.append(paragraph);
    });
    article.append(section);
  });

  tableWrapper.before(article);
  tableWrapper.remove();
}

function arrangeSampleCollectionDevices(content: Element, isEnglish: boolean) {
  const deviceSectionHeading = (element: Element) => {
    const text = element.textContent?.replace(/\s+/g, ' ').trim() ?? '';
    return isEnglish
      ? /^(devices in the laboratory|equipment in the laboratory|laboratory equipment)$/i.test(text)
      : /^الأجهزة الموجودة بالمعمل$/.test(text);
  };
  const children = Array.from(content.children);
  const sectionStarts = children
    .map((element, index) => ({ element, index }))
    .filter(({ element }) => deviceSectionHeading(element));

  for (let sectionIndex = sectionStarts.length - 1; sectionIndex >= 0; sectionIndex -= 1) {
    const start = sectionStarts[sectionIndex].index;
    const end = sectionStarts[sectionIndex + 1]?.index ?? children.length;
    const sectionNodes = children.slice(start + 1, end);
    const tableWrapper = sectionNodes.find((element) =>
      element.matches('.document-table-wrap') && element.querySelector('img')
    );
    const rows = Array.from(tableWrapper?.querySelectorAll('tr') ?? []);
    const nameRow = rows.find((row) => {
      const text = row.cells[0]?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
      return isEnglish ? /^device name\s*:/i.test(text) : /^اسم الجهاز\s*[:：]/.test(text);
    });
    const imageRow = rows.find((row) => row.querySelector('img'));
    const detailsRow = rows.find((row) => {
      const text = row.cells[0]
        ?.querySelector('.document-paragraph')
        ?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
      return isEnglish
        ? /^(a brief overview|brief description) of (the )?device\b/i.test(text)
        : /^نبذة مختصرة عن الجهاز/.test(text);
    });
    if (!tableWrapper || !nameRow || !imageRow || !detailsRow) continue;

    const device = content.ownerDocument.createElement('article');
    device.className = 'sample-collection-device';

    const name = nameRow.cells[0].querySelector<HTMLElement>('.document-paragraph');
    const imageParagraph = imageRow.querySelector('img')?.closest<HTMLElement>('.document-paragraph');
    const detailsCell = detailsRow.cells[0];
    if (!name || !imageParagraph || !detailsCell) continue;

    name.classList.add('sample-collection-device-name');
    const table = content.ownerDocument.createElement('table');
    table.className = 'sample-collection-device-table';
    const body = content.ownerDocument.createElement('tbody');
    const row = content.ownerDocument.createElement('tr');
    const details = content.ownerDocument.createElement('td');
    details.className = 'sample-collection-device-details';
    const image = content.ownerDocument.createElement('td');
    image.className = 'sample-collection-device-image';

    while (detailsCell.firstChild) details.append(detailsCell.firstChild);
    image.append(imageParagraph);
    row.append(details, image);
    body.append(row);
    table.append(body);
    device.append(name, table);
    tableWrapper.before(device);
    children[start].remove();
    tableWrapper.remove();
  }
}

function arrangeInorganicLaboratoryDepartments(content: Element) {
  const overview = content.querySelector<HTMLElement>('.laboratory-overview-section');
  if (!overview) return;

  const paragraphs = Array.from(overview.querySelectorAll<HTMLElement>('.document-paragraph'))
    .filter((paragraph) => !paragraph.classList.contains('document-heading'));
  const firstDepartmentIndex = paragraphs.findIndex((paragraph) =>
    paragraph.classList.contains('document-list-item')
  );
  if (firstDepartmentIndex < 0) return;

  const departments = content.ownerDocument.createElement('div');
  departments.className = 'inorganic-lab-departments';
  const firstDepartment = paragraphs[firstDepartmentIndex];
  firstDepartment.before(departments);
  let currentDepartment: HTMLElement | undefined;

  paragraphs.slice(firstDepartmentIndex).forEach((paragraph) => {
    const text = paragraph.textContent?.replace(/\s+/g, ' ').trim() ?? '';
    const isSummary = text.startsWith('يقوم المعمل غير العضوي')
      || /^The inorganic laboratory analyzes/i.test(text);

    if (isSummary) {
      paragraph.classList.add('inorganic-lab-summary');
      currentDepartment = undefined;
      paragraph.remove();
      departments.after(paragraph);
      return;
    }

    if (paragraph.classList.contains('document-list-item')) {
      currentDepartment = content.ownerDocument.createElement('section');
      currentDepartment.className = 'inorganic-lab-department';
      paragraph.classList.add('inorganic-lab-department-title');
      currentDepartment.append(paragraph);
      departments.append(currentDepartment);
      return;
    }

    if (currentDepartment) {
      paragraph.classList.add('inorganic-lab-department-description');
      currentDepartment.append(paragraph);
    }
  });
}

function arrangeInorganicLaboratoryAnalyses(content: Element) {
  const analysisRow = Array.from(content.querySelectorAll<HTMLTableRowElement>(':scope > .document-table-wrap tr')).find((row) => {
    const headingText = row.cells[0]?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
    return /^(التحاليل التي يقوم بها المعمل|laboratory tests)$/i.test(headingText);
  });
  if (!analysisRow) return;

  const headingCell = analysisRow.cells.item(0);
  const title = Array.from(headingCell?.querySelectorAll<HTMLElement>('.document-paragraph') ?? [])
    .find((paragraph) => /^(التحاليل التي يقوم بها المعمل|laboratory tests)$/i.test(
      paragraph.textContent?.replace(/\s+/g, ' ').trim() ?? '',
    ));
  const article = content.ownerDocument.createElement('section');
  article.className = 'inorganic-lab-analysis';
  if (title) {
    title.classList.add('document-heading');
    article.append(title);
  }

  Array.from(analysisRow.cells)
    .flatMap((cell) => Array.from(cell.querySelectorAll<HTMLElement>('.document-paragraph')))
    .filter((paragraph) => paragraph !== title)
    .forEach((paragraph) => {
      if (paragraph.classList.contains('document-list-item')) {
        paragraph.classList.add('inorganic-lab-analysis-list-item');
      }
      const text = paragraph.textContent?.replace(/\s+/g, ' ').trim() ?? '';
      if (/1\s*[-–]\s*(selenium|lead)|1\s*[-–]\s*selenium/i.test(text) || /1\s*[-–]\s*selenium/i.test(text)) {
        paragraph.classList.add('inorganic-lab-elements-list');
      }
      if (/الكاتيونات|الأنيونات|الأوكسيهاليد|cations|anions|oxyhalide/i.test(text)) {
        paragraph.classList.add('inorganic-lab-ion-group');
      }
      article.append(paragraph);
    });

  const wrapper = analysisRow.closest('.document-table-wrap');
  wrapper?.before(article);
  analysisRow.remove();
  if (wrapper && !wrapper.querySelector('tr')) wrapper.remove();
}

function arrangeInorganicLaboratoryEquipment(content: Element) {
  const equipmentTable = Array.from(content.querySelectorAll(':scope > .document-table-wrap')).find((wrapper) =>
    /TITRIC FLEX 940-2500 Professional IC Vario/i.test(wrapper.textContent ?? '')
  );
  const row = equipmentTable?.querySelector('tr');
  const contentCell = row?.cells.item(1);
  if (!equipmentTable || !row || !contentCell) return;

  const article = content.ownerDocument.createElement('section');
  article.className = 'inorganic-lab-equipment';

  const heading = Array.from(row.cells.item(0)?.querySelectorAll<HTMLElement>('.document-paragraph') ?? [])[0];
  if (heading) {
    heading.classList.add('document-heading');
    article.append(heading);
  }

  let deviceCard: HTMLElement | undefined;
  Array.from(contentCell.querySelectorAll<HTMLElement>('.document-paragraph')).forEach((paragraph) => {
    const text = paragraph.textContent?.replace(/\s+/g, ' ').trim() ?? '';
    if (/^\d+\s*[-–]\s*/.test(text)) {
      deviceCard = content.ownerDocument.createElement('div');
      deviceCard.className = 'inorganic-lab-equipment-card';
      paragraph.classList.add('inorganic-lab-equipment-name');
      deviceCard.append(paragraph);
      article.append(deviceCard);
      return;
    }

    const embeddedHeading = Array.from(paragraph.querySelectorAll('strong')).find((strong) =>
      /^\s*[1-8]\s*[-–]\s*/.test(strong.textContent ?? '')
    );
    if (embeddedHeading && deviceCard) {
      const range = content.ownerDocument.createRange();
      range.setStartBefore(embeddedHeading);
      range.setEnd(paragraph, paragraph.childNodes.length);
      const headingContent = range.extractContents();
      if (paragraph.textContent?.trim()) {
        paragraph.classList.add('inorganic-lab-equipment-detail');
        deviceCard.append(paragraph);
      }

      deviceCard = content.ownerDocument.createElement('div');
      deviceCard.className = 'inorganic-lab-equipment-card';
      const headingParagraph = paragraph.cloneNode(false) as HTMLElement;
      headingParagraph.classList.remove('inorganic-lab-equipment-detail');
      headingParagraph.classList.add('inorganic-lab-equipment-name');
      headingParagraph.append(headingContent);
      deviceCard.append(headingParagraph);
      article.append(deviceCard);
      return;
    }

    if (deviceCard) {
      paragraph.classList.add('inorganic-lab-equipment-detail');
      deviceCard.append(paragraph);
    }
  });

  equipmentTable.before(article);
  equipmentTable.remove();
}

function arrangeLaboratoryDeviceTables(
  content: Element,
  isEnglish: boolean,
  imagePattern: RegExp,
  cardClassName = 'inorganic-lab-device-card',
) {
  const deviceTables = Array.from(content.querySelectorAll<HTMLElement>(':scope > .document-table-wrap'))
    .filter((wrapper) =>
      Array.from(wrapper.querySelectorAll<HTMLImageElement>('img')).some((image) =>
        imagePattern.test(image.getAttribute('src') ?? '')
      )
    );

  deviceTables.forEach((wrapper) => {
    const paragraphs = Array.from(wrapper.querySelectorAll<HTMLElement>('.document-paragraph'));
    const nameRow = Array.from(wrapper.querySelectorAll('tr')).find((row) => {
      const text = row.cells[0]?.querySelector('.document-paragraph')?.textContent?.trim() ?? '';
      return isEnglish
        ? /^(?:device|equipment)\s+name\s*:/i.test(text) || /(?:device|equipment)\s+name\s*:?\s*$/i.test(text)
        : /^(?:اسم الجهاز|اسم المعدة)\s*[:：]/.test(text) || /(?:اسم الجهاز|اسم المعدة)\s*[:：]?\s*$/.test(text);
    });
    const imageParagraphs = paragraphs.filter((paragraph) => paragraph.querySelector('img'));
    const nameParagraphs = Array.from(nameRow?.querySelectorAll<HTMLElement>('.document-paragraph') ?? []);
    if (nameParagraphs.length === 0 || imageParagraphs.length === 0) return;

    const imageSet = new Set(imageParagraphs);
    const nameSet = new Set(nameParagraphs);
    const captions = paragraphs.filter((paragraph) =>
      paragraph.classList.contains('biological-lab-image-caption')
      || /^(?:\(\s*(?:صورة الجهاز|device photo|device image)\s*\)|صورة الجهاز)$/i.test(
        paragraph.textContent?.replace(/\s+/g, ' ').trim() ?? ''
      )
    );
    const captionSet = new Set(captions);
    const detailsParagraphs = paragraphs.filter((paragraph) =>
      !imageSet.has(paragraph) && !nameSet.has(paragraph) && !captionSet.has(paragraph)
    );

    const device = content.ownerDocument.createElement('article');
    device.className = `inorganic-lab-device-card ${cardClassName}`;
    const name = content.ownerDocument.createElement('div');
    name.className = 'inorganic-lab-device-name';
    nameParagraphs.forEach((paragraph) => {
      paragraph.classList.add('inorganic-lab-equipment-name');
      name.append(paragraph);
    });

    const table = content.ownerDocument.createElement('table');
    table.className = 'inorganic-lab-device-table';
    const body = content.ownerDocument.createElement('tbody');
    const row = content.ownerDocument.createElement('tr');
    const details = content.ownerDocument.createElement('td');
    details.className = 'inorganic-lab-device-details';
    detailsParagraphs.forEach((paragraph) => details.append(paragraph));

    const images = content.ownerDocument.createElement('td');
    images.className = 'inorganic-lab-device-images';
    [...captions, ...imageParagraphs].forEach((paragraph) => images.append(paragraph));

    row.append(details, images);
    body.append(row);
    table.append(body);
    device.append(name, table);
    wrapper.before(device);
    wrapper.remove();
  });
}

function arrangeFinalBiologicalLaboratoryDevice(content: Element, isEnglish: boolean) {
  const wrapper = Array.from(content.querySelectorAll<HTMLElement>(':scope > .document-table-wrap')).find((table) =>
    Array.from(table.querySelectorAll<HTMLImageElement>('img')).some((image) =>
      /\/7-image4\./i.test(image.getAttribute('src') ?? '')
    )
  );
  if (!wrapper) return;

  const imageCell = wrapper.querySelector('tr:nth-child(2) td');
  if (!imageCell) return;
  let next = wrapper.nextElementSibling;
  while (next?.matches('.document-paragraph')) {
    const following = next.nextElementSibling;
    imageCell.append(next);
    next = following;
  }

  arrangeLaboratoryDeviceTables(content, isEnglish, /\/7-image4\./i, 'biological-lab-device-card');
}

function removeBacteriologyDeviceSectionHeadings(content: Element, isEnglish: boolean) {
  const headingPattern = isEnglish
    ? /^equipment (?:available )?in the laboratory$/i
    : /^الأجهزة الموجودة بالمعمل$/;
  content.querySelectorAll<HTMLElement>('.document-paragraph').forEach((paragraph) => {
    if (headingPattern.test(paragraph.textContent?.replace(/\s+/g, ' ').trim() ?? '')) {
      paragraph.remove();
    }
  });
}

function formatInorganicIcpMsDetails(content: Element) {
  const deviceIntroduction = Array.from(content.querySelectorAll<HTMLElement>('.document-paragraph')).find((paragraph) => {
    const text = paragraph.textContent?.replace(/\s+/g, ' ').trim() ?? '';
    return /ICP\s*-?\s*MS/i.test(text) && (/أحدث وأدق/.test(text) || /latest and most accurate/i.test(text));
  });
  const cell = deviceIntroduction?.closest('td');
  if (!deviceIntroduction || !cell) return;

  const paragraphs = Array.from(cell.querySelectorAll<HTMLElement>(':scope > .document-paragraph'));
  const start = paragraphs.indexOf(deviceIntroduction);
  const elementsIndex = paragraphs.findIndex((paragraph, index) => {
    const text = paragraph.textContent?.replace(/\s+/g, ' ').trim() ?? '';
    return index > start && /selenium/i.test(text) && /aluminum/i.test(text) && /vanadium/i.test(text);
  });
  if (start < 0 || elementsIndex < start) return;

  const selected = paragraphs.slice(start, elementsIndex + 1);
  const article = content.ownerDocument.createElement('section');
  article.className = 'inorganic-icp-ms-details';
  const elementsHeading = selected.find((paragraph) =>
    /العناصر التى يتم قياسها|elements measured/i.test(paragraph.textContent ?? '')
  );
  const elementList = selected[selected.length - 1];
  deviceIntroduction.before(article);

  selected.forEach((paragraph, index) => {
    const text = paragraph.textContent?.replace(/\s+/g, ' ').trim() ?? '';
    if (paragraph === deviceIntroduction) {
      paragraph.classList.add('inorganic-icp-ms-lead');
    } else if (paragraph === elementList) {
      paragraph.classList.add('inorganic-icp-ms-elements');
    } else if (paragraph === elementsHeading) {
      paragraph.classList.add('inorganic-icp-ms-elements-heading');
    } else if (paragraph.classList.contains('document-list-item')) {
      paragraph.classList.add('inorganic-icp-ms-point');
    } else if (index > 0 && text) {
      paragraph.classList.add('inorganic-icp-ms-description');
    }
    article.append(paragraph);
  });
}

function normalizeBiologicalLabImageCaptions(content: Element, isEnglish: boolean) {
  const isDeviceImageCaption = (text: string) => {
    const normalized = text.replace(/\s+/g, ' ').trim().replace(/^[（(]\s*|\s*[）)]$/g, '');
    return /^(صورة الجهاز|device photo|image of the device|device image)$/i.test(normalized);
  };

  content.querySelectorAll<HTMLImageElement>('img.document-image').forEach((image) => {
    const imageParagraph = image.closest<HTMLElement>('.document-paragraph');
    if (!imageParagraph) return;

    const isLabeledDeviceImage = /\/7-image[34]\./i.test(image.getAttribute('src') ?? '');
    const precedingCaption = imageParagraph.previousElementSibling;
    if (precedingCaption?.matches('.document-paragraph') && isDeviceImageCaption(precedingCaption.textContent ?? '')) {
      precedingCaption.remove();
    }

    const ownText = imageParagraph.cloneNode(true) as HTMLElement;
    ownText.querySelectorAll('img').forEach((nestedImage) => nestedImage.remove());
    const hasCaptionInImageParagraph = isDeviceImageCaption(ownText.textContent ?? '');

    if (hasCaptionInImageParagraph) {
      const walker = content.ownerDocument.createTreeWalker(imageParagraph, NodeFilter.SHOW_TEXT);
      const textNodes: Text[] = [];
      while (walker.nextNode()) textNodes.push(walker.currentNode as Text);
      textNodes.forEach((textNode) => {
        textNode.textContent = '';
      });
    }

    if (!isLabeledDeviceImage) return;

    const caption = content.ownerDocument.createElement('p');
    caption.className = 'document-paragraph biological-lab-image-caption';
    caption.dir = isEnglish ? 'ltr' : 'rtl';
    caption.style.textAlign = 'center';
    caption.textContent = isEnglish ? '(Device image)' : '(صورة الجهاز)';
    imageParagraph.before(caption);
  });

  content.querySelectorAll<HTMLElement>('.document-paragraph').forEach((paragraph) => {
    const text = paragraph.textContent?.replace(/\s+/g, '').trim() ?? '';
    if (/^[()（）]+$/.test(text) && !paragraph.querySelector('img')) {
      paragraph.remove();
    }
  });
}

function arrangeOrganicEquipmentGallery(content: Element) {
  const children = Array.from(content.children) as HTMLElement[];
  const imageIndexes = children
    .map((element, index) => (element.querySelector('img') ? index : -1))
    .filter((index) => index >= 0);
  if (imageIndexes.length < 2) return;

  const firstImageIndex = imageIndexes[0];
  const galleryStartIndex = children.findIndex((element, index) =>
    index <= firstImageIndex && element.textContent?.trim()
  );
  if (galleryStartIndex < 0) return;
  const lastImageIndex = imageIndexes[imageIndexes.length - 1];
  const gallery = content.ownerDocument.createElement('div');
  gallery.className = 'organic-equipment-gallery';
  children[galleryStartIndex].before(gallery);

  let pendingTitle: HTMLElement[] = [];
  let currentImages: HTMLElement | undefined;

  for (let index = galleryStartIndex; index <= lastImageIndex; index += 1) {
    const element = children[index];
    const image = element.querySelector('img');

    if (!image) {
      const text = element.textContent?.replace(/\s+/g, ' ').trim() ?? '';
      if (text) pendingTitle.push(element);
      continue;
    }

    if (!currentImages || pendingTitle.length > 0) {
      const card = content.ownerDocument.createElement('article');
      card.className = 'organic-equipment-gallery-card';

      if (pendingTitle.length > 0) {
        const title = content.ownerDocument.createElement('div');
        title.className = 'organic-equipment-gallery-title';
        pendingTitle.forEach((heading) => title.append(heading));
        card.append(title);
        pendingTitle = [];
      }

      currentImages = content.ownerDocument.createElement('div');
      currentImages.className = 'organic-equipment-gallery-images';
      card.append(currentImages);
      gallery.append(card);
    }

    const imageContainer = content.ownerDocument.createElement('div');
    imageContainer.className = 'organic-equipment-gallery-image';
    imageContainer.append(element);
    currentImages.append(imageContainer);
  }

  children.slice(galleryStartIndex, lastImageIndex + 1).forEach((element) => {
    if (element.parentElement === content) element.remove();
  });
}

function summarizeOrganicLabEquipment(content: Element, isEnglish: boolean) {
  const children = Array.from(content.children);
  const deviceHeading = (element: Element) => {
    if (element.tagName !== 'P') return false;
    const text = element.textContent?.trim() ?? '';
    return /^[2-7]\s*[-–]\s*/.test(text);
  };
  const sections = children
    .map((element, index) => ({ element, index }))
    .filter(({ element }) => deviceHeading(element));

  for (let sectionIndex = sections.length - 1; sectionIndex >= 0; sectionIndex -= 1) {
    const start = sections[sectionIndex].index;
    const end = sections[sectionIndex + 1]?.index ?? children.length;
    const sectionNodes = children.slice(start, end);
    const paragraphs = sectionNodes.flatMap((node) =>
      [
        ...(node.matches('.document-paragraph') ? [node as HTMLElement] : []),
        ...Array.from(node.querySelectorAll<HTMLElement>('.document-paragraph')),
      ]
    );
    const titleParts: string[] = [];
    const details = new Map<string, string[]>();
    let activeDetail = '';

    paragraphs.forEach((paragraph, paragraphIndex) => {
      const marker = paragraph.querySelector('.document-list-marker')?.textContent?.trim() ?? '';
      const text = paragraph.textContent?.replace(/^[\u2022\u00b7\u25aa\u25cf\s]+/, '').replace(/\s+/g, ' ').trim() ?? '';
      if (!text) return;

      if (paragraphIndex < 3 && !marker) {
        titleParts.push(text);
        return;
      }

      const field = text.match(/^(الشركة المصنعة|manufacturer|الموديل|model|الوصف|description|التركيزات|concentrations?|(?:أهم )?التحاليل(?: الخاصة به| المرتبطة به| المرتبطة| الخاصة)?|(?:main |related |special )?(?:tests|analyses)(?: related to it)?)\s*[:：]\s*(.*)$/i);
      if (field) {
        const fieldName = field[1].toLowerCase();
        const label = fieldName.includes('الشركة المصنعة') || fieldName === 'manufacturer'
          ? (isEnglish ? 'Manufacturer' : 'الشركة المصنعة')
          : fieldName === 'الموديل' || fieldName === 'model'
            ? (isEnglish ? 'Model' : 'الموديل')
            : fieldName === 'الوصف' || fieldName === 'description'
              ? (isEnglish ? 'Description' : 'الوصف')
              : fieldName === 'التركيزات' || fieldName.startsWith('concentration')
                ? (isEnglish ? 'Concentrations' : 'التركيزات')
                : (isEnglish ? 'Analyses' : 'التحاليل');
        activeDetail = label;
        if (!details.has(label)) details.set(label, []);
        if (field[2]) details.get(label)?.push(field[2]);
        return;
      }

      if (!activeDetail) activeDetail = 'الوصف';
      const value = marker && !/^[\u2022\u00b7\u25aa\u25cf]$/.test(marker) ? `${marker} ${text}` : text;
      details.get(activeDetail)?.push(value);
    });

    const deviceNumber = Number(titleParts[0]?.match(/^\d+/)?.[0]);
    const conciseSummaries: Record<number, { description: string; analyses: string }> = isEnglish
      ? {
        2: {
          description: 'Measures total adsorbable organic halogens in water. AOX is an overall indicator for compounds containing halogens such as chlorine and bromine; it does not identify each compound individually.',
          analyses: 'Adsorbable Organic Halogens (AOX).',
        },
        3: {
          description: 'Measures carbon present in organic compounds to monitor organic content, water quality, and changes between samples or treatment stages. It does not identify individual compounds.',
          analyses: 'Total Organic Carbon (TOC).',
        },
        4: {
          description: 'Prepares and extracts samples before analysis, concentrating low-level compounds, cleaning the sample, and reducing matrix effects. It is a sample-preparation step, not a direct measuring instrument.',
          analyses: 'Sample preparation for compounds such as phenols, PAHs, and semi-volatile organic compounds.',
        },
        5: {
          description: 'GC separates compounds in a sample mixture; MS identifies, determines, and measures them.',
          analyses: 'Phenolic compounds; polycyclic aromatic hydrocarbons (PAHs); organochlorine pesticides and herbicides; and base/neutral compounds.',
        },
        6: {
          description: 'A detector with good sensitivity for many organic compounds, especially carbon-containing compounds.',
          analyses: 'Phenolic compounds such as phenol, chlorophenols, nitrophenols, trichlorophenol, and pentachlorophenol.',
        },
        7: {
          description: 'Releases volatile compounds from the sample, traps and concentrates them, then transfers them to GC for analysis. This helps measure low concentrations.',
          analyses: 'Volatile organic compounds (VOCs), including vinyl chloride, chloroform, benzene, toluene, and xylenes.',
        },
      }
      : {
      2: {
        description: 'يقيس إجمالي الهالوجينات العضوية القابلة للامتزاز في المياه، ويقدم مؤشرًا إجماليًا لمركبات مثل الكلور والبروم دون تحديد كل مركب منفردًا.',
        analyses: 'Adsorbable Organic Halogens (AOX).',
      },
      3: {
        description: 'يقيس الكربون الموجود في صورة مركبات عضوية، لمتابعة المحتوى العضوي وجودة المياه والتغيرات بين العينات ومراحل المعالجة، دون تحديد هوية كل مركب.',
        analyses: 'Total Organic Carbon (TOC).',
      },
      4: {
        description: 'يحضّر ويستخلص العينات قبل التحليل، ويركز المركبات منخفضة التركيز وينقي العينة ويقلل تأثير مكوناتها؛ وهو مرحلة تحضير وليس جهاز قياس مباشر.',
        analyses: 'يُستخدم لتحضير مركبات مثل الفينولات وPAHs والمركبات العضوية شبه المتطايرة.',
      },
      5: {
        description: 'يفصل GC المركبات في خليط العينة، ثم يتيح MS التعرف عليها وتحديدها وقياسها.',
        analyses: 'المركبات الفينولية؛ الهيدروكربونات العطرية متعددة الحلقات (PAHs)؛ المبيدات العضوية الكلورية ومبيدات الحشائش؛ ومركبات Base/Neutral.',
      },
      6: {
        description: 'كاشف ذو حساسية جيدة لعدد من المركبات العضوية، خصوصًا المركبات المحتوية على الكربون.',
        analyses: 'المركبات الفينولية، مثل Phenol وChlorophenols وNitrophenols وTrichlorophenol وPentachlorophenol.',
      },
      7: {
        description: 'يحرر المركبات المتطايرة من العينة ويحتجزها ويركزها، ثم ينقلها إلى GC للتحليل، ما يساعد على قياس التراكيز المنخفضة.',
        analyses: 'المركبات العضوية المتطايرة (VOCs)، مثل Vinyl Chloride وChloroform وBenzene وToluene وXylenes.',
      },
      };
    const summary = conciseSummaries[deviceNumber];
    if (summary) {
      details.set(isEnglish ? 'Description' : 'الوصف', [summary.description]);
      details.set(isEnglish ? 'Analyses' : 'التحاليل', [summary.analyses]);
    }

    const wrapper = content.ownerDocument.createElement('div');
    wrapper.className = 'document-table-wrap organic-device-table-wrap';
    const table = content.ownerDocument.createElement('table');
    table.className = 'organic-device-table';
    const body = content.ownerDocument.createElement('tbody');
    const headingRow = content.ownerDocument.createElement('tr');
    const heading = content.ownerDocument.createElement('th');
    heading.className = 'organic-device-title';
    heading.colSpan = 2;
    heading.scope = 'colgroup';
    heading.dir = 'auto';
    heading.textContent = titleParts.join(' — ');
    headingRow.append(heading);
    body.append(headingRow);

    details.forEach((values, label) => {
      if (!values.length) return;
      const row = content.ownerDocument.createElement('tr');
      const labelCell = content.ownerDocument.createElement('th');
      labelCell.scope = 'row';
      labelCell.textContent = label;
      const valueCell = content.ownerDocument.createElement('td');
      valueCell.textContent = values.join(isEnglish ? ', ' : '، ');
      row.append(labelCell, valueCell);
      body.append(row);
    });

    table.append(body);
    wrapper.append(table);
    sectionNodes[0].before(wrapper);
    sectionNodes.forEach((node) => node.remove());
  }
}

function compactOrganicLabPesticideLists(content: Element, isEnglish: boolean) {
  const children = Array.from(content.children);
  const firstCategoryIndex = children.findIndex((element) =>
    isEnglish
      ? /triazine pesticides/i.test(element.textContent ?? '')
      : element.textContent?.trim().startsWith('أ. مبيدات التريازين والمبيدات الفوسفورية')
  );
  if (firstCategoryIndex < 0) return;

  const secondCategoryIndex = children.findIndex((element, index) =>
    index > firstCategoryIndex
    && (isEnglish
      ? /carbamate pesticides/i.test(element.textContent ?? '')
      : element.textContent?.trim().startsWith('ب. مبيدات الكربامات'))
  );
  if (secondCategoryIndex < 0) return;

  const endIndex = children.findIndex((element, index) =>
    index > secondCategoryIndex && element.textContent?.trim().startsWith('2 -AOX Analyzer')
  );
  if (endIndex < 0) return;

  const readNames = (start: number, end: number) =>
    children
      .slice(start, end)
      .map((element) => {
        const item = element.cloneNode(true) as Element;
        item.querySelector('.document-list-marker')?.remove();
        return item.textContent?.trim() ?? '';
      })
      .filter((text) => text && text !== 'مثل:' && text !== 'مثل' && !/^(such as|for example):?$/i.test(text))
      .join(isEnglish ? ', ' : '، ');

  const categories = [
    {
      title: isEnglish
        ? 'Triazine and organophosphorus pesticides and selected herbicides'
        : 'مبيدات التريازين والمبيدات الفوسفورية وبعض مبيدات الحشائش',
      names: readNames(firstCategoryIndex + 1, secondCategoryIndex),
    },
    {
      title: isEnglish ? 'Carbamate pesticides' : 'مبيدات الكربامات',
      names: readNames(secondCategoryIndex + 1, endIndex),
    },
  ];

  const wrapper = content.ownerDocument.createElement('div');
  wrapper.className = 'document-table-wrap organic-pesticide-table-wrap';
  const table = content.ownerDocument.createElement('table');
  table.className = 'organic-pesticide-table';
  const body = content.ownerDocument.createElement('tbody');

  categories.forEach(({ title, names }) => {
    const row = content.ownerDocument.createElement('tr');
    const heading = content.ownerDocument.createElement('th');
    heading.scope = 'row';
    heading.textContent = title;
    const list = content.ownerDocument.createElement('td');
    list.textContent = names;
    row.append(heading, list);
    body.append(row);
  });

  table.append(body);
  wrapper.append(table);
  children[firstCategoryIndex].before(wrapper);
  children.slice(firstCategoryIndex, endIndex).forEach((element) => element.remove());
}

function placeQualityManagementImagesSideBySide(content: Element) {
  const imageParagraphs = Array.from(content.querySelectorAll<HTMLElement>(':scope > .document-paragraph'))
    .filter((paragraph) => paragraph.querySelector('img'));
  const lastTwoImages = imageParagraphs.slice(-2);
  if (lastTwoImages.length !== 2) return;

  const [firstParagraph, secondParagraph] = lastTwoImages;
  if (firstParagraph.parentElement !== content || secondParagraph.parentElement !== content) return;

  const imagePair = content.ownerDocument.createElement('div');
  imagePair.className = 'central-lab-image-pair';
  secondParagraph.before(imagePair);
  imagePair.append(firstParagraph, secondParagraph);

  let previousElement = imagePair.previousElementSibling;
  while (previousElement?.classList.contains('document-page-break')) {
    const pageBreak = previousElement;
    previousElement = pageBreak.previousElementSibling;
    pageBreak.remove();
  }

  let nextElement = imagePair.nextElementSibling;
  while (nextElement?.classList.contains('document-page-break')) {
    const pageBreak = nextElement;
    nextElement = pageBreak.nextElementSibling;
    pageBreak.remove();
  }
}

function arrangeQualityManagementArticleAndImages(content: Element) {
  content.querySelectorAll('.document-page-break').forEach((pageBreak) => pageBreak.remove());

  const tableWrapper = Array.from(content.querySelectorAll(':scope > .document-table-wrap')).find((wrapper) =>
    Array.from(wrapper.querySelectorAll('td')).some((cell) => {
      const text = cell.textContent ?? '';
      return text.includes('وصف الإدارة') || /Description of management/i.test(text);
    })
  );
  const articleParagraphs = tableWrapper
    ? Array.from(tableWrapper.querySelectorAll<HTMLElement>('.document-paragraph'))
    : [];
  const imageParagraphs = Array.from(content.querySelectorAll<HTMLElement>(':scope > .document-paragraph'))
    .filter((paragraph) => paragraph.querySelector('img'));

  if (tableWrapper && articleParagraphs.length > 0 && imageParagraphs.length >= 2) {
    const article = content.ownerDocument.createElement('article');
    article.className = 'quality-management-article';

    articleParagraphs.forEach((paragraph) => {
      const text = paragraph.textContent?.replace(/\s+/g, ' ').trim() ?? '';
      if (/^(وصف الإدارة|description of management)$/i.test(text)
        || /^(دور الإدارة|دور الادارة|management role)$/i.test(text)) {
        paragraph.classList.add('document-heading');
      }
    });

    const standardsIndex = articleParagraphs.findIndex((paragraph) => {
      const text = paragraph.textContent?.replace(/\s+/g, ' ').trim() ?? '';
      return text.includes('معايير دولية') || /international standards/i.test(text);
    });
    const roleIndex = articleParagraphs.findIndex((paragraph) => {
      const text = paragraph.textContent?.replace(/\s+/g, ' ').trim() ?? '';
      return /^(دور الإدارة|دور الادارة|management role)$/i.test(text);
    });
    if (standardsIndex < 0 || roleIndex <= standardsIndex) return;

    tableWrapper.remove();
    imageParagraphs.forEach((paragraph) => paragraph.remove());

    const createFeature = (paragraphs: HTMLElement[], image: HTMLElement) => {
      const feature = content.ownerDocument.createElement('section');
      feature.className = 'quality-management-feature';
      const copy = content.ownerDocument.createElement('div');
      copy.className = 'quality-management-feature-copy';
      paragraphs.forEach((paragraph) => copy.append(paragraph));
      feature.append(copy, image);
      return feature;
    };

    article.append(
      createFeature(articleParagraphs.slice(0, standardsIndex), imageParagraphs[0]),
      createFeature(articleParagraphs.slice(standardsIndex, roleIndex), imageParagraphs[1]),
    );
    articleParagraphs.slice(roleIndex).forEach((paragraph) => article.append(paragraph));
    content.append(article);
    return;
  }

  placeQualityManagementImagesSideBySide(content);
}

function LaboratoriesSectorCentralLabPage() {
  const { language } = useSiteLanguage();
  const isEnglish = language === 'en';
  const { documentId } = useParams<{ documentId: string }>();
  const [searchParams] = useSearchParams();
  const [documentHtml, setDocumentHtml] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);
  const requestedDocumentId = Number(documentId ?? searchParams.get('document') ?? 1);
  const selectedDocument = CENTRAL_LAB_DOCUMENTS.find((document) => document.id === requestedDocumentId)
    ?? CENTRAL_LAB_DOCUMENTS[0];
  const selectedTitle = isEnglish ? selectedDocument.en : selectedDocument.ar;

  useEffect(() => {
    const controller = new AbortController();

    const loadDocument = async () => {
      setIsLoading(true);
      setLoadError('');
      setDocumentHtml('');

      try {
        const documentPath = isEnglish
          ? `/central-lab/en/${selectedDocument.id}.html`
          : `/central-lab/${selectedDocument.id}.html`;
        const response = await fetch(documentPath, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Document request failed with status ${response.status}`);
        }

        const html = await response.text();
        const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
        const content = parsedDocument.querySelector('.document-content');
        if (!content) {
          throw new Error(`Document ${selectedDocument.id} has no rendered content`);
        }
        if (isEnglish) {
          content.querySelectorAll<HTMLElement>('[dir="rtl"]').forEach((element) => {
            element.dir = 'ltr';
            if (element.style.textAlign === 'right') element.style.textAlign = 'left';
          });
        }
        normalizeBulletMarkers(content);
        if (selectedDocument.id === 3) {
          removeOrganicLabHeader(content, isEnglish);
          arrangeOrganicLabListsInTables(content);
          compactOrganicLabPesticideLists(content, isEnglish);
          summarizeOrganicLabEquipment(content, isEnglish);
        }
        removePageMetadataHeading(content);
        removePageEditorialNotes(content);
        if (selectedDocument.id === 7) {
          arrangeLaboratoryOverviewArticle(content);
          normalizeBiologicalLabImageCaptions(content, isEnglish);
          if (window.matchMedia('(min-width: 768px)').matches) {
            arrangeFinalBiologicalLaboratoryDevice(content, isEnglish);
          }
        }
        if (selectedDocument.id === 2) {
          arrangeLaboratoryOverviewArticle(content, false);
        }
        if (selectedDocument.id === 2 || selectedDocument.id === 4 || selectedDocument.id === 7) {
          content.querySelectorAll<HTMLImageElement>('.document-image').forEach((image) => {
            image.dataset.zoomable = 'true';
            image.tabIndex = 0;
            image.setAttribute('role', 'button');
            image.setAttribute(
              'aria-label',
              isEnglish
                ? `Enlarge image: ${image.alt || 'device image'}`
                : `تكبير الصورة: ${image.alt || 'صورة الجهاز'}`,
            );
          });
        }
        if (selectedDocument.id === 2 && window.matchMedia('(min-width: 768px)').matches) {
          arrangeSampleCollectionDevices(content, isEnglish);
        }
        if (selectedDocument.id === 6) {
          removeBacteriologyDeviceSectionHeadings(content, isEnglish);
          arrangeLaboratoryOverviewArticle(content);
        }
        if (selectedDocument.id === 5) {
          arrangeLaboratoryOverviewArticle(content);
          arrangeInorganicLaboratoryDepartments(content);
          arrangeInorganicLaboratoryAnalyses(content);
          arrangeInorganicLaboratoryEquipment(content);
          formatInorganicIcpMsDetails(content);
          if (window.matchMedia('(min-width: 768px)').matches) {
            arrangeLaboratoryDeviceTables(content, isEnglish, /\/5-image(?:[3-9]|10)\./i);
          }
        }
        if (selectedDocument.id === 6 && window.matchMedia('(min-width: 768px)').matches) {
          arrangeLaboratoryDeviceTables(content, isEnglish, /\/6-image\d+\./i, 'bacteriology-lab-device-card');
        }
        if (selectedDocument.id === 4) {
          arrangeOrganicEquipmentGallery(content);
        }
        if (selectedDocument.id === 8) {
          arrangeQualityManagementArticleAndImages(content);
        }
        setDocumentHtml(content.innerHTML);
      } catch (error) {
        if ((error as Error).name === 'AbortError') return;
        setLoadError(
          isEnglish
            ? 'Unable to load this document. Please try again later.'
            : 'تعذر تحميل هذا الملف. يرجى المحاولة مرة أخرى لاحقًا.',
        );
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    void loadDocument();
    return () => controller.abort();
  }, [selectedDocument.id, isEnglish]);

  useEffect(() => {
    if (!lightboxImage) return undefined;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxImage(null);
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [lightboxImage]);

  return (
    <>
      <Header />
      <main
        className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.08),_transparent_50%)]"
        dir={isEnglish ? 'ltr' : 'rtl'}
      >
        <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)]">
            <header className="border-b border-[#d7b05a]/35 bg-white px-6 py-7 text-[#0a3555] sm:px-8">
              <h1 className={`text-3xl font-black leading-tight sm:text-4xl ${isEnglish ? 'text-left' : 'text-right'}`}>
                {selectedTitle}
              </h1>
            </header>

            <div className="px-4 py-6 sm:px-8 sm:py-8">
              <section
                id="central-lab-document-panel"
                aria-label={selectedTitle}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                {isLoading ? (
                  <p className="p-8 text-center text-sm font-semibold text-slate-500" role="status">
                    {isEnglish ? 'Loading document...' : 'جارٍ تحميل الصفحة...'}
                  </p>
                ) : loadError ? (
                  <p className="p-8 text-center text-sm font-semibold text-red-700" role="alert">
                    {loadError}
                  </p>
                ) : (
                  <div
                    className={[
                      'central-lab-document',
                      isEnglish ? 'central-lab-document--english' : '',
                      selectedDocument.id === 3 ? 'central-lab-document--organic' : '',
                    ].filter(Boolean).join(' ')}
                    aria-label={selectedTitle}
                    dangerouslySetInnerHTML={{ __html: documentHtml }}
                    onClick={(event) => {
                      const image = (event.target as HTMLElement).closest<HTMLImageElement>('img[data-zoomable="true"]');
                      if (image) setLightboxImage({ src: image.src, alt: image.alt });
                    }}
                    onKeyDown={(event) => {
                      if (event.key !== 'Enter' && event.key !== ' ') return;
                      const image = (event.target as HTMLElement).closest<HTMLImageElement>('img[data-zoomable="true"]');
                      if (!image) return;
                      event.preventDefault();
                      setLightboxImage({ src: image.src, alt: image.alt });
                    }}
                  />
                )}
              </section>
            </div>
          </section>
        </div>
      </main>
      {lightboxImage ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={isEnglish ? 'Enlarged device image' : 'صورة الجهاز مكبرة'}
          className="central-lab-image-lightbox"
          onClick={() => setLightboxImage(null)}
        >
          <button
            type="button"
            className="central-lab-image-lightbox-close"
            aria-label={isEnglish ? 'Close image' : 'إغلاق الصورة'}
            onClick={() => setLightboxImage(null)}
          >
            {isEnglish ? 'Close' : 'إغلاق'}
          </button>
          <img
            src={lightboxImage.src}
            alt={lightboxImage.alt}
            className="central-lab-image-lightbox-image"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
      <Footer />
    </>
  );
}

export default LaboratoriesSectorCentralLabPage;
