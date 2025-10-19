const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("electronAPI", {
  //IPC Renderer => Main (one way)
  setTitle: (title) => ipcRenderer.send("set-title", title),
  //IPC Renderer => Main (two ways)
  openFile: () => ipcRenderer.invoke("dialog:openFile"),
  //IPC Main => Renderer (one way). Appelle callback enregistré dans renderer.js
  onUpdateCounter: (callback) =>
    ipcRenderer.on("update-counter", (_event, value) => callback(value)),
});
