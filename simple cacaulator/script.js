// Simple calculator logic
const previousDisplay = document.getElementById('previousOperand');
const currentDisplay = document.getElementById('currentOperand');
const buttons = document.querySelectorAll('.btn');

let current = '';
let previous = '';
let operator = null;
let justEvaluated = false;

function updateDisplay() {
  currentDisplay.textContent = current === '' ? '0' : current;
  previousDisplay.textContent = previous && operator ? `${previous} ${operator}` : '';
}

function clearAll() {
  current = '';
  previous = '';
  operator = null;
  justEvaluated = false;
  updateDisplay();
}

function backspace() {
  if (justEvaluated) { clearAll(); return; }
  current = current.slice(0, -1);
  updateDisplay();
}

function appendNumber(value) {
  if (value === '.' && current.includes('.')) return;
  if (justEvaluated) {
    // start new number after evaluation
    current = value === '.' ? '0.' : value;
    justEvaluated = false;
  } else {
    // prevent leading zeros like '00'
    if (value !== '.' && current === '0') current = value;
    else current += value;
  }
  updateDisplay();
}

function handlePercent() {
  if (current === '') return;
  const num = parseFloat(current);
  if (isFinite(num)) {
    current = (num / 100).toString();
    updateDisplay();
  }
}

function chooseOperator(op) {
  if (current === '' && previous === '') return;
  if (current === '' && previous !== '') {
    operator = op;
    updateDisplay();
    return;
  }
  if (previous === '') {
    previous = current;
    operator = op;
    current = '';
  } else {
    // chain compute
    compute();
    operator = op;
  }
  updateDisplay();
}

function compute() {
  if (!operator || previous === '' || current === '') return;
  // build safe expression and evaluate
  const left = parseFloat(previous);
  const right = parseFloat(current);
  let result = 0;
  switch (operator) {
    case '+': result = left + right; break;
    case '-': result = left - right; break;
    case '×': result = left * right; break;
    case '÷':
      if (right === 0) { alert('Division by zero'); clearAll(); return; }
      result = left / right; break;
    default: return;
  }
  // trim long floats
  result = Math.round(result * 1e12) / 1e12;
  current = result.toString();
  previous = '';
  operator = null;
  justEvaluated = true;
  updateDisplay();
}

// wire buttons
buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const action = btn.dataset.action;
    const value = btn.dataset.value;
    if (action === 'number') appendNumber(value);
    else if (action === 'operator') chooseOperator(value);
    else if (action === 'equals') compute();
    else if (action === 'clear') clearAll();
    else if (action === 'backspace') backspace();
    else if (action === 'percent') handlePercent();
  });
});

// keyboard support
window.addEventListener('keydown', (e) => {
  const key = e.key;
  if ((key >= '0' && key <= '9') || key === '.') {
    e.preventDefault();
    appendNumber(key);
    return;
  }
  if (key === '+' || key === '-' || key === '*' || key === '/') {
    e.preventDefault();
    const map = {'*':'×','/':'÷'};
    chooseOperator(map[key] || key);
    return;
  }
  if (key === 'Enter' || key === '=') {
    e.preventDefault();
    compute();
    return;
  }
  if (key === 'Backspace') {
    e.preventDefault();
    backspace();
    return;
  }
  if (key === 'Escape') {
    e.preventDefault();
    clearAll();
    return;
  }
  if (key === '%') {
    e.preventDefault();
    handlePercent();
  }
});

// start
clearAll();