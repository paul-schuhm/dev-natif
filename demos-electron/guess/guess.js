// let secretNumber = Math.floor(Math.random() * 100) + 1;
let numberToGuess = 1;

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
