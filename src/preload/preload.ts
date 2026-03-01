import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  closeApp: () => ipcRenderer.invoke('close-app'),
  setClickThrough: (clickThrough: boolean) => 
    ipcRenderer.invoke('set-click-through', clickThrough),
  setOpacity: (opacity: number) => 
    ipcRenderer.invoke('set-opacity', opacity),
  getOpacity: () => ipcRenderer.invoke('get-opacity'),
  setWindowSize: (width: number, height: number) => 
    ipcRenderer.invoke('set-window-size', width, height),
  getWindowSize: () => ipcRenderer.invoke('get-window-size'),
  getScreenSize: () => ipcRenderer.invoke('get-screen-size'),
  centerWindow: () => ipcRenderer.invoke('center-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  isMaximized: () => ipcRenderer.invoke('is-maximized'),
});

// Типизация для TypeScript
declare global {
  interface Window {
    electronAPI: {
      closeApp: () => Promise<void>;
      setClickThrough: (clickThrough: boolean) => Promise<void>;
      setOpacity: (opacity: number) => Promise<void>;
      getOpacity: () => Promise<number>;
      setWindowSize: (width: number, height: number) => Promise<void>;
      getWindowSize: () => Promise<{ width: number; height: number }>;
      getScreenSize: () => Promise<{ width: number; height: number }>;
      centerWindow: () => Promise<void>;
      maximizeWindow: () => Promise<{ width: number; height: number } | null>;
      isMaximized: () => Promise<boolean>;
    };
  }
}

export {};