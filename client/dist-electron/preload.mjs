"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  },
  removeListener(...args) {
    const [channel, func] = args;
    return electron.ipcRenderer.removeListener(channel, func);
  },
  minimizeWindow() {
    return electron.ipcRenderer.send("minimize-window");
  },
  maximizeWindow() {
    return electron.ipcRenderer.send("maximize-window");
  },
  closeWindow() {
    return electron.ipcRenderer.send("close-window");
  }
  // You can expose other APTs you need here.
  // ...
});
