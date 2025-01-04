import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
// import { param } from 'framer-motion/client'


const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const fs = require('fs');
<<<<<<< HEAD
const { exec } = require('child_process');

=======
>>>>>>> ac3f54320442ceecccc7fa1199d1d7ed160404e3
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

const run_backend = true
let backendProcess: ReturnType<typeof exec> | null = null;

function createWindow() {
  // Start Flask backend
  if (run_backend) {
    backendProcess = exec(`${path.join(process.resourcesPath, 'backend/bookeeper-backend.exe')} --path ${path.join(process.resourcesPath, 'backend')}`,
      (error: Error | null, stdout: string, stderr: string) => {
        if (error) {
          console.error(`Error starting backend: ${error.message}`);
          return;
        }
        if (stderr) console.error(`Backend stderr: ${stderr}`);
        console.log(`Backend stdout: ${stdout}`);
      }
    );
    console.log(`Backend process started with PID: ${backendProcess.pid}`);
    console.log(`Backend process location: ${path.join(__dirname, 'backend/bookeeper-backend.exe')}`);
  }
  win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 720,
    minHeight: 400,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })
  win.setMenuBarVisibility(false);
  
<<<<<<< HEAD
=======

>>>>>>> ac3f54320442ceecccc7fa1199d1d7ed160404e3
  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
  // Suppress DevTools Autofill errors
  win.webContents.on('console-message', (event, _level, message, _line, _sourceId) => {
    if (message.includes("Autofill.enable")) {
        event.preventDefault();
    }
  });
  app.on('before-quit', () => {
    if (backendProcess) {
      backendProcess?.kill('SIGINT');
      console.log('Backend process terminated');
    }
  })
}
// Fetch from API
ipcMain.on('api-fetch', (event, { url, parameters }) => {  
  fetch(`http://localhost:5000/${url}`, parameters)
    .then(response => response.json())
    .then(data => {
      event.reply('api-response', {data, success: data.success});
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      event.reply('api-response', {data: null, success: false});
    });
});

ipcMain.on('log', (_, {message}) => {
  console.log(message);
});

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
        app.quit(); 
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
<<<<<<< HEAD
ipcMain.on('show-error', (_, { title, message }) => {
  dialog.showMessageBox({
      type: 'error',
      title: title,
      message: message,
      buttons: ['OK']
  });
});
=======

>>>>>>> ac3f54320442ceecccc7fa1199d1d7ed160404e3
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
<<<<<<< HEAD
=======
    console.log(filePath, jsonData); // Access the JSON data here
>>>>>>> ac3f54320442ceecccc7fa1199d1d7ed160404e3
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
