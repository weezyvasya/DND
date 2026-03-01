import { useState, useEffect, useCallback } from 'react';
import { DiceSize, AppSettings } from '../types';

interface UseSettingsReturn {
  settings: AppSettings;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
  isMouseOverUI: boolean;
  handleMouseEnterUI: () => void;
  handleMouseLeaveUI: () => void;
  screenSize: { width: number; height: number };
  isMaximized: boolean;
  toggleMaximize: () => void;
}

export const useSettings = (): UseSettingsReturn => {
  const [settings, setSettings] = useState<AppSettings>({
    clickThrough: false,
    opacity: 1.0,
    animationSpeed: 1.0,
    diceSize: 'medium',
    windowWidth: 500,
    windowHeight: 600,
  });
  
  const [showSettings, setShowSettings] = useState(false);
  const [isMouseOverUI, setIsMouseOverUI] = useState(false);
  const [screenSize, setScreenSize] = useState({ width: 1920, height: 1080 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [previousSize, setPreviousSize] = useState({ width: 500, height: 600 });

  // Initialize settings from Electron
  useEffect(() => {
    const init = async () => {
      if (window.electronAPI) {
        try {
          const opacity = await window.electronAPI.getOpacity();
          const windowSize = await window.electronAPI.getWindowSize();
          const screen = await window.electronAPI.getScreenSize();
          setScreenSize(screen);
          setSettings(prev => ({ 
            ...prev, 
            opacity,
            windowWidth: windowSize.width,
            windowHeight: windowSize.height,
          }));
        } catch (e) {
          // Ignore errors during init
        }
      }
    };
    init();
  }, []);

  // Handle click-through mode
  useEffect(() => {
    if (window.electronAPI) {
      const shouldClickThrough = settings.clickThrough && !showSettings && !isMouseOverUI;
      window.electronAPI.setClickThrough(shouldClickThrough);
    }
  }, [settings.clickThrough, showSettings, isMouseOverUI]);

  // Handle opacity changes
  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.setOpacity(settings.opacity);
    }
  }, [settings.opacity]);

  // Handle window size changes
  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.setWindowSize(settings.windowWidth, settings.windowHeight);
    }
  }, [settings.windowWidth, settings.windowHeight]);

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const handleMouseEnterUI = useCallback(() => setIsMouseOverUI(true), []);
  const handleMouseLeaveUI = useCallback(() => setIsMouseOverUI(false), []);

  const toggleMaximize = useCallback(async () => {
    if (window.electronAPI) {
      if (isMaximized) {
        // Restore to previous size
        await window.electronAPI.setWindowSize(previousSize.width, previousSize.height);
        await window.electronAPI.centerWindow();
        setSettings(prev => ({
          ...prev,
          windowWidth: previousSize.width,
          windowHeight: previousSize.height,
        }));
        setIsMaximized(false);
      } else {
        // Save current size before maximizing
        setPreviousSize({
          width: settings.windowWidth,
          height: settings.windowHeight,
        });
        // Maximize
        const result = await window.electronAPI.maximizeWindow();
        if (result) {
          setSettings(prev => ({
            ...prev,
            windowWidth: result.width,
            windowHeight: result.height,
          }));
          setIsMaximized(true);
        }
      }
    }
  }, [isMaximized, previousSize, settings.windowWidth, settings.windowHeight]);

  return {
    settings,
    showSettings,
    setShowSettings,
    updateSettings,
    isMouseOverUI,
    handleMouseEnterUI,
    handleMouseLeaveUI,
    screenSize,
    isMaximized,
    toggleMaximize,
  };
};
