# Steam Store Assets

This folder contains all graphical assets required for your Steam store page.

## Folder Structure

```
steam/
├── store/          # Main store page assets
├── library/        # Steam library assets
├── capsules/       # Capsule images (various sizes)
└── screenshots/    # Game screenshots
```

## Required Assets Checklist

### Capsule Images (capsules/)

| File | Dimensions | Required | Description |
|------|------------|----------|-------------|
| `header.jpg` | 460×215 px | ✅ Yes | Main capsule, store page header |
| `small_capsule.jpg` | 231×87 px | ✅ Yes | Search results, wishlists |
| `main_capsule.jpg` | 616×353 px | ✅ Yes | Featured sections |
| `large_capsule.jpg` | 467×181 px | Optional | Big Picture mode |
| `vertical_capsule.jpg` | 374×448 px | Optional | Vertical lists |

### Library Assets (library/)

| File | Dimensions | Required | Description |
|------|------------|----------|-------------|
| `library_capsule.jpg` | 600×900 px | ✅ Yes | Steam library grid view |
| `library_hero.jpg` | 3840×1240 px | ✅ Yes | Library background |
| `library_logo.png` | 1280×720 px | ✅ Yes | Logo overlay (transparent PNG) |

### Store Page (store/)

| File | Dimensions | Required | Description |
|------|------------|----------|-------------|
| `page_bg_raw.jpg` | 1438×810 px | Optional | Store page background |
| `hero_capsule.jpg` | 374×448 px | Optional | Hero section |

### Screenshots (screenshots/)

| Requirement | Description |
|-------------|-------------|
| Minimum | 5 screenshots |
| Dimensions | 1920×1080 px minimum |
| Format | JPG or PNG |
| Naming | `screenshot_01.jpg`, `screenshot_02.jpg`, etc. |

## Image Guidelines

### General Rules
1. **No text overlay** on capsule images (title is added by Steam)
2. **High quality** - Use original resolution, no upscaling
3. **JPG format** - Use quality 90-95% for best results
4. **Consistent style** - All images should match your brand

### Content Rules
1. **No placeholder text** like "Coming Soon" or "Early Access"
2. **No awards/ratings** unless officially earned
3. **No other platform logos** (PlayStation, Xbox, etc.)
4. **Actual gameplay** in screenshots, not concept art

## Creating Assets

### Recommended Tools
- **Photoshop/GIMP** - For creating custom graphics
- **Canva** - Easy templates for capsules
- **OBS Studio** - For taking screenshots
- **ShareX** - Screenshot tool with annotation

### Template Downloads
Steam provides official templates:
https://partner.steamgames.com/doc/store/assets/standard

## File Naming Convention

```
capsules/
├── header_460x215.jpg
├── small_capsule_231x87.jpg
├── main_capsule_616x353.jpg
└── vertical_capsule_374x448.jpg

library/
├── library_capsule_600x900.jpg
├── library_hero_3840x1240.jpg
└── library_logo_1280x720.png

screenshots/
├── screenshot_01_main_ui.jpg
├── screenshot_02_dice_rolling.jpg
├── screenshot_03_multiple_dice.jpg
├── screenshot_04_advantage_mode.jpg
└── screenshot_05_settings.jpg
```

## Quick Checklist Before Upload

- [ ] All required dimensions are exact (Steam rejects wrong sizes)
- [ ] JPG quality is 90%+ (no compression artifacts)
- [ ] No Steam UI or window frames in screenshots
- [ ] Library logo has transparent background
- [ ] All images follow content guidelines
- [ ] File sizes are under 10MB each
