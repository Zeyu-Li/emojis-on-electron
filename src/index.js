const { app, BrowserWindow, session } = require('electron');
const path = require('path');

// The app is a window onto the hosted Emoji Finder site, so nothing outside it may load in the app.
const APP_URL = 'https://zeyu-li.github.io/emoji-finder/build/index.html';
const APP_ROOT = 'https://zeyu-li.github.io/emoji-finder/';

const isAppUrl = (url) => {
  try {
    return new URL(url).href.startsWith(APP_ROOT);
  } catch {
    return false;
  }
};

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 650,
    minWidth: 350,
    icon: 'icon.png',
    webPreferences: {
      // Remote content: no Node.js, an isolated preload world and an OS-sandboxed renderer.
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  });

  // and load the index.html of the app.
  // mainWindow.loadFile(path.join(__dirname, 'index.html'));
  // basically a webview
  mainWindow.loadURL(APP_URL);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // The page copies with document.execCommand, which needs no permission, so refuse every request
  // (camera, notifications, geolocation, ...).
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => callback(false));
  createWindow();
});

// Keep every window on the app: block navigation to other sites and refuse new windows.
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (navigationEvent) => {
    if (!isAppUrl(navigationEvent.url)) {
      navigationEvent.preventDefault();
    }
  });
  contents.setWindowOpenHandler(() => ({ action: 'deny' }));
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
