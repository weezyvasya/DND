export interface ElectronAPI {
  closeApp: () => Promise<void>;
  setClickThrough: (clickThrough: boolean) => Promise<void>;
  setOpacity: (opacity: number) => Promise<void>;
  getOpacity: () => Promise<number>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
