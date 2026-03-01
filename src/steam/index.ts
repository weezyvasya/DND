/**
 * Steam Integration Module
 * 
 * Re-exports all Steam-related functionality.
 * Import from this file in your main process.
 * 
 * Usage in main.ts:
 * ```
 * import { initializeSteam, isSteamAvailable, trackRoll } from './steam';
 * 
 * app.whenReady().then(async () => {
 *   await initializeSteam();
 *   createWindow();
 * });
 * ```
 */

export {
  initializeSteam,
  isSteamAvailable,
  getSteamUserName,
  getSteamUserId,
  ACHIEVEMENTS,
  unlockAchievement,
  isAchievementUnlocked,
  saveToCloud,
  loadFromCloud,
  openSteamOverlay,
  trackRoll,
  loadStats,
  getStats,
} from './steamworks';
