import { app, BrowserWindow, screen, ipcMain } from 'electron';
import path from 'path';

let mainWindow: BrowserWindow | null = null;

const createWindow = (): void => {
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;
  
  // Default window size (can be changed via settings)
  const defaultWidth = 500;
  const defaultHeight = 600;
  
  // Center the window
  const x = Math.round((screenWidth - defaultWidth) / 2);
  const y = Math.round((screenHeight - defaultHeight) / 2);
  
  mainWindow = new BrowserWindow({
    width: defaultWidth,
    height: defaultHeight,
    x: x,
    y: y,
    minWidth: 300,
    minHeight: 400,
    maxWidth: screenWidth,
    maxHeight: screenHeight,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    hasShadow: false,
    skipTaskbar: false,
    resizable: true,
    movable: true,
    minimizable: true,
    maximizable: false,
    closable: true,
    backgroundColor: '#00000000',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
      devTools: process.env.NODE_ENV === 'development'
    },
    titleBarStyle: 'hidden',
    vibrancy: 'under-window',
    visualEffectState: 'active',
    show: false,
  });

  // Загружаем приложение
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    // Автооткрытие DevTools ТОЛЬКО если нужно
    // mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'renderer/main_window/index.html'));
  }

  // Показываем окно только после загрузки
  mainWindow.once('ready-to-show', () => {
    if (mainWindow) {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // IPC handlers
  ipcMain.handle('close-app', () => {
    app.quit();
  });

  ipcMain.handle('minimize-app', () => {
    if (mainWindow) {
      mainWindow.minimize();
    }
  });

  ipcMain.handle('set-click-through', (event, clickThrough: boolean) => {
    if (mainWindow) {
      mainWindow.setIgnoreMouseEvents(clickThrough, { forward: true });
    }
  });

  ipcMain.handle('set-opacity', (event, opacity: number) => {
    if (mainWindow) {
      mainWindow.setOpacity(opacity);
    }
  });

  ipcMain.handle('get-opacity', () => {
    return mainWindow ? mainWindow.getOpacity() : 1.0;
  });

  ipcMain.handle('set-window-size', (event, width: number, height: number) => {
    if (mainWindow) {
      mainWindow.setSize(Math.round(width), Math.round(height));
    }
  });

  ipcMain.handle('get-window-size', () => {
    if (mainWindow) {
      const [width, height] = mainWindow.getSize();
      return { width, height };
    }
    return { width: 500, height: 600 };
  });

  ipcMain.handle('get-screen-size', () => {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    return { width, height };
  });

  ipcMain.handle('center-window', () => {
    if (mainWindow) {
      mainWindow.center();
    }
  });

  ipcMain.handle('maximize-window', () => {
    if (mainWindow) {
      const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;
      mainWindow.setSize(screenWidth, screenHeight);
      mainWindow.setPosition(0, 0);
      return { width: screenWidth, height: screenHeight };
    }
    return null;
  });

  ipcMain.handle('is-maximized', () => {
    if (mainWindow) {
      const [width, height] = mainWindow.getSize();
      const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;
      return width >= screenWidth - 10 && height >= screenHeight - 10;
    }
    return false;
  });
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});