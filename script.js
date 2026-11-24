
/* =========================================
   PROCALC - PROFESSIONAL CALCULATOR
   COMPLETE JAVASCRIPT
========================================= */


/* =========================================
   1. SELECT HTML ELEMENTS
========================================= */

const currentDisplay = document.getElementById("currentDisplay");
const expressionDisplay = document.getElementById("expression");

const copyButton = document.getElementById("copyButton");
const copyMessage = document.getElementById("copyMessage");

const themeToggle = document.getElementById("themeToggle");

const historyList = document.getElementById("historyList");
const historyCount = document.getElementById("historyCount");
const clearHistoryButton = document.getElementById("clearHistory");

const toast = document.getElementById("toast");

const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");
const actionButtons = document.querySelectorAll("[data-action]");


/* =========================================
   2. CALCULATOR VARIABLES
========================================= */

let currentValue = "0";
let previousValue = null;
let selectedOperator = null;

let shouldResetDisplay = false;
let expressionText = "";

let calculationHistory = [];


/* =========================================
   3. UPDATE DISPLAY
========================================= */

function updateDisplay() {

    currentDisplay.textContent = currentValue;

    expressionDisplay.textContent =
        expressionText || "Ready to calculate";

}


/* =========================================
   4. SHOW NOTIFICATION
========================================= */

let toastTimer;

function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(function () {

        toast.classList.remove("show");

    }, 2200);

}


/* =========================================
   5. FORMAT NUMBER
========================================= */

function formatNumber(number) {

    if (!Number.isFinite(number)) {

        return "Error";

    }

    if (Object.is(number, -0)) {

        number = 0;

    }

    return Number.parseFloat(number.toPrecision(12)).toString();

}


/* =========================================
   6. ENTER NUMBER
========================================= */

function enterNumber(number) {

    if (currentValue === "Error") {

        currentValue = "0";

    }

    if (shouldResetDisplay) {

        currentValue = number;

        shouldResetDisplay = false;

    }

    else if (currentValue === "0") {

        currentValue = number;

    }

    else if (currentValue.length < 15) {

        currentValue += number;

    }

    updateDisplay();

}


/* =========================================
   7. DECIMAL FUNCTION
========================================= */

function enterDecimal() {

    if (currentValue === "Error") {

        currentValue = "0";

    }

    if (shouldResetDisplay) {

        currentValue = "0.";

        shouldResetDisplay = false;

    }

    else if (!currentValue.includes(".")) {

        currentValue += ".";

    }

    updateDisplay();

}


/* =========================================
   8. SELECT OPERATOR
========================================= */

function selectOperator(operator) {

    if (currentValue === "Error") {

        return;

    }

    if (selectedOperator !== null && !shouldResetDisplay) {

        calculateResult();

    }

    previousValue = parseFloat(currentValue);

    selectedOperator = operator;

    expressionText =
        formatNumber(previousValue) + " " +
        getOperatorSymbol(operator);

    shouldResetDisplay = true;

    updateDisplay();

}


/* =========================================
   9. OPERATOR SYMBOL
========================================= */

function getOperatorSymbol(operator) {

    const symbols = {

        "+": "+",

        "-": "−",

        "*": "×",

        "/": "÷"

    };

    return symbols[operator] || operator;

}


/* =========================================
   10. PERFORM CALCULATION
========================================= */

function calculateResult() {

    if (
        selectedOperator === null ||
        previousValue === null ||
        currentValue === "Error"
    ) {

        return;

    }

    const firstNumber = previousValue;

    const secondNumber = parseFloat(currentValue);

    let result;

    switch (selectedOperator) {

        case "+":

            result = firstNumber + secondNumber;

            break;


        case "-":

            result = firstNumber - secondNumber;

            break;


        case "*":

            result = firstNumber * secondNumber;

            break;


        case "/":

            if (secondNumber === 0) {

                currentValue = "Error";

                expressionText = "Cannot divide by zero";

                previousValue = null;

                selectedOperator = null;

                shouldResetDisplay = true;

                updateDisplay();

                showToast("Cannot divide by zero");

                return;

            }

            result = firstNumber / secondNumber;

            break;


        default:

            return;

    }


    if (!Number.isFinite(result)) {

        currentValue = "Error";

        expressionText = "Invalid calculation";

        previousValue = null;

        selectedOperator = null;

        shouldResetDisplay = true;

        updateDisplay();

        return;

    }


    const formattedResult = formatNumber(result);

    const calculationExpression =
        formatNumber(firstNumber) + " " +
        getOperatorSymbol(selectedOperator) + " " +
        formatNumber(secondNumber);


    expressionText =
        calculationExpression + " =";


    currentValue = formattedResult;

    addToHistory(calculationExpression, formattedResult);


    previousValue = null;

    selectedOperator = null;

    shouldResetDisplay = true;

    updateDisplay();

}


/* =========================================
   11. CLEAR ALL
========================================= */

function clearCalculator() {

    currentValue = "0";

    previousValue = null;

    selectedOperator = null;

    shouldResetDisplay = false;

    expressionText = "";

    updateDisplay();

}


/* =========================================
   12. DELETE LAST DIGIT
========================================= */

function deleteLastDigit() {

    if (currentValue === "Error") {

        clearCalculator();

        return;

    }

    if (shouldResetDisplay) {

        return;

    }

    if (currentValue.length > 1) {

        currentValue = currentValue.slice(0, -1);

    }

    else {

        currentValue = "0";

    }

    if (currentValue === "-") {

        currentValue = "0";

    }

    updateDisplay();

}


/* =========================================
   13. PERCENTAGE FUNCTION
========================================= */

