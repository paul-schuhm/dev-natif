//Modules fournis par Electron
const { contextBridge, ipcRenderer } = require("electron/renderer");

//Déclarer l'API entre le processus main et le processus renderer
//Cet objet est injecté, et attaché à l'objet global window.
contextBridge.exposeInMainWorld("api", {
    startHeavyProcess: () => ipcRenderer.invoke('btn:start-heavy-process')
});
