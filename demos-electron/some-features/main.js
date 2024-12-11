// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, dialog, ipcMain } = require("electron");
const path = require("node:path");

function createWindow() {
  //Custom menu
  //@See https://www.electronjs.org/docs/latest/api/menu, https://www.electronjs.org/docs/latest/api/menu-item https://www.electronjs.org/docs/latest/api/menu-item#roles
  const template = [
    {
      label: "IPC Main vers Renderer",
      submenu: [
        {
          click: () => mainWindow.webContents.send("update-counter", 1),
          label: "Increment",
        },
        {
          click: () => mainWindow.webContents.send("update-counter", -1),
          label: "Decrement",
        },
      ],
    },
    {
      label: "File",
      submenu: [
        {
          type: "separator",
        },
        {
          label: "Some option A",
          type: "checkbox",
          id: "optionA",
        },
        {
          label: "Some option B",
          type: "checkbox",
          id: "optionB",
        },
        {
          label: "Some option 1",
          type: "radio",
          id: "radio_option",
        },
        {
          label: "Some option 2",
          type: "radio",
          id: "radio_option",
        },
        {
          label: "Start",
          toolTip: "Launch a new process that do something",
          click: () => {
            console.log("Start something...");
          },
        },
        {
          role: "quit",
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  //Renderer to Main
  ipcMain.on("set-title", (event, title) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    win.setTitle(title);
  });

  // and load the index.html of the app.
  mainWindow.loadFile("index.html");

  //   const asideWindow = new BrowserWindow({
  //     width: 200,
  //     height: 600,
  //   });

  // Open a new window
  //   asideWindow.loadFile("index.html");

  //Display native system dialogs for opening and saving files, alerting, etc.
  //@See: https://www.electronjs.org/docs/latest/api/dialog
  //   (async () => {
  //     const choice = await dialog.showOpenDialog({
  //       properties: ["openFile", "multiSelections"],
  //     });
  //     console.log(choice);
  //   })();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  ipcMain.handle("dialog:openFile", handleFileOpen);

  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

async function handleFileOpen() {
  console.log("handle open file");
  const { canceled, filePaths } = await dialog.showOpenDialog();
  if (!canceled) {
    return filePaths[0];
  }
}
