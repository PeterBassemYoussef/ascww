$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$outputDirectory = Join-Path $projectRoot 'public\central-lab'
$imageDirectory = Join-Path $outputDirectory 'images'

Push-Location $projectRoot
try {
    python scripts\convert-central-lab-docs.py
    if ($LASTEXITCODE -ne 0) {
        throw 'The Word-to-HTML conversion failed.'
    }

    Add-Type -AssemblyName System.Drawing
    foreach ($sourceFile in Get-ChildItem -LiteralPath $imageDirectory -Filter '*.emf' -File) {
        $targetPath = [IO.Path]::ChangeExtension($sourceFile.FullName, '.png')
        $image = [System.Drawing.Image]::FromFile($sourceFile.FullName)
        try {
            $width = $image.Width
            $height = $image.Height
            $bitmap = [System.Drawing.Bitmap]::new($width, $height)
            try {
                $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
                try {
                    $graphics.Clear([System.Drawing.Color]::White)
                    $graphics.DrawImage($image, 0, 0, $width, $height)
                    $bitmap.Save($targetPath, [System.Drawing.Imaging.ImageFormat]::Png)
                }
                finally {
                    $graphics.Dispose()
                }
            }
            finally {
                $bitmap.Dispose()
            }
        }
        finally {
            $image.Dispose()
        }

        $relativeEmfPath = '/central-lab/images/' + $sourceFile.Name
        $relativePngPath = '/central-lab/images/' + [IO.Path]::GetFileName($targetPath)
        foreach ($htmlFile in Get-ChildItem -LiteralPath $outputDirectory -Filter '*.html' -File) {
            $html = [IO.File]::ReadAllText($htmlFile.FullName)
            if ($html.Contains($relativeEmfPath)) {
                $html = $html.Replace($relativeEmfPath, $relativePngPath)
                [IO.File]::WriteAllText($htmlFile.FullName, $html, [Text.UTF8Encoding]::new($false))
            }
        }
        Remove-Item -LiteralPath $sourceFile.FullName -Force
    }
}
finally {
    Pop-Location
}