function calculatePercentage() {

    if (currentValue === "Error") {

        return;

    }

    const number = parseFloat(currentValue);

    currentValue = formatNumber(number / 100);

    expressionText = "Percentage";

    shouldResetDisplay = true;

    updateDisplay();

}


/* =========================================
   14. CHANGE POSITIVE / NEGATIVE
========================================= */

function changeSign() {

    if (currentValue === "Error") {

        return;

    }

    if (parseFloat(currentValue) === 0) {

        return;

    }

    if (currentValue.startsWith("-")) {

        currentValue = currentValue.substring(1);

    }

    else {

        currentValue = "-" + currentValue;

    }

    updateDisplay();

}


/* =========================================
   15. ADD CALCULATION HISTORY
========================================= */

function addToHistory(expression, result) {

    const historyItem = {

        expression: expression,

        result: result,

        time: new Date().toLocaleTimeString()

    };

    calculationHistory.unshift(historyItem);

    if (calculationHistory.length > 20) {

        calculationHistory.pop();

    }

    renderHistory();

}


/* =========================================
   16. DISPLAY HISTORY
========================================= */

function renderHistory() {

    historyList.innerHTML = "";

    historyCount.textContent = calculationHistory.length;


    if (calculationHistory.length === 0) {

        historyList.innerHTML = `

            <div class="empty-history">

                <div class="empty-history-icon">
                    ◷
                </div>

                <h3>No Calculations Yet</h3>

                <p>
                    Your calculation history
                    will appear here.
                </p>

            </div>

        `;

        return;

    }


    calculationHistory.forEach(function (item) {

        const historyItem = document.createElement("div");

        historyItem.className = "history-item";


        const details = document.createElement("div");


        const expression = document.createElement("div");

        expression.className = "history-item-expression";

        expression.textContent = item.expression;


        const result = document.createElement("div");

        result.className = "history-item-result";

        result.textContent = "= " + item.result;


        const time = document.createElement("small");

        time.className = "history-item-expression";

        time.textContent = item.time;


        details.appendChild(expression);

        details.appendChild(result);

        details.appendChild(time);


        historyItem.appendChild(details);


        historyList.appendChild(historyItem);

    });

}


/* =========================================
   17. CLEAR HISTORY
========================================= */

function clearHistory() {

    calculationHistory = [];

    renderHistory();

    showToast("Calculation history cleared");

}


/* =========================================
   18. COPY RESULT
========================================= */

async function copyResult() {

    if (currentValue === "Error") {

        showToast("No valid result to copy");

        return;

    }

    try {

        await navigator.clipboard.writeText(currentValue);

        copyMessage.textContent = "Copied!";

        showToast("Result copied successfully");

        setTimeout(function () {

            copyMessage.textContent = "";

        }, 2000);

    }

    catch (error) {

        showToast("Clipboard unavailable. Try running with Live Server.");

    }

}


/* =========================================
   19. CHANGE THEME
========================================= */

function toggleTheme() {

    document.body.classList.toggle("light-theme");

    const isLight =
        document.body.classList.contains("light-theme");

    themeToggle.textContent = isLight ? "🌙" : "☀️";

    showToast(
        isLight ? "Light theme enabled" : "Dark theme enabled"
    );

}


/* =========================================
   20. NUMBER BUTTON EVENTS
========================================= */

numberButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        enterNumber(button.dataset.number);

    });

});


/* =========================================
   21. OPERATOR BUTTON EVENTS
========================================= */

operatorButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        selectOperator(button.dataset.operator);

    });

});


/* =========================================
   22. ACTION BUTTON EVENTS
========================================= */

actionButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const action = button.dataset.action;

        switch (action) {

            case "clear":

                clearCalculator();

                break;


            case "delete":

                deleteLastDigit();

                break;


            case "percent":

                calculatePercentage();

                break;


            case "decimal":

                enterDecimal();

                break;


            case "equals":

                calculateResult();

                break;


            case "sign":

                changeSign();

                break;

        }

    });

});


/* =========================================
   23. COPY BUTTON EVENT
========================================= */

copyButton.addEventListener("click", copyResult);


/* =========================================
   24. THEME BUTTON EVENT
========================================= */

themeToggle.addEventListener("click", toggleTheme);


/* =========================================
   25. CLEAR HISTORY EVENT
========================================= */

clearHistoryButton.addEventListener("click", clearHistory);


/* =========================================
   26. KEYBOARD SUPPORT
========================================= */

document.addEventListener("keydown", function (event) {

    const key = event.key;


    // Number keys

    if (/^[0-9]$/.test(key)) {

        enterNumber(key);

        return;

    }


    // Decimal

    if (key === ".") {

        enterDecimal();

        return;

    }


    // Mathematical operators

    if (["+", "-", "*", "/"].includes(key)) {

        event.preventDefault();

        selectOperator(key);

        return;

    }


    // Enter or equals

    if (key === "Enter" || key === "=") {

        event.preventDefault();

        calculateResult();

        return;

    }


    // Backspace

    if (key === "Backspace") {

        event.preventDefault();

        deleteLastDigit();

        return;

    }


    // Escape

    if (key === "Escape") {

        clearCalculator();

        return;

    }


    // Percentage

    if (key === "%") {

        calculatePercentage();

    }

});


/* =========================================
   27. INITIALIZE CALCULATOR
========================================= */

function initializeCalculator() {

    clearCalculator();

    renderHistory();

    console.log("ProCalc Calculator Initialized Successfully!");

}


/* =========================================
   28. START APPLICATION
========================================= */

initializeCalculator();
