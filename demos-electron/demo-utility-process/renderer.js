const btn = document.getElementById("start");

btn.addEventListener("click", async () => {
  const result = await window.api.startHeavyProcess();
  document.getElementById("result").innerText = result;
});
