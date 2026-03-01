/**
 * Steam Integration Module for D20 Dice Roller
 * 
 * This module handles Steamworks SDK integration.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Install steamworks.js: npm install steamworks.js
 * 2. Replace YOUR_APP_ID below with your actual Steam App ID
 * 3. Set STEAM_ENABLED to true
 * 4. Rebuild the application
 * 
 * NOTE: steamworks.js is not installed by default to avoid build issues
 * on systems without Steam SDK. Install it only when you have your App ID.
 */

// Configuration - UPDATE THESE VALUES
const STEAM_ENABLED = false; // Set to true after installing steamworks.js
const STEAM_APP_ID = 0; // Replace with your actual Steam App ID (e.g., 480 for testing)

// Steam client interface
interface SteamClient {
  localplayer: {
    getName(): string;
    getSteamId(): { steamId64: string };
  };
  achievement: {
    activate(name: string): boolean;
    isActivated(name: string): boolean;
    clear(name: string): boolean;
  };
  cloud: {
    isEnabledForApp(): boolean;
    isEnabledForAccount(): boolean;
    writeFile(name: string, content: string): boolean;
    readFile(name: string): string | null;
    deleteFile(name: string): boolean;
    fileExists(name: string): boolean;
  };
  overlay: {
    activateDialog(dialog: 'friends' | 'community' | 'players' | 'settings' | 'officialgamegroup' | 'stats' | 'achievements'): void;
  };
}

// Steam state
let steamClient: SteamClient | null = null;
let isInitialized = false;

/**
 * Initialize Steam integration
 * Call this in your main process after app is ready
 */
export async function initializeSteam(): Promise<boolean> {
  if (!STEAM_ENABLED) {
    console.log('[Steam] Steam integration is disabled');
    return false;
  }

  if (STEAM_APP_ID === 0) {
    console.warn('[Steam] App ID not configured. Set STEAM_APP_ID in steamworks.ts');
    return false;
  }

  try {
    // Dynamic import to avoid errors when steamworks.js is not installed
    const steamworks = await import('steamworks.js').catch(() => null);
    
    if (!steamworks) {
      console.warn('[Steam] steamworks.js not installed. Run: npm install steamworks.js');
      return false;
    }

    steamClient = steamworks.init(STEAM_APP_ID);
    
    if (steamClient) {
      isInitialized = true;
      const playerName = steamClient.localplayer.getName();
      console.log(`[Steam] Initialized successfully. Welcome, ${playerName}!`);
      return true;
    } else {
      console.warn('[Steam] Failed to initialize. Is Steam running?');
      return false;
    }
  } catch (error) {
    console.error('[Steam] Initialization error:', error);
    return false;
  }
}

/**
 * Check if Steam is initialized and available
 */
export function isSteamAvailable(): boolean {
  return isInitialized && steamClient !== null;
}

/**
 * Get current Steam user name
 */
export function getSteamUserName(): string | null {
  if (!steamClient) return null;
  try {
    return steamClient.localplayer.getName();
  } catch {
    return null;
  }
}

/**
 * Get Steam user ID
 */
export function getSteamUserId(): string | null {
  if (!steamClient) return null;
  try {
    return steamClient.localplayer.getSteamId().steamId64;
  } catch {
    return null;
  }
}

// ============================================
// ACHIEVEMENTS
// ============================================

/**
 * Achievement definitions for D20 Dice Roller
 * Add these to your Steamworks dashboard when configuring achievements
 */
export const ACHIEVEMENTS = {
  FIRST_ROLL: 'ACH_FIRST_ROLL',           // Roll your first die
  LUCKY_20: 'ACH_LUCKY_20',               // Roll a natural 20
  UNLUCKY_1: 'ACH_UNLUCKY_1',             // Roll a natural 1
  ROLL_100: 'ACH_ROLL_100',               // Roll 100 dice total
  ROLL_1000: 'ACH_ROLL_1000',             // Roll 1000 dice total
  MULTI_MASTER: 'ACH_MULTI_MASTER',       // Roll 10 dice at once
  ADVANTAGE_KING: 'ACH_ADVANTAGE_KING',   // Win 50 advantage rolls
  ALL_DICE: 'ACH_ALL_DICE',               // Use all dice types
} as const;

/**
 * Unlock an achievement
 */
export function unlockAchievement(achievementId: string): boolean {
  if (!steamClient) {
    console.log(`[Steam] Would unlock achievement: ${achievementId} (Steam not available)`);
    return false;
  }
  
  try {
    if (!steamClient.achievement.isActivated(achievementId)) {
      const success = steamClient.achievement.activate(achievementId);
      if (success) {
        console.log(`[Steam] Achievement unlocked: ${achievementId}`);
      }
      return success;
    }
    return true; // Already unlocked
  } catch (error) {
    console.error(`[Steam] Failed to unlock achievement ${achievementId}:`, error);
    return false;
  }
}

/**
 * Check if achievement is unlocked
 */
export function isAchievementUnlocked(achievementId: string): boolean {
  if (!steamClient) return false;
  try {
    return steamClient.achievement.isActivated(achievementId);
  } catch {
    return false;
  }
}

// ============================================
// CLOUD SAVES
// ============================================

