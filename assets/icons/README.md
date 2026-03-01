# Application Icons

Place your application icons here in the following formats:

## Required Files

| File | Dimensions | Format | Purpose |
|------|------------|--------|---------|
| `icon.ico` | Multi-size | ICO | Windows executable icon |
| `icon.icns` | Multi-size | ICNS | macOS application icon |
| `icon.png` | 512×512 px | PNG | Linux and general use |

## Icon Sizes to Include

### Windows (.ico)
Include these sizes in a single .ico file:
- 16×16
- 24×24
- 32×32
- 48×48
- 64×64
- 128×128
- 256×256

### macOS (.icns)
Include these sizes:
- 16×16 (icon_16x16.png)
- 32×32 (icon_16x16@2x.png, icon_32x32.png)
- 64×64 (icon_32x32@2x.png)
- 128×128 (icon_128x128.png)
- 256×256 (icon_128x128@2x.png, icon_256x256.png)
- 512×512 (icon_256x256@2x.png, icon_512x512.png)
- 1024×1024 (icon_512x512@2x.png)

## Tools for Creating Icons

### Online Tools
- https://icoconvert.com/ - Create .ico files
- https://cloudconvert.com/png-to-icns - Create .icns files
- https://www.iconarchive.com/icns-converter.html - Create .icns files

### Command Line (requires ImageMagick)
```bash
# Create .ico from PNG
convert icon.png -define icon:auto-resize=256,128,64,48,32,16 icon.ico

# Create .icns on macOS
iconutil -c icns icon.iconset
```

## Design Guidelines

1. **Keep it simple** - Icon should be recognizable at 16×16
2. **Use the D20 theme** - A wooden D20 dice works well
3. **Transparent background** - Especially important for macOS
4. **Test at all sizes** - Make sure it's clear at small sizes
