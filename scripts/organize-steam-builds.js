#!/usr/bin/env node
/**
 * Steam Build Organizer
 * 
 * This script organizes Electron Forge output into Steam depot structure.
 * Run with: npm run steam:organize
 */

const fs = require('fs');
const path = require('path');

// Configuration
const FORGE_OUTPUT = 'out';
const STEAM_BUILDS = 'steam-builds';
const APP_NAME = 'D20 Dice Roller';

// Platform-specific paths
const PLATFORMS = {
  windows: {
    source: `${FORGE_OUTPUT}/${APP_NAME}-win32-x64`,
    dest: `${STEAM_BUILDS}/windows`,
    pattern: /win32-x64/
  },
  macos: {
    source: `${FORGE_OUTPUT}/${APP_NAME}-darwin-universal`,
    dest: `${STEAM_BUILDS}/macos`,
    pattern: /darwin/
  },
  linux: {
    source: `${FORGE_OUTPUT}/${APP_NAME}-linux-x64`,
    dest: `${STEAM_BUILDS}/linux`,
    pattern: /linux-x64/
  }
};

// Utility functions
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✓ Created directory: ${dir}`);
  }
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`⚠ Source not found: ${src}`);
    return false;
  }

  ensureDir(dest);
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
  
  return true;
}

function findBuildDir(basePath, pattern) {
  if (!fs.existsSync(basePath)) {
    return null;
  }
  
  const dirs = fs.readdirSync(basePath, { withFileTypes: true })
    .filter(d => d.isDirectory() && pattern.test(d.name))
    .map(d => d.name);
  
  return dirs.length > 0 ? path.join(basePath, dirs[0]) : null;
}

function cleanDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`✓ Cleaned: ${dir}`);
  }
}

// Main function
function main() {
  console.log('╔══════════════════════════════════════════╗');
  console.log('║     Steam Build Organizer                ║');
  console.log('║     D20 Dice Roller                      ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log('');
  
  // Check if forge output exists
  if (!fs.existsSync(FORGE_OUTPUT)) {
    console.error('❌ Build output not found. Run `npm run make:all` first.');
    process.exit(1);
  }
  
  // Clean previous steam builds
  console.log('📦 Cleaning previous Steam builds...');
  cleanDir(STEAM_BUILDS);
  ensureDir(STEAM_BUILDS);
  
  // Process each platform
  console.log('');
  console.log('📋 Processing platform builds...');
  console.log('');
  
  let successCount = 0;
  
  for (const [platform, config] of Object.entries(PLATFORMS)) {
    console.log(`[${platform.toUpperCase()}]`);
    
    // Try direct path first, then search
    let sourceDir = config.source;
    if (!fs.existsSync(sourceDir)) {
      sourceDir = findBuildDir(FORGE_OUTPUT, config.pattern);
    }
    
    if (sourceDir && fs.existsSync(sourceDir)) {
      console.log(`  Source: ${sourceDir}`);
      console.log(`  Dest:   ${config.dest}`);
      
      if (copyDir(sourceDir, config.dest)) {
        console.log(`  ✓ Copied successfully`);
        successCount++;
      } else {
        console.log(`  ❌ Copy failed`);
      }
    } else {
      console.log(`  ⚠ Build not found (run make:${platform === 'macos' ? 'mac' : platform})`);
    }
    console.log('');
  }
  
  // Summary
  console.log('════════════════════════════════════════════');
  console.log(`✓ Organized ${successCount}/${Object.keys(PLATFORMS).length} platform builds`);
  console.log('');
  console.log('📁 Steam builds ready at: steam-builds/');
  console.log('');
  
  if (successCount > 0) {
    console.log('Next steps:');
    console.log('1. Update steam-config/*.vdf with your App ID and Depot IDs');
    console.log('2. Use SteamPipe to upload builds to Steam');
    console.log('3. See steam-config/README.md for detailed instructions');
  }
  
  console.log('');
}

// Run
main();