/**
 * Save data to Steam Cloud
 */
export function saveToCloud(filename: string, data: object): boolean {
  if (!steamClient) {
    console.log(`[Steam] Would save to cloud: ${filename} (Steam not available)`);
    return false;
  }

  try {
    if (!steamClient.cloud.isEnabledForApp() || !steamClient.cloud.isEnabledForAccount()) {
      console.warn('[Steam] Cloud saves are disabled');
      return false;
    }

    const content = JSON.stringify(data, null, 2);
    return steamClient.cloud.writeFile(filename, content);
  } catch (error) {
    console.error(`[Steam] Failed to save to cloud:`, error);
    return false;
  }
}

/**
 * Load data from Steam Cloud
 */
export function loadFromCloud<T>(filename: string): T | null {
  if (!steamClient) return null;

  try {
    if (!steamClient.cloud.fileExists(filename)) {
      return null;
    }

    const content = steamClient.cloud.readFile(filename);
    if (content) {
      return JSON.parse(content) as T;
    }
    return null;
  } catch (error) {
    console.error(`[Steam] Failed to load from cloud:`, error);
    return null;
  }
}

// ============================================
// OVERLAY
// ============================================

/**
 * Open Steam overlay to specific dialog
 */
export function openSteamOverlay(dialog: 'friends' | 'community' | 'achievements' | 'settings' = 'community'): void {
  if (!steamClient) {
    console.log(`[Steam] Would open overlay: ${dialog} (Steam not available)`);
    return;
  }

  try {
    steamClient.overlay.activateDialog(dialog);
  } catch (error) {
    console.error(`[Steam] Failed to open overlay:`, error);
  }
}

// ============================================
// STATS TRACKING (for internal use)
// ============================================

interface RollStats {
  totalRolls: number;
  nat20Count: number;
  nat1Count: number;
  advantageWins: number;
  diceTypesUsed: Set<string>;
  maxDiceInSingleRoll: number;
}

let rollStats: RollStats = {
  totalRolls: 0,
  nat20Count: 0,
  nat1Count: 0,
  advantageWins: 0,
  diceTypesUsed: new Set(),
  maxDiceInSingleRoll: 0,
};

/**
 * Track a roll and check for achievements
 * Call this from your roll handler
 */
export function trackRoll(
  diceType: string,
  result: number,
  maxValue: number,
  diceCount: number = 1,
  isAdvantageWin: boolean = false
): void {
  // Update stats
  rollStats.totalRolls += diceCount;
  rollStats.diceTypesUsed.add(diceType);
  rollStats.maxDiceInSingleRoll = Math.max(rollStats.maxDiceInSingleRoll, diceCount);
  
  if (result === maxValue && diceType === 'd20') {
    rollStats.nat20Count++;
  }
  if (result === 1 && diceType === 'd20') {
    rollStats.nat1Count++;
  }
  if (isAdvantageWin) {
    rollStats.advantageWins++;
  }

  // Check achievements
  if (rollStats.totalRolls === 1) {
    unlockAchievement(ACHIEVEMENTS.FIRST_ROLL);
  }
  if (rollStats.totalRolls >= 100) {
    unlockAchievement(ACHIEVEMENTS.ROLL_100);
  }
  if (rollStats.totalRolls >= 1000) {
    unlockAchievement(ACHIEVEMENTS.ROLL_1000);
  }
  if (result === 20 && diceType === 'd20') {
    unlockAchievement(ACHIEVEMENTS.LUCKY_20);
  }
  if (result === 1 && diceType === 'd20') {
    unlockAchievement(ACHIEVEMENTS.UNLUCKY_1);
  }
  if (diceCount >= 10) {
    unlockAchievement(ACHIEVEMENTS.MULTI_MASTER);
  }
  if (rollStats.advantageWins >= 50) {
    unlockAchievement(ACHIEVEMENTS.ADVANTAGE_KING);
  }
  if (rollStats.diceTypesUsed.size >= 7) {
    unlockAchievement(ACHIEVEMENTS.ALL_DICE);
  }

  // Periodically save stats to cloud
  if (rollStats.totalRolls % 10 === 0) {
    saveToCloud('rollstats.json', {
      totalRolls: rollStats.totalRolls,
      nat20Count: rollStats.nat20Count,
      nat1Count: rollStats.nat1Count,
      advantageWins: rollStats.advantageWins,
      diceTypesUsed: Array.from(rollStats.diceTypesUsed),
      maxDiceInSingleRoll: rollStats.maxDiceInSingleRoll,
    });
  }
}

/**
 * Load stats from cloud on startup
 */
export function loadStats(): void {
  const saved = loadFromCloud<{
    totalRolls: number;
    nat20Count: number;
    nat1Count: number;
    advantageWins: number;
    diceTypesUsed: string[];
    maxDiceInSingleRoll: number;
  }>('rollstats.json');

  if (saved) {
    rollStats = {
      ...saved,
      diceTypesUsed: new Set(saved.diceTypesUsed),
    };
    console.log(`[Steam] Loaded stats: ${rollStats.totalRolls} total rolls`);
  }
}

// Export stats for display
export function getStats(): Readonly<RollStats> {
  return rollStats;
}
