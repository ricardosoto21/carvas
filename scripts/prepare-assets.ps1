Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$assetRoot = Join-Path $root "assets"

$manifest = @(
    @{ Source = "Blue and White Minimalist Construction Logo.png"; Destination = "brand/logo.png"; Type = "copy" }
    @{ Source = "Imagenes sitio web carvas/Carrusel 1/20260309_185719.jpg"; Destination = "photos/hero/hero-01.jpg"; Type = "image"; MaxWidth = 1920; Quality = 86 }
    @{ Source = "Imagenes sitio web carvas/Carrusel 1/20260113_124210.jpg"; Destination = "photos/hero/hero-02.jpg"; Type = "image"; MaxWidth = 1920; Quality = 86 }
    @{ Source = "Imagenes sitio web carvas/Carrusel 1/20251002_143649.jpg"; Destination = "photos/hero/hero-03.jpg"; Type = "image"; MaxWidth = 1920; Quality = 84 }
    @{ Source = "Imagenes sitio web carvas/sobre nosotros/20250219_203610.jpg"; Destination = "photos/about/about-main.jpg"; Type = "image"; MaxWidth = 1680; Quality = 86 }
    @{ Source = "Imagenes sitio web carvas/casa 1/20250519_172553.jpg"; Destination = "photos/projects/casa-1-cover.jpg"; Type = "image"; MaxWidth = 1600; Quality = 86 }
    @{ Source = "Imagenes sitio web carvas/casa 1/20250519_120432.jpg"; Destination = "photos/projects/casa-1-radier.jpg"; Type = "image"; MaxWidth = 1400; Quality = 84 }
    @{ Source = "Imagenes sitio web carvas/casa 1/20250401_122421.jpg"; Destination = "photos/projects/casa-1-structure.jpg"; Type = "image"; MaxWidth = 1400; Quality = 84 }
    @{ Source = "Imagenes sitio web carvas/casa 2/20260309_185721.jpg"; Destination = "photos/projects/casa-2-cover.jpg"; Type = "image"; MaxWidth = 1600; Quality = 86 }
    @{ Source = "Imagenes sitio web carvas/casa 2/20260309_132120.jpg"; Destination = "photos/projects/casa-2-frame.jpg"; Type = "image"; MaxWidth = 1400; Quality = 84 }
    @{ Source = "Imagenes sitio web carvas/casa 2/20251002_143652.jpg"; Destination = "photos/projects/casa-2-progress.jpg"; Type = "image"; MaxWidth = 1400; Quality = 84 }
    @{ Source = "Imagenes sitio web carvas/casa 3/WhatsApp Image 2026-06-09 at 11.39.45.jpeg"; Destination = "photos/projects/casa-3-cover.jpg"; Type = "image"; MaxWidth = 1280; Quality = 84 }
    @{ Source = "Imagenes sitio web carvas/casa 3/WhatsApp Image 2026-06-09 at 11.39.44.jpeg"; Destination = "photos/projects/casa-3-structure.jpg"; Type = "image"; MaxWidth = 1280; Quality = 84 }
    @{ Source = "Imagenes sitio web carvas/Carrusel 1/20251002_143649.jpg"; Destination = "photos/projects/radier-cover.jpg"; Type = "image"; MaxWidth = 1600; Quality = 84 }
    @{ Source = "Imagenes sitio web carvas/Carrusel 1/WhatsApp Image 2026-06-09 at 10.13.01 (1).jpeg"; Destination = "photos/projects/radier-detail.jpg"; Type = "image"; MaxWidth = 1600; Quality = 84 }
    @{ Source = "Imagenes sitio web carvas/imagenes galeria de trabajos/WhatsApp Image 2026-03-07 at 18.56.06.jpeg"; Destination = "photos/gallery/gallery-01.jpg"; Type = "image"; MaxWidth = 1400; Quality = 84 }
    @{ Source = "Imagenes sitio web carvas/imagenes galeria de trabajos/WhatsApp Image 2026-05-28 at 11.27.03.jpeg"; Destination = "photos/gallery/gallery-02.jpg"; Type = "image"; MaxWidth = 1400; Quality = 84 }
    @{ Source = "Imagenes sitio web carvas/imagenes galeria de trabajos/WhatsApp Image 2026-05-28 at 11.27.02.jpeg"; Destination = "photos/gallery/gallery-03.jpg"; Type = "image"; MaxWidth = 1400; Quality = 84 }
    @{ Source = "Imagenes sitio web carvas/imagenes galeria de trabajos/WhatsApp Image 2026-03-07 at 17.03.20.jpeg"; Destination = "photos/gallery/gallery-04.jpg"; Type = "image"; MaxWidth = 1400; Quality = 84 }
    @{ Source = "Imagenes sitio web carvas/imagenes galeria de trabajos/WhatsApp Image 2026-03-07 at 15.38.16 (1).jpeg"; Destination = "photos/gallery/gallery-05.jpg"; Type = "image"; MaxWidth = 1400; Quality = 84 }
    @{ Source = "Imagenes sitio web carvas/imagenes galeria de trabajos/WhatsApp Image 2026-03-07 at 15.38.16 (2).jpeg"; Destination = "photos/gallery/gallery-06.jpg"; Type = "image"; MaxWidth = 1400; Quality = 84 }
    @{ Source = "Imagenes sitio web carvas/imagenes galeria de trabajos/WhatsApp Image 2024-11-05 at 15.20.32.jpeg"; Destination = "photos/gallery/gallery-07.jpg"; Type = "image"; MaxWidth = 1400; Quality = 84 }
    @{ Source = "Imagenes sitio web carvas/imagenes galeria de trabajos/WhatsApp Image 2024-11-05 at 16.26.48 (2).jpeg"; Destination = "photos/gallery/gallery-08.jpg"; Type = "image"; MaxWidth = 1400; Quality = 84 }
)

