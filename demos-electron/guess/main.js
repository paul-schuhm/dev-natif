const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const game = require("./guess");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");
};

ipcMain.handle("check-number", (event, guess) => {
  return game.check(guess);
});

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
