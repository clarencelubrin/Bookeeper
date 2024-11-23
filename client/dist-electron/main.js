import { ipcMain as t, dialog as f, app as r, BrowserWindow as c } from "electron";
import { createRequire as w } from "node:module";
import { fileURLToPath as h } from "node:url";
import o from "node:path";
const u = w(import.meta.url), d = o.dirname(h(import.meta.url)), R = u("fs");
process.env.APP_ROOT = o.join(d, "..");
const l = process.env.VITE_DEV_SERVER_URL, O = o.join(process.env.APP_ROOT, "dist-electron"), m = o.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = l ? o.join(process.env.APP_ROOT, "public") : m;
let e;
function p() {
  e = new c({
    icon: o.join(process.env.VITE_PUBLIC || "", "electron-vite.svg"),
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    frame: !1,
    webPreferences: {
      preload: o.join(d, "preload.mjs")
    }
  }), e.setMenuBarVisibility(!1), e.webContents.on("did-finish-load", () => {
    e == null || e.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), l ? (e.loadURL(l), e.webContents.openDevTools()) : e.loadFile(o.join(m, "index.html"));
}
t.on("minimize-window", () => {
  e && e.minimize();
});
t.on("maximize-window", () => {
  e && (e.isMaximized() ? e.restore() : e.maximize());
});
t.on("close-window", () => {
  e && e.close();
});
t.on("show-alert", (s, { title: i, message: n }) => {
  f.showMessageBox({
    type: "info",
    title: i,
    message: n,
    buttons: ["OK"]
  });
});
t.on("read-json-file", (s, { filename: i }) => {
  const n = _(i);
  n ? s.reply("read-json-file-response", n) : s.reply("read-json-file-response", null);
});
function _(s) {
  const i = o.join(r.getAppPath(), "./src", `./theme/theme-files/${s}.json`);
  try {
    const n = R.readFileSync(i, "utf8"), a = JSON.parse(n);
    return console.log(i, a), a;
  } catch (n) {
    return console.error("Error reading JSON file:", n), null;
  }
}
r.on("window-all-closed", () => {
  process.platform !== "darwin" && (r.quit(), e = null);
});
r.on("activate", () => {
  c.getAllWindows().length === 0 && p();
});
r.whenReady().then(p);
export {
  O as MAIN_DIST,
  m as RENDERER_DIST,
  l as VITE_DEV_SERVER_URL
};
