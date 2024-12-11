const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("game", {
  //Exposer channel entre le process renderer et main
  checkNumber: (guess) => ipcRenderer.invoke("check-number", guess),
});
