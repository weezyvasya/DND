# SteamPipe Configuration

This folder contains configuration files for uploading your game to Steam via SteamPipe.

## Prerequisites

1. **Steamworks SDK** - Download from https://partner.steamgames.com/downloads
2. **Steam App ID** - Get this after registering on Steamworks
3. **Depot IDs** - Created in Steamworks dashboard

## Setup Instructions

### Step 1: Update Configuration Files

Replace placeholder values in all `.vdf` files:
- `YOUR_APP_ID` → Your actual Steam App ID (e.g., `2500000`)
- `YOUR_DEPOT_ID_WIN` → Windows depot ID (typically AppID + 1)
- `YOUR_DEPOT_ID_MAC` → macOS depot ID (typically AppID + 2)
- `YOUR_DEPOT_ID_LINUX` → Linux depot ID (typically AppID + 3)

### Step 2: Prepare Build Content

Run the build preparation script:
```bash
npm run steam:prepare
```

This will:
1. Build for all platforms
2. Organize files into `steam-builds/` directory
3. Create proper folder structure for SteamPipe

### Step 3: Upload to Steam

1. Open Command Prompt in Steamworks SDK folder
2. Navigate to `sdk/tools/ContentBuilder/`
3. Run:
```bash
builder/steamcmd.exe +login YOUR_STEAM_USERNAME YOUR_PASSWORD +run_app_build "../../../YOUR_PROJECT/steam-config/app_build.vdf" +quit
```

Or use Steam Guard (recommended):
```bash
builder/steamcmd.exe +login YOUR_STEAM_USERNAME +run_app_build "../../../YOUR_PROJECT/steam-config/app_build.vdf" +quit
```

## File Descriptions

| File | Purpose |
|------|---------|
| `app_build.vdf` | Main build configuration, references all depots |
| `depot_win.vdf` | Windows depot file mappings |
| `depot_mac.vdf` | macOS depot file mappings |
| `depot_linux.vdf` | Linux depot file mappings |

## Depot ID Convention

Steam typically uses this convention:
- **App ID**: `2500000` (example)
- **Windows Depot**: `2500001` (AppID + 1)
- **macOS Depot**: `2500002` (AppID + 2)
- **Linux Depot**: `2500003` (AppID + 3)

## Build Branches

| Branch | Description |
|--------|-------------|
| `default` | Public release branch |
| `beta` | Beta testing branch |
| `internal` | Internal testing only |

## Troubleshooting

### "Login failed"
- Check username/password
- Steam Guard code may be required
- Try logging into Steam client first

### "Depot not found"
- Verify depot IDs in Steamworks dashboard
- Make sure depots are properly configured

### "File mapping error"
- Check that `steam-builds/` folder exists
- Verify paths in depot VDF files
- Run `npm run steam:prepare` first
