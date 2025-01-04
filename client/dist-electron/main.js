<<<<<<< HEAD
import { ipcMain as t, dialog as p, app as l, BrowserWindow as f } from "electron";
import { createRequire as w } from "node:module";
import { fileURLToPath as _ } from "node:url";
import r from "node:path";
const m = w(import.meta.url), c = r.dirname(_(import.meta.url)), g = m("fs"), { exec: b } = m("child_process");
process.env.APP_ROOT = r.join(c, "..");
const d = process.env.VITE_DEV_SERVER_URL, T = r.join(process.env.APP_ROOT, "dist-electron"), h = r.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = d ? r.join(process.env.APP_ROOT, "public") : h;
let e, a = null;
function u() {
  a = b(
    `${r.join(process.resourcesPath, "backend/bookeeper-backend.exe")} --path ${r.join(process.resourcesPath, "backend")}`,
    (n, s, o) => {
      if (n) {
        console.error(`Error starting backend: ${n.message}`);
        return;
      }
      o && console.error(`Backend stderr: ${o}`), console.log(`Backend stdout: ${s}`);
    }
  ), console.log(`Backend process started with PID: ${a.pid}`), console.log(`Backend process location: ${r.join(c, "backend/bookeeper-backend.exe")}`), e = new f({
=======
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
>>>>>>> ac3f54320442ceecccc7fa1199d1d7ed160404e3
    width: 800,
    height: 600,
    minWidth: 720,
    minHeight: 400,
    frame: !1,
    webPreferences: {
      preload: r.join(c, "preload.mjs")
    }
  }), e.setMenuBarVisibility(!1), e.webContents.on("did-finish-load", () => {
    e == null || e.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), d ? (e.loadURL(d), e.webContents.openDevTools()) : e.loadFile(r.join(h, "index.html")), e.webContents.on("console-message", (n, s, o, i, R) => {
    o.includes("Autofill.enable") && n.preventDefault();
  }), l.on("before-quit", () => {
    a && (a == null || a.kill("SIGINT"), console.log("Backend process terminated"));
  });
<<<<<<< HEAD
=======
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
>>>>>>> ac3f54320442ceecccc7fa1199d1d7ed160404e3
}
t.on("api-fetch", (n, { url: s, parameters: o }) => {
  fetch(`http://localhost:5000/${s}`, o).then((i) => i.json()).then((i) => {
    n.reply("api-response", { data: i, success: i.success });
  }).catch((i) => {
    console.error("Error fetching data:", i), n.reply("api-response", { data: null, success: !1 });
  });
});
t.on("log", (n, { message: s }) => {
  console.log(s);
});
t.on("minimize-window", () => {
  e && e.minimize();
});
<<<<<<< HEAD
t.on("maximize-window", () => {
  e && (e.isMaximized() ? e.restore() : e.maximize());
});
t.on("close-window", () => {
  e && (e.close(), l.quit());
});
t.on("show-alert", (n, { title: s, message: o }) => {
  p.showMessageBox({
=======
ipcMain.on("show-alert", (_, { title, message }) => {
  dialog.showMessageBox({
>>>>>>> ac3f54320442ceecccc7fa1199d1d7ed160404e3
    type: "info",
    title: s,
    message: o,
    buttons: ["OK"]
  });
});
<<<<<<< HEAD
t.on("show-error", (n, { title: s, message: o }) => {
  p.showMessageBox({
    type: "error",
    title: s,
    message: o,
    buttons: ["OK"]
  });
=======
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
>>>>>>> ac3f54320442ceecccc7fa1199d1d7ed160404e3
});
t.on("read-json-file", (n, { filename: s }) => {
  const o = j(s);
  o ? n.reply("read-json-file-response", o) : n.reply("read-json-file-response", null);
});
function j(n) {
  const s = r.join(l.getAppPath(), "./src", `./theme/theme-files/${n}.json`);
  try {
    const o = g.readFileSync(s, "utf8");
    return JSON.parse(o);
  } catch (o) {
    return console.error("Error reading JSON file:", o), null;
  }
}
l.on("window-all-closed", () => {
  process.platform !== "darwin" && (l.quit(), e = null);
});
l.on("activate", () => {
  f.getAllWindows().length === 0 && u();
});
l.whenReady().then(u);
export {
  T as MAIN_DIST,
  h as RENDERER_DIST,
  d as VITE_DEV_SERVER_URL
};
