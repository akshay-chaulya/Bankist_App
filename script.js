// PROJECT 1 :- "Bankist" App
'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data
const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
};

const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
};

const account3 = {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
};

const account4 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
};

const accounts = [account1, account2, account3, account4];

////////////////////////////////////////////////////////////
// Elements
let errorText;

const labaleWalcome = document.getElementById("welcome");
const loginInputUser = document.querySelector(".login_input--user");
const loginInputPin = document.querySelector(".login_input--pin");
const container = document.querySelector(".container");
const totalAmount = document.getElementById("total_amount");
const timeDate = document.getElementById("time-Date");


const movementsElem = document.querySelector(".movments");
const inAmountElem = document.querySelector(".summary_value--in")
const outAmountElem = document.querySelector(".summary_value--out")
const interestAmountElem = document.querySelector(".summary_value--interest")
const logoutTimerElem = document.querySelector(".logout_time--time");

const transferToElem = document.querySelector(".transfer_input--to");
const transferAmountElem = document.querySelector(".transfer_input--amount");
const operationLoanElem = document.querySelector(".operation--loan");
const operationCloseElem = document.querySelector(".operation--close");

const btnLogin = document.querySelector(".login_btn");
const btnSummary = document.querySelector(".summary_btn");
const btnTransfer = document.querySelector(".btn--transfer");


function createUserName(accounts) {
    accounts.forEach(account => {
        account.userName = account.owner
            .toLowerCase()
            .split(' ')
            .map(word => word[0])
            .join('')
    })
}
createUserName(accounts);

btnLogin.addEventListener('click', (e) => {
    e.preventDefault()
    login();
})

let currentAccount;
function login() {
    const loginInputUserValue = loginInputUser.value;
    const loginInputPinValue = Number(loginInputPin.value);
    loginInputUser.value = loginInputPin.value = '';
    loginInputPin.blur()
    currentAccount = accounts.
        find(acc => acc.userName === loginInputUserValue);
    if (currentAccount && currentAccount.pin === loginInputPinValue) {
        displayAccount(currentAccount);
        updateUI(currentAccount);
        startRestartLogoutTimer();
    }
}

function displayAccount(account) {
    labaleWalcome.textContent = `Welcome back, ${account.owner.split(' ')[0]}`
    container.classList.add("opacity");
    setTimeAndDate();
}

function setTimeAndDate() {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth();
    month += 1;
    let year = date.getFullYear();
    day = day > 10 ? day : `0${day}`;
    month = month > 10 ? month : `0${month}`;
    timeDate.textContent = `${day}/${month}/${year}`;
}

function updateUI(account) {
    calcDisplayBalance(account)
    calcDisplaySummary(account);
    displayMovments(account.movements);
}

function calcDisplayBalance(account) {
    account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
    totalAmount.textContent = account.balance
}

function calcDisplaySummary(account) {
    const IN = account.movements
        .filter(mov => mov > 0)
        .reduce((acc, mov) => acc + mov, 0);
    const OUT = account.movements
        .filter(mov => mov < 0)
        .reduce((acc, mov) => acc + mov, 0);
    const interest = account.movements
        .filter(mov => mov > 0)
        .map(mov => mov * account.interestRate / 100)
        .filter(interest => interest > 1)
        .reduce((acc, mov) => acc + mov, 0);

    inAmountElem.textContent = `₹${IN}`;
    outAmountElem.textContent = `₹${Math.abs(OUT)}`;
    interestAmountElem.textContent = `₹${interest}`
}


function displayMovments(movements, sort = false) {
    movementsElem.innerHTML = "";
    let movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
    movs.forEach((mov, i) => {
        let type = "deposit";
        if (mov < 0) {
            type = "withdrawal"
        } else {
            type = "deposit"
        }

        let div = document.createElement("div");
        div.className = "move";
        div.innerHTML =
            `
            <span class="moveType ${type}">${i + 1} ${type}</span>
            <span class="moveAmount">₹${mov}</span>
        `
        movementsElem.prepend(div);
    })
}

function startRestartLogoutTimer() {
    let minutes = 10;
    let second = 60;
    const timoutInterval = setInterval(() => {
        second = second == 0 ? 60 : second - 1;
        if (second == 59) {
            minutes -= 1;
        }
        second = second < 10 && second > 0 ? `0${second}` : second;
        let logoutTimeStr = minutes < 10 ? `0${minutes}:${second}` : `${minutes}:${second}`
        logoutTimerElem.textContent = logoutTimeStr;
        if (minutes == 0 && second == 0) {
            logoutTimerElem.textContent = "00:00"
            clearInterval(timoutInterval)
        }
    }, 1000)

}

let count = 0;
btnSummary.addEventListener('click', () => {
    count++;
    let sort = count % 2 == 0 ? false : true;
    let userFirst = labaleWalcome.textContent.slice(14);
    accounts.forEach(acc => {
        if (acc.owner.startsWith(userFirst)) {
            displayMovments(acc.movements, sort);
        }
    })
})

btnTransfer.addEventListener("click", (e) => {
    e.preventDefault();
    let recever = accounts
        .find(acc => acc.userName === transferToElem.value);
    let transferAmount = Number(transferAmountElem.value);
    transferAmountElem.value = transferToElem.value = "";
    transferToElem.focus();

    if (recever && recever !== currentAccount && currentAccount.balance > transferAmount) {
        recever.movements.push(transferAmount);
        currentAccount.movements.push(-transferAmount);
        updateUI(currentAccount);
    }
})
