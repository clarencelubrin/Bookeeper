/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  ipcRenderer: import('electron').IpcRenderer
}

export {};

declare global {
  interface Window {
    ipcRenderer: {
      on: (...args: Parameters<typeof ipcRenderer.on>) => void;
      off: (...args: Parameters<typeof ipcRenderer.off>) => void;
      send: (...args: Parameters<typeof ipcRenderer.send>) => void;
      invoke: (...args: Parameters<typeof ipcRenderer.invoke>) => void;
      minimizeWindow: () => void;
      maximizeWindow: () => void;
      closeWindow: () => void;
    };
  }
}