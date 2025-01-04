<<<<<<< HEAD
"use strict";const i=require("electron");i.contextBridge.exposeInMainWorld("ipcRenderer",{on(...e){const[n,r]=e;return i.ipcRenderer.on(n,(o,...c)=>r(o,...c))},off(...e){const[n,...r]=e;return i.ipcRenderer.off(n,...r)},send(...e){const[n,...r]=e;return i.ipcRenderer.send(n,...r)},invoke(...e){const[n,...r]=e;return i.ipcRenderer.invoke(n,...r)},removeListener(...e){const[n,r]=e;return i.ipcRenderer.removeListener(n,r)},minimizeWindow(){return i.ipcRenderer.send("minimize-window")},maximizeWindow(){return i.ipcRenderer.send("maximize-window")},closeWindow(){return i.ipcRenderer.send("close-window")}});
=======
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
>>>>>>> ac3f54320442ceecccc7fa1199d1d7ed160404e3
