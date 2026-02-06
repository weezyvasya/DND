import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  closeApp: () => ipcRenderer.invoke('close-app'),
  setClickThrough: (clickThrough: boolean) => 
    ipcRenderer.invoke('set-click-through', clickThrough),
  setOpacity: (opacity: number) => 
    ipcRenderer.invoke('set-opacity', opacity),
  getOpacity: () => ipcRenderer.invoke('get-opacity'),
});

// Типизация для TypeScript
declare global {
  interface Window {
    electronAPI: {
      closeApp: () => Promise<void>;
      setClickThrough: (clickThrough: boolean) => Promise<void>;
      setOpacity: (opacity: number) => Promise<void>;
      getOpacity: () => Promise<number>;
    };
  }
}

export {};