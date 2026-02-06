import { app, BrowserWindow, screen, ipcMain } from 'electron';
import path from 'path';

let mainWindow: BrowserWindow | null = null;

const createWindow = (): void => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  
  mainWindow = new BrowserWindow({
    width: 450,  // Увеличьте ширину
    height: 650, // Увеличьте высоту
    x: Math.floor((width - 450) / 2),
    y: Math.floor((height - 650) / 2),
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    hasShadow: true,  // Включите тень
    skipTaskbar: false,
    resizable: true,
    minimizable: true,
    maximizable: false,
    closable: true,
    backgroundColor: '#00000000',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      devTools: process.env.NODE_ENV === 'development' // DevTools только в разработке
    },
    titleBarStyle: 'hidden',
    vibrancy: 'under-window',
    visualEffectState: 'active',
    show: false, // Сначала скрыть
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