import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const fs = require('fs');
// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC || '', 'electron-vite.svg'),
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })
  win.setMenuBarVisibility(false);
  

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
    win.webContents.openDevTools();
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }

}

// Minimize the window
ipcMain.on('minimize-window', () => {
    if (win) {
        win.minimize();
    }
});
// Maximize/restore the window
ipcMain.on('maximize-window', () => {
    if (win) {
        if (win.isMaximized()) {
            win.restore();
        } else {
            win.maximize();
        }
    }
});
// Close the window
ipcMain.on('close-window', () => {
    if (win) {
        win.close();
    }
});

ipcMain.on('show-alert', (_, { title, message }) => {
  dialog.showMessageBox({
      type: 'info',
      title: title,
      message: message,
      buttons: ['OK']
  });
});

ipcMain.on('read-json-file', (event, { filename }) => {
  const result = readJSONFile(filename);
  if (result) {
    event.reply('read-json-file-response', result);
  } else {
    event.reply('read-json-file-response', null);
  }
});

function readJSONFile(filename: string) {
  const filePath = path.join(app.getAppPath(), './src', `./theme/theme-files/${filename}.json`);
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    console.log(filePath, jsonData); // Access the JSON data here
    return jsonData;
  } catch (err) {
    console.error('Error reading JSON file:', err);
    return null;
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)
