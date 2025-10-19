//main.js
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

//preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("game", {
  //Exposer channel entre le process renderer et main
  checkNumber: (guess) => ipcRenderer.invoke("check-number", guess),
});

//guess.js
// let secretNumber = Math.floor(Math.random() * 100) + 1;
let numberToGuess = 1; //encapsulé

function check(guess) {
  if (guess === numberToGuess) {
    return { result: "correct", numberToGuess };
  } else if (guess < numberToGuess) {
    return { result: "higher" };
  } else {
    return { result: "lower" };
  }
}

module.exports = { check };
//renderer.js
let btn = document.getElementById("try");

btn.addEventListener("click", async () => {
  const guessInput = document.getElementById("guess");
  const guess = parseInt(guessInput.value, 10);
  const response = await window.game.checkNumber(guess);
  if (response.result === "correct") {
    document.getElementById(
      "result"
    ).innerText = `You guessed it! The number was ${response.numberToGuess}.`;
  } else if (response.result === "higher") {
    document.getElementById("result").innerText = "Try a higher number!";
  } else if (response.result === "lower") {
    document.getElementById("result").innerText = "Try a lower number!";
  }
});
//index.html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <!-- https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP -->
        <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'">
        <title>Guess my number</title>
    </head>
    <body>
        <h1>Guess my number</h1>
        <input type="number" name="guess" id="guess">
        <button type="submit" id="try">Try</button>
        <p id="result"></p>
        <script src="renderer.js"></script>
    </body>
</html>

