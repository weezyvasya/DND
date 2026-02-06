# D20 Dice Roller

A native macOS desktop application for rolling D20 dice, featuring a transparent overlay window that stays on top of all other applications.

## Features

- 🎲 **3D Dice Visualization**: Realistic 3D D20 dice with smooth rolling animations
- 🪟 **Transparent Overlay**: Always-on-top window with click-through support
- ⌨️ **Keyboard Shortcuts**: Press Spacebar to roll
- ⚙️ **Settings Panel**: Adjust opacity, animation speed, and click-through mode
- 📜 **Roll History**: Track your last 5 rolls
- 🎨 **Modern UI**: Beautiful, minimalistic interface with Tailwind CSS

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Desktop**: Electron + Electron Forge
- **Styling**: Tailwind CSS
- **3D Graphics**: React Three Fiber + Three.js
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- macOS (for building the .app bundle)

### Installation

1. Install dependencies:
```bash
npm install
```

### Development

Run the app in development mode:
```bash
npm start
```

This will:
- Start the Vite dev server
- Launch Electron with hot reload enabled

### Building for Production

Package the application:
```bash
npm run package
```

Create a distributable (.dmg for macOS):
```bash
npm run make
```

The built application will be in the `out/` directory.

## Usage

1. **Roll the Dice**: Click the dice or press Spacebar
2. **Move the Window**: Click and drag anywhere on the dice area
3. **Settings**: Click the gear icon to adjust opacity, animation speed, and click-through mode
4. **Close**: Click the X button to quit the application

## Project Structure

```
.
├── src/
│   ├── main/           # Electron main process
│   ├── preload/        # Electron preload script
│   ├── components/     # React components
│   │   ├── App.tsx
│   │   ├── Dice3D.tsx
│   │   ├── Controls.tsx
│   │   ├── Settings.tsx
│   │   └── RollHistory.tsx
│   └── styles/         # CSS styles
├── package.json
└── vite.*.config.ts    # Vite configuration files
```

## Configuration

### macOS App Bundle

The app is configured with Electron Forge to create a proper macOS .app bundle. For code signing and notarization, you'll need to configure:

1. Add your Apple Developer credentials in `package.json` under `config.forge.packagerConfig.osxNotarize`
2. Ensure you have the necessary certificates installed

## License

MIT
# DND
