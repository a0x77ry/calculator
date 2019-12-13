function add(a, b) {     
    return a + b; 
}

function subtract(a, b) {
    return a - b;

}
function multiply(a, b) {
    return Math.floor(a * b * 10) / 10;
}

function divide(a, b) {
    if (b !== 0) {
        return Math.floor((a / b) * 10) / 10;
    } else {
        return "Error: Printer out of paper!";
    }
}

let displayStr = '';
let isDecimal = false;
let decimalCounter = 0;
let displayStrMaxLength = 30;

const display = document.querySelector('.display');

//get numbers and add events

const numbers = document.querySelectorAll('.number');
numbers.forEach((numButton) => {
    numButton.addEventListener('click', updateDisplayWithNumber);
});

function updateDisplayWithNumber(e) {
    if (displayStr.length <= displayStrMaxLength) {
        if (!isDecimal) {
            displayStr += e.target.textContent;
            display.textContent = displayStr;
        } else if (isDecimal && decimalCounter < 1) {
            displayStr += e.target.textContent;
            display.textContent = displayStr;
            decimalCounter++;
        }
    }
}

//get operators and add events

const operators = document.querySelectorAll('.operator');
operators.forEach((opButton) => {
    opButton.addEventListener('click', updateDisplayWithOperator);
});

function updateDisplayWithOperator(e) {
    if (displayStr.length <= displayStrMaxLength) {
        isDecimal=false;
        decimalCounter = 0;
        displayStr += e.target.textContent;
        display.textContent = displayStr;
    }
}

//get point and add event

// if point is pressed once remove the feature for the rest of the number
const point = document.querySelector('#point');
point.addEventListener('click', (e) => {
    if (!isDecimal && displayStr.length <= displayStrMaxLength) {
        displayStr += e.target.textContent;
        display.textContent = displayStr;
        isDecimal = true;
    } 
});

//get clear and add event to clear the display

const clear = document.querySelector('#clear');
clear.addEventListener('click', clearDisplay);

function clearDisplay(e) {
    displayStr = '';
    display.textContent = '';
    isDecimal = false;
    decimalCounter = 0;
}

//get the back button and add an event to go back a character

const back = document.querySelector('#back');
back.addEventListener('click', goBack);

function goBack(e) {
    displayStr = displayStr.slice(0, displayStr.length - 1);
    display.textContent = displayStr;
    if (isDecimal && decimalCounter === 0) {
        isDecimal = false;
    } else if (isDecimal) {        
        decimalCounter--;
    }
}

//get equals and add event to calculate the result

const equals = document.querySelector('#equals');
equals.addEventListener('click', calcAndDisplay);

function calcAndDisplay(e) {
    let result = Number(calculate(displayStr));
    result = Math.floor(result * 10) / 10;
    isDecimal = false;
    decimalCounter = 0;
    display.textContent = result;
    displayStr = result.toString();
    if (/./.test(displayStr)) {
        isDecimal = true;
        decimalCounter = 1;
    }
}

let ignoreNegative = false;
function calculate(str) {
    if (/\-/.test(str) && ignoreNegative === false) {
        let operands = str.split('-');
        
        if (operands[0] === '') {
            if (!/\-/.test(str.slice(1))) {
                ignoreNegative = true;
                let res = calculate(str);
                ignoreNegative = false;
                return res;
            } else {
                operands = str.slice(1).split('-');
                operands[0] = '-' + operands[0];
            }
        } 

        let total = calculate(operands[0]);
        for (let i = 1; i < operands.length; i++) {
            total -= calculate(operands[i]);
        }
        return total;
    } else if (/\+/.test(str)) {
        let operands = str.split('+');

        let result = operands.reduce((total, expStr) => {
            return total + Number(calculate(expStr));
        }, 0);
        return result;
    } else if (/\//.test(str)) {
        let operands = str.split('/');

        let total = calculate(operands[0]);
        for (let i = 1; i < operands.length; i++) {
            total = divide(total, calculate(operands[i]));
        }
        return total;
    } else if (/\*/.test(str)) {
        let operands = str.split('*');
        return operands.reduce((total, expStr) => {
            return total * calculate(expStr);
        }, 1);
    } else {
        return str;
    }
}
