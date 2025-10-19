//Modules fournis par Electron
const { contextBridge, ipcRenderer } = require("electron/renderer");

//Déclarer l'API entre le processus main et le processus renderer
//Cet objet est injecté, et attaché à l'objet global window.
contextBridge.exposeInMainWorld("api", {
  //Mode 1
  setTitle: (title) => ipcRenderer.send("btn:set-title", title),
  //Mode 2
  askValue: () => ipcRenderer.invoke("btn:ask-value"),
  //Mode 3
  //Enregistrer la callback
  onChangeColorToRed: (callback) =>
    ipcRenderer.on("change-color-to-red", (event, value) => callback(value)),
});
