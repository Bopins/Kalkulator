// Mengambil elemen layar dan seluruh tombol kalkulator dari DOM.
const display = document.getElementById("display");
const keys = document.querySelector(".keys");

let currentInput = "0";
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

function updateDisplay() {
  display.textContent = currentInput;
}

function inputNumber(number) {
  if (waitingForSecondOperand) {
    currentInput = number;
    waitingForSecondOperand = false;
  } else {
    currentInput = currentInput === "0" ? number : currentInput + number;
  }
  updateDisplay();
}

function inputDecimal() {
  if (waitingForSecondOperand) {
    currentInput = "0.";
    waitingForSecondOperand = false;
  } else if (!currentInput.includes(".")) {
    currentInput += ".";
  }
  updateDisplay();
}

function chooseOperator(nextOperator) {
  const inputValue = Number(currentInput);

  if (operator && waitingForSecondOperand) {
    operator = nextOperator;
    return;
  }

  if (firstOperand === null) {
    firstOperand = inputValue;
  } else if (operator) {
    const result = calculate(firstOperand, inputValue, operator);
    if (result === "Error") {
      showError();
      return;
    }
    currentInput = String(Number(result.toFixed(10)));
    firstOperand = result;
    updateDisplay();
  }

  waitingForSecondOperand = true;
  operator = nextOperator;
}

function calculate(a, b, selectedOperator) {
  switch (selectedOperator) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": return b === 0 ? "Error" : a / b;
    default: return b;
  }
}

function performCalculation() {
  if (operator === null || firstOperand === null || waitingForSecondOperand) {
    return;
  }

  const secondOperand = Number(currentInput);
  const result = calculate(firstOperand, secondOperand, operator);

  if (result === "Error" || !Number.isFinite(result)) {
    showError();
    return;
  }

  currentInput = String(Number(result.toFixed(10)));
  firstOperand = null;
  operator = null;
  waitingForSecondOperand = true;
  updateDisplay();
}

function clearCalculator() {
  currentInput = "0";
  firstOperand = null;
  operator = null;
  waitingForSecondOperand = false;
  updateDisplay();
}

function deleteLastCharacter() {
  if (waitingForSecondOperand) return;
  currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : "0";
  if (currentInput === "-") currentInput = "0";
  updateDisplay();
}

function convertPercent() {
  currentInput = String(Number(currentInput) / 100);
  updateDisplay();
}

function showError() {
  currentInput = "Error";
  firstOperand = null;
  operator = null;
  waitingForSecondOperand = true;
  updateDisplay();
}

// Event delegation: satu listener menangani semua tombol di dalam .keys.
keys.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.number !== undefined) {
    inputNumber(button.dataset.number);
    return;
  }

  if (button.dataset.operator) {
    chooseOperator(button.dataset.operator);
    return;
  }

  switch (button.dataset.action) {
    case "clear": clearCalculator(); break;
    case "delete": deleteLastCharacter(); break;
    case "decimal": inputDecimal(); break;
    case "percent": convertPercent(); break;
    case "equals": performCalculation(); break;
  }
});

// Mendukung penggunaan keyboard komputer.
document.addEventListener("keydown", (event) => {
  if (/^[0-9]$/.test(event.key)) inputNumber(event.key);
  else if (event.key === ".") inputDecimal();
  else if (["+", "-", "*", "/"].includes(event.key)) chooseOperator(event.key);
  else if (event.key === "Enter" || event.key === "=") performCalculation();
  else if (event.key === "Backspace") deleteLastCharacter();
  else if (event.key === "Escape") clearCalculator();
});

updateDisplay();
