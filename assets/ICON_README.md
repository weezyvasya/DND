# App Icon

To add a custom app icon for macOS:

1. Create an `.icns` file (macOS icon format) from your icon images
2. Place the `.icns` file in the `assets` directory
3. Update `package.json` in the `config.forge.packagerConfig` section:
   ```json
   "icon": "./assets/icon.icns"
   ```

For now, Electron will use a default icon. To create an `.icns` file:
- Use tools like `iconutil` (built into macOS) or online converters
- The icon should ideally have multiple sizes: 16x16, 32x32, 64x64, 128x128, 256x256, 512x512, 1024x1024