function Ensure-Directory {
    param([string]$Path)

    if (-not (Test-Path -LiteralPath $Path)) {
        New-Item -ItemType Directory -Path $Path -Force | Out-Null
    }
}

function Get-ImageEncoder {
    param([string]$MimeType)

    return [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
        Where-Object { $_.MimeType -eq $MimeType } |
        Select-Object -First 1
}

function Get-RotateFlipType {
    param([int]$Orientation)

    switch ($Orientation) {
        3 { return [System.Drawing.RotateFlipType]::Rotate180FlipNone }
        6 { return [System.Drawing.RotateFlipType]::Rotate90FlipNone }
        8 { return [System.Drawing.RotateFlipType]::Rotate270FlipNone }
        default { return [System.Drawing.RotateFlipType]::RotateNoneFlipNone }
    }
}

function Get-OrientationValue {
    param([System.Drawing.Image]$Image)

    $orientationItem = $Image.PropertyItems | Where-Object { $_.Id -eq 274 } | Select-Object -First 1
    if (-not $orientationItem) {
        return 1
    }

    return [BitConverter]::ToUInt16($orientationItem.Value, 0)
}

function Save-ResizedImage {
    param(
        [string]$SourcePath,
        [string]$DestinationPath,
        [int]$MaxWidth,
        [int]$Quality
    )

    $sourceImage = [System.Drawing.Image]::FromFile($SourcePath)
    try {
        $orientation = Get-OrientationValue -Image $sourceImage
        $rotateFlip = Get-RotateFlipType -Orientation $orientation
        if ($rotateFlip -ne [System.Drawing.RotateFlipType]::RotateNoneFlipNone) {
            $sourceImage.RotateFlip($rotateFlip)
        }

        $newWidth = [math]::Min($sourceImage.Width, $MaxWidth)
        $newHeight = [math]::Round($sourceImage.Height * ($newWidth / [double]$sourceImage.Width))

        $bitmap = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
        try {
            $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
            try {
                $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
                $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
                $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
                $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
                $graphics.Clear([System.Drawing.Color]::White)
                $graphics.DrawImage($sourceImage, 0, 0, $newWidth, $newHeight)
            }
            finally {
                $graphics.Dispose()
            }

            $encoder = Get-ImageEncoder -MimeType "image/jpeg"
            $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
            $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]$Quality)
            $bitmap.Save($DestinationPath, $encoder, $encoderParams)
            $encoderParams.Dispose()
        }
        finally {
            $bitmap.Dispose()
        }
    }
    finally {
        $sourceImage.Dispose()
    }
}

Ensure-Directory -Path $assetRoot

foreach ($item in $manifest) {
    $sourcePath = Join-Path $root $item.Source
    $destinationPath = Join-Path $assetRoot $item.Destination
    $destinationDirectory = Split-Path -Parent $destinationPath

    Ensure-Directory -Path $destinationDirectory

    if ($item.Type -eq "copy") {
        Copy-Item -LiteralPath $sourcePath -Destination $destinationPath -Force
        continue
    }

    Save-ResizedImage -SourcePath $sourcePath -DestinationPath $destinationPath -MaxWidth $item.MaxWidth -Quality $item.Quality
}

Write-Output "Assets preparados en $assetRoot"
