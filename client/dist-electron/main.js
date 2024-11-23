import { ipcMain, dialog, app, BrowserWindow } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
const require2 = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fs = require2("fs");
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC || "", "electron-vite.svg"),
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs")
    }
  });
  win.setMenuBarVisibility(false);
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
ipcMain.on("minimize-window", () => {
  if (win) {
    win.minimize();
  }
});
ipcMain.on("maximize-window", () => {
  if (win) {
    if (win.isMaximized()) {
      win.restore();
    } else {
      win.maximize();
    }
  }
});
ipcMain.on("close-window", () => {
  if (win) {
    win.close();
  }
});
ipcMain.on("show-alert", (_, { title, message }) => {
  dialog.showMessageBox({
    type: "info",
    title,
    message,
    buttons: ["OK"]
  });
});
ipcMain.on("read-json-file", (event, { filename }) => {
  const result = readJSONFile(filename);
  if (result) {
    event.reply("read-json-file-response", result);
  } else {
    event.reply("read-json-file-response", null);
  }
});
function readJSONFile(filename) {
  const filePath = path.join(app.getAppPath(), "./src", `./theme/theme-files/${filename}.json`);
  try {
    const data = fs.readFileSync(filePath, "utf8");
    const jsonData = JSON.parse(data);
    console.log(filePath, jsonData);
    return jsonData;
  } catch (err) {
    console.error("Error reading JSON file:", err);
    return null;
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(createWindow);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
