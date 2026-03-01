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
}

export const useSettings = (): UseSettingsReturn => {
  const [settings, setSettings] = useState<AppSettings>({
    clickThrough: false,
    opacity: 1.0,
    animationSpeed: 1.0,
    diceSize: 'medium',
  });
  
  const [showSettings, setShowSettings] = useState(false);
  const [isMouseOverUI, setIsMouseOverUI] = useState(false);

  // Initialize opacity from Electron
  useEffect(() => {
    const init = async () => {
      if (window.electronAPI) {
        try {
          const opacity = await window.electronAPI.getOpacity();
          setSettings(prev => ({ ...prev, opacity }));
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

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const handleMouseEnterUI = useCallback(() => setIsMouseOverUI(true), []);
  const handleMouseLeaveUI = useCallback(() => setIsMouseOverUI(false), []);

  return {
    settings,
    showSettings,
    setShowSettings,
    updateSettings,
    isMouseOverUI,
    handleMouseEnterUI,
    handleMouseLeaveUI,
  };
};
