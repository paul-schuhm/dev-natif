//IPC Unidirectionnel (Renderer vers Main)
const setButton = document.getElementById("btn-unidirect");
const titleInput = document.getElementById("title");
setButton.addEventListener("click", () => {
  const title = titleInput.value;
  window.electronAPI.setTitle(title);
});

//IPC Bidirectionnel (Renderer vers Main vers Renderer)

const btn = document.getElementById("btn-bidirect");
const filePathElement = document.getElementById("filePath");

btn.addEventListener("click", async () => {
  console.log("call main process");
  const filePath = await window.electronAPI.openFile();
  filePathElement.innerText = filePath;
});

//IPC Unidirectionnel (Main vers Renderer)

const counter = document.getElementById("counter");

window.electronAPI.onUpdateCounter((value) => {
  const oldValue = Number(counter.innerText);
  const newValue = oldValue + value;
  counter.innerText = newValue.toString();
  window.electronAPI.counterValue(newValue);
});
