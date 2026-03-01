# D20 Dice Roller - Steam Publishing Guide

Complete guide for publishing this application on Steam.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Build Commands](#build-commands)
3. [Pre-Publishing Checklist](#pre-publishing-checklist)
4. [Steamworks Account Setup](#steamworks-account-setup)
5. [Building for Each Platform](#building-for-each-platform)
6. [Steam Integration (Optional)](#steam-integration)
7. [Uploading to Steam](#uploading-to-steam)
8. [Store Page Setup](#store-page-setup)
9. [Pricing Configuration](#pricing-configuration)
10. [Testing and Release](#testing-and-release)
11. [Post-Release](#post-release)
12. [Troubleshooting](#troubleshooting)

---

## Project Overview

### Technical Stack
- **Frontend**: React 18 + TypeScript
- **3D Rendering**: Three.js with React Three Fiber
- **Desktop Framework**: Electron 28
- **Build Tool**: Electron Forge with Vite
- **Styling**: Tailwind CSS

### Project Structure
```
D20-Dice-Roller/
├── src/
│   ├── main/           # Electron main process
│   ├── preload/        # Preload scripts
│   ├── components/     # React components
│   ├── hooks/          # Custom React hooks
│   ├── types/          # TypeScript types
│   └── steam/          # Steam integration (optional)
├── assets/
│   ├── icons/          # Application icons
│   └── steam/          # Steam store assets
├── steam-config/       # SteamPipe configuration
├── scripts/            # Build scripts
└── steam-builds/       # Organized builds for Steam (generated)
```

---

## Build Commands

### Development
```bash
npm start              # Run in development mode
npm run dev            # Vite dev server only
```

### Single Platform Builds
```bash
npm run make:win       # Windows x64
npm run make:mac       # macOS Universal (Intel + Apple Silicon)
npm run make:linux     # Linux x64
```

### All Platforms
```bash
npm run make:all       # Build for all platforms
```

### Steam Preparation
```bash
npm run steam:prepare  # Clean, build all, and organize for Steam
npm run steam:organize # Organize existing builds for Steam
```

### Cleaning
```bash
npm run clean          # Remove build artifacts
npm run clean:all      # Remove all generated files including steam-builds
```

---

## Pre-Publishing Checklist

### Before Creating Steamworks Account

- [ ] Register as self-employed (самозанятый) in Russia
- [ ] Obtain ИНН (tax identification number)
- [ ] Set up foreign bank account for payments (recommended: Georgia, Armenia, or Kazakhstan)
- [ ] Prepare $100 USD for Steam Direct fee
- [ ] Have passport ready for verification

### Before Building

- [ ] Test application thoroughly on Windows
- [ ] Create application icons (see `assets/icons/README.md`)
- [ ] Prepare store page assets (see `assets/steam/README.md`)
- [ ] Take at least 5 high-quality screenshots (1920×1080 minimum)
- [ ] Write store description in English (Russian optional but recommended)

### Files to Create

| File | Location | Purpose |
|------|----------|---------|
| `icon.ico` | assets/icons/ | Windows icon |
| `icon.icns` | assets/icons/ | macOS icon |
| `icon.png` | assets/icons/ | Linux icon (512×512) |
| `header.jpg` | assets/steam/capsules/ | 460×215 store header |
| `small_capsule.jpg` | assets/steam/capsules/ | 231×87 search results |
| `main_capsule.jpg` | assets/steam/capsules/ | 616×353 featured |
| `library_capsule.jpg` | assets/steam/library/ | 600×900 library grid |
| `library_hero.jpg` | assets/steam/library/ | 3840×1240 library background |
| `library_logo.png` | assets/steam/library/ | 1280×720 logo (transparent) |
| Screenshots | assets/steam/screenshots/ | At least 5 screenshots |

---

## Steamworks Account Setup

### Step 1: Create Steamworks Partner Account

1. Go to https://partner.steamgames.com/
2. Click "Join Steam Distribution Program"
3. Sign in with Steam account
4. Accept Steamworks Distribution Agreement

### Step 2: Complete Tax Interview

1. Navigate to "Users & Permissions" → "Company Details"
2. Click "Tax Interview"
3. Select "Individual" or "Sole Proprietor"
4. For Russia: Select "W-8BEN" form
5. Fill in details:
   - Legal name (as on passport)
   - Country: Russian Federation
   - ИНН (tax identification number)
   - Foreign TIN: Your ИНН
6. Sign electronically

### Step 3: Pay Steam Direct Fee

1. Go to "Create New App"
2. Pay $100 USD via credit card
3. This fee is recoupable after $1,000 in revenue

### Step 4: Create Application Entry

1. Select "Application" type
2. Enter name: "D20 Dice Roller"
3. Note your assigned **App ID** (you'll need this everywhere)

### Step 5: Configure Depots

In Steamworks dashboard:
1. Go to your app → "SteamPipe" → "Depots"
2. Create depots:

| Depot Name | Platform | Depot ID |
|------------|----------|----------|
| D20 Dice Roller Windows | Windows | [AppID + 1] |
| D20 Dice Roller macOS | macOS | [AppID + 2] |
| D20 Dice Roller Linux | Linux | [AppID + 3] |

3. Set each depot's OS accordingly
4. Note the Depot IDs for SteamPipe configuration

---

## Building for Each Platform

### Windows Build (Primary)

```bash
npm run make:win
```

Output: `out/make/zip/win32/x64/D20 Dice Roller-win32-x64-1.0.0.zip`

**Testing:**
1. Extract ZIP to any folder
2. Run `D20 Dice Roller.exe`
3. Verify all features work

### Linux Build

```bash
npm run make:linux
```

Output: `out/make/zip/linux/x64/D20 Dice Roller-linux-x64-1.0.0.zip`

**Testing (requires Linux or WSL2):**
1. Extract to folder
2. Make executable: `chmod +x d20-dice-roller`
3. Run: `./d20-dice-roller`

### macOS Build

**⚠️ Requires macOS machine or CI service**

```bash
npm run make:mac
```

If you don't have a Mac:
- Use GitHub Actions (see `.github/workflows/` examples online)
- Use a macOS CI service (CircleCI, Travis CI)
- Skip macOS initially and add later

---

## Steam Integration

### Enabling Steamworks Features (Optional)

Steam features like achievements and cloud saves are **optional** but recommended.

#### Step 1: Install steamworks.js

```bash
npm install steamworks.js
```

#### Step 2: Update Configuration

Edit `src/steam/steamworks.ts`:
```typescript
const STEAM_ENABLED = true;           // Enable Steam
const STEAM_APP_ID = YOUR_APP_ID;     // Your actual App ID
```

#### Step 3: Initialize in Main Process

Edit `src/main/main.ts`:
```typescript
import { initializeSteam } from '../steam';

app.whenReady().then(async () => {
  await initializeSteam();  // Add this line
  createWindow();
});
```

### Available Steam Features

| Feature | Description | Configuration Location |
|---------|-------------|----------------------|
| Achievements | Track player progress | `src/steam/steamworks.ts` |
| Cloud Saves | Sync roll statistics | Automatic in steamworks.ts |
| Overlay | Steam overlay (Shift+Tab) | Automatic when running via Steam |
| Rich Presence | Show status in friends list | Requires additional setup |

### Pre-Defined Achievements

| Achievement ID | Unlock Condition |
|----------------|------------------|
| `ACH_FIRST_ROLL` | Roll your first die |
| `ACH_LUCKY_20` | Roll a natural 20 |
| `ACH_UNLUCKY_1` | Roll a natural 1 |
| `ACH_ROLL_100` | Roll 100 dice total |
| `ACH_ROLL_1000` | Roll 1000 dice total |
| `ACH_MULTI_MASTER` | Roll 10 dice at once |
| `ACH_ADVANTAGE_KING` | Win 50 advantage rolls |
| `ACH_ALL_DICE` | Use all dice types |

Configure these in Steamworks dashboard under "Stats & Achievements".

---

## Uploading to Steam

### Step 1: Prepare Builds

```bash
npm run steam:prepare
```

This creates:
```
steam-builds/
├── windows/    # Windows build files
├── macos/      # macOS build files (if available)
└── linux/      # Linux build files
```

### Step 2: Update SteamPipe Configuration

Edit `steam-config/app_build.vdf`:
- Replace `YOUR_APP_ID` with your App ID
- Replace `YOUR_DEPOT_ID_WIN` with Windows depot ID
- Replace `YOUR_DEPOT_ID_LINUX` with Linux depot ID
- Replace `YOUR_DEPOT_ID_MAC` with macOS depot ID (if using)

Edit each `depot_*.vdf` file similarly.

### Step 3: Download Steamworks SDK

1. Go to https://partner.steamgames.com/downloads
2. Download "Steamworks SDK"
3. Extract to a convenient location

### Step 4: Upload via SteamPipe

Open Command Prompt in SDK folder:

```bash
cd sdk/tools/ContentBuilder

# Login (first time - requires Steam Guard)
builder\steamcmd.exe +login YOUR_STEAM_USERNAME

# Upload builds
builder\steamcmd.exe +login YOUR_STEAM_USERNAME +run_app_build "C:\path\to\DND\steam-config\app_build.vdf" +quit
```

**Expected output:**
```
Logging in user 'YOUR_USERNAME'...
Uploading depot...
Successfully uploaded depot
```

### Step 5: Set Build Live

1. Go to Steamworks dashboard
2. Navigate to your app → "SteamPipe" → "Builds"
3. Find your uploaded build
4. Click "Set build live on branch: default"

---

## Store Page Setup

### Basic Information

| Field | Value |
|-------|-------|
| Name | D20 Dice Roller |
| Type | Application (not Game) |
| Genre | Utilities, Tabletop |
| Tags | Dice, Tabletop, D&D, RPG, Utility |

### Short Description (max 300 characters)
```
A transparent dice roller overlay for tabletop RPG players. Roll d4, d6, d8, d10, d12, and d20 dice with beautiful wooden animations. Features advantage/disadvantage rolls, multi-dice rolling, and always-on-top display.
```

### Detailed Description
```
[h2]D20 Dice Roller[/h2]

The perfect companion for your tabletop RPG sessions! This transparent overlay sits on top of your screen, allowing you to roll dice while viewing your virtual tabletop, character sheet, or video call.

[h3]Features[/h3]
[list]
[*] All standard RPG dice: d3, d4, d6, d8, d10, d12, d20
[*] Beautiful wooden dice with realistic rolling animation
[*] Advantage and Disadvantage rolls
[*] Multi-dice rolling (roll multiple dice at once)
[*] Transparent overlay - see through to your game
[*] Always-on-top display
[*] Roll history tracking
[*] Adjustable window size and opacity
[*] Click-through mode when not rolling
[/list]

[h3]Perfect For[/h3]
[list]
[*] Dungeons & Dragons (5e, 3.5e, or any edition)
[*] Pathfinder
[*] Call of Cthulhu
[*] Any tabletop RPG system
[*] Virtual tabletop sessions (Roll20, Foundry VTT)
[*] Discord video calls with friends
[/list]
```

### System Requirements

**Minimum:**
- OS: Windows 10 64-bit / Ubuntu 20.04 / macOS 10.15
- Processor: Intel Core i3 or equivalent
- Memory: 4 GB RAM
- Graphics: OpenGL 3.0 compatible
- Storage: 200 MB available space

**Recommended:**
- OS: Windows 11 64-bit / Ubuntu 22.04 / macOS 12
- Processor: Intel Core i5 or equivalent
- Memory: 8 GB RAM
- Graphics: Dedicated GPU with OpenGL 4.0
- Storage: 200 MB available space

### Age Rating

| Rating System | Suggested Rating |
|---------------|------------------|
| ESRB | Everyone |
| PEGI | PEGI 3 |
| USK | USK 0 |
| Russia | 0+ |

No mature content - this is a utility application.

---

## Pricing Configuration

### Setting Price

1. Go to Steamworks → your app → "Pricing"
2. Enter base price: **$1.99 USD**
3. Steam will auto-generate regional prices

### Recommended Regional Prices

| Region | Currency | Suggested Price |
|--------|----------|-----------------|
| United States | USD | $1.99 |
| European Union | EUR | €1.69 |
| United Kingdom | GBP | £1.69 |
| Russia | RUB | ₽79 |
| Brazil | BRL | R$5.99 |
| China | CNY | ¥9 |
| Japan | JPY | ¥200 |

### Revenue Calculation

| Price | Steam Cut (30%) | Your Revenue |
|-------|-----------------|--------------|
| $1.99 | $0.60 | $1.39 |

Sales needed to recoup $100 fee: **~72 copies**

---

## Testing and Release

### Pre-Release Testing

1. **Internal Testing**
   - Set a "beta" branch in SteamPipe
   - Upload test build
   - Test with Steam client

2. **Steam Deck Testing** (optional but recommended)
   - Test in Desktop mode
   - Test with controller
   - Mark Deck compatibility

3. **Review Checklist**
   - [ ] App launches correctly
   - [ ] All features work
   - [ ] No crashes or errors
   - [ ] Window transparency works
   - [ ] Click-through mode works
   - [ ] Settings are saved

### Submitting for Review

1. Complete all store page sections
2. Upload all required assets
3. Set release date (or "Coming Soon")
4. Click "Mark as Ready for Review"
5. Wait 2-5 business days

### Release Day

1. Receive approval email
2. Go to "Release" section
3. Click "Release App"
4. Your app is now live!

---

## Post-Release

### Monitoring

- Check reviews daily in first week
- Respond to negative reviews constructively
- Monitor Steam forums for bug reports

### Updates

For each update:
1. Increment version in `package.json`
2. Rebuild: `npm run steam:prepare`
3. Upload via SteamPipe
4. Set new build live
5. Write patch notes in Steamworks

### Marketing Tips

- Post to r/dndnext, r/rpg, r/IndieGaming
- Create a trailer video
- Reach out to TTRPG YouTubers
- Consider a launch discount (10-15%)

---

## Troubleshooting

### Build Issues

**"Module not found" errors**
```bash
rm -rf node_modules
npm install
```

**macOS build fails on Windows**
- This is expected - you need a Mac or CI service
- Skip macOS initially, add later

**Linux build fails**
```bash
# On Windows, you may need WSL2
wsl npm run make:linux
```

### Steam Upload Issues

**"Login failed"**
- Check username/password
- Complete Steam Guard verification
- Try logging into Steam client first

**"Depot not found"**
- Verify depot IDs in Steamworks dashboard
- Check depot_*.vdf files have correct IDs

**"File too large"**
- Electron apps are typically 150-200MB
- This is normal and acceptable

### Runtime Issues

**"App won't start via Steam"**
- Check executable name matches what Steam expects
- Verify launch options in Steamworks

**"Overlay not working"**
- Steam overlay requires running via Steam client
- Won't work in development mode

---

## Payment Information for Russian Developers

### Current Situation (2026)

Due to sanctions, direct payments to Russian bank accounts are not possible.

### Recommended Solutions

1. **Foreign Bank Account**
   - Open account in Georgia, Armenia, Kazakhstan, or Turkey
   - Steam can send payments to these accounts
   - Wire transfer fees apply (~$25-50 per transfer)

2. **Payoneer** (limited)
   - May work if registered before restrictions
   - Create account with non-Russian address

3. **Publisher Partnership**
   - Partner with non-Russian publisher
   - They handle payments, take 20-30% cut
   - Easier but reduces revenue

### Tax Obligations

As a self-employed person (самозанятый) in Russia:
- Report foreign income to FNS
- Pay 4-6% tax on income
- Keep records of all transactions

---

## Quick Reference Card

### Commands
```bash
npm start              # Development
npm run make:win       # Build Windows
npm run make:linux     # Build Linux
npm run steam:prepare  # Prepare for Steam upload
```

### Key Files
```
package.json           # Version, scripts
forge.config.ts        # Build configuration
steam-config/*.vdf     # SteamPipe configuration
src/steam/steamworks.ts # Steam integration
```

### Important Links
- Steamworks: https://partner.steamgames.com/
- SDK Download: https://partner.steamgames.com/downloads
- Documentation: https://partner.steamgames.com/doc/

### Support
- Steamworks Discussion: https://steamcommunity.com/groups/steamworks/discussions
- Email: steamworks@valvesoftware.com

---

*Last updated: March 2026*
*App Version: 1.0.0*
