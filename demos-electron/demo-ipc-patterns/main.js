//Processus node.js (main)

const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const path = require("path");

const createWindow = () => {
  //Reference vers la fenetre (processus renderer)
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      //Injecter les scripts preload
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const menu = Menu.buildFromTemplate([
    {
      label: "Menu",
      submenu: [
        {
          //Mode 3 : Envoie un message vers le renderer
          click: () => win.webContents.send("change-color-to-red"),
          label: "Changer la couleur à rouge",
        },
      ],
    },
  ]);

  Menu.setApplicationMenu(menu);

  win.webContents.openDevTools()

  //Mode 1 : Répond a la reception du message envoyé par ipcRenderer
  ipcMain.on("btn:set-title", (event, title) => {
    console.log("La GUI me dit de changer le titre à " + title);
    win.setTitle(title);
  });

  //Mode 2 : Bidirectionnel
  ipcMain.handle("btn:ask-value", () => {
    console.log("renderer ask for a value");
    return Math.ceil(Math.random() * 100);
  });

  win.loadFile("index.html");
};

app.whenReady().then(() => {
  createWindow();
});
