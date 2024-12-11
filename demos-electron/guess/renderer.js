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
