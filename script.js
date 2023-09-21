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

/////////////////////////////////////////////////
setInterval(() => {
    localStorage.setItem('accounts', `${JSON.stringify(accounts)}`)
}, 10)

let saveAccounts = JSON.parse(localStorage.getItem('accounts'))

console.log(saveAccounts)

////////////////////////////////////////////////////////////
// Elements
const welcomeElem = document.getElementById("welcome");
const loginInputUser = document.querySelector(".login_input--user");
const loginInputPin = document.querySelector(".login_input--pin");
const loginBtn = document.querySelector(".login_btn");
const container = document.querySelector(".container");
const totalAmount = document.getElementById("total_amount");
const timeDate = document.getElementById("time-Date");


const movementsElem = document.querySelector(".movments");
const inAmountElem = document.querySelector(".summary_value--in")
const outAmountElem = document.querySelector(".summary_value--out")
const interestAmountElem = document.querySelector(".summary_value--interest")
const summaryBtn = document.querySelector(".summary_btn");

const transferBtn = document.querySelector(".btn--transfer");
const transferToElem = document.querySelector(".transfer_input--to");
const transferAmountElem = document.querySelector(".transfer_input--amount");
const operationLoanElem = document.querySelector(".operation--loan");
const operationCloseElem = document.querySelector(".operation--close");



loginBtn.addEventListener('click', (e) => {
    e.preventDefault()
    console.log(e)
    findUserAccount();
    loginInputPin.value = '';
    loginInputUser.value = '';
})

function findUserAccount() {
    const loginInputUserValue = loginInputUser.value;
    const loginInputPinValue = Number(loginInputPin.value);

    let userPas = '';

    for (const [x, { owner, movements, interestRate, pin }] of Object.entries(saveAccounts)) {
        let ownerFirst = owner.split(" ")[0];
        let currentAmount = 0;
        movements.forEach((x) => {
            currentAmount += x;
        });

        userPas = owner.split(" ")[0].slice(0, 1) + owner.split(" ")[1].slice(0, 1)
        userPas = userPas.toLowerCase();

        if (userPas === loginInputUserValue && pin === loginInputPinValue) {
            displayAccount(ownerFirst, currentAmount);
            displayMovments(movements);
            setSummary(movements, interestRate);
            console.log()
        }
    }

}

function displayAccount(ownerFirst, currentAmount) {
    container.classList.add("opacity")
    welcomeElem.textContent = `Welcome back, ${ownerFirst}`
    totalAmount.textContent = currentAmount;
    setTimeAndDate();
}

function setTimeAndDate() {
    let time = new Date();
    let day = time.getDate();
    let month = time.getMonth();
    month += 1;
    let year = time.getFullYear();

    day = day > 10 ? day : `0${day}`;
    month = month > 10 ? month : `0${month}`;

    timeDate.textContent = `${day}/${month}/${year}`;
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

function setSummary(movments, interestRate) {
    let inAmount = 0;
    let outAmount = 0;
    movments.forEach(n => {
        if (n > 0) {
            inAmount += n;
        } else {
            outAmount += n;
        }
    })
    outAmount = Math.abs(outAmount);
    let interest = inAmount * interestRate / 100;
    inAmountElem.textContent = `₹${inAmount}`;
    outAmountElem.textContent = `₹${outAmount}`;
    interestAmountElem.textContent = `₹${interest}`
}

let count = 0;
summaryBtn.addEventListener('click', () => {
    count++;
    let sort = count % 2 == 0 ? false : true;
    let userFirst = welcomeElem.textContent.slice(14);
    accounts.forEach(acc => {
        if (acc.owner.startsWith(userFirst)) {
            displayMovments(acc.movements, sort);
        }
    })
})

transferBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let transferTo = transferToElem.value;
    let transferAmount = Number(transferAmountElem.value);

    let userFirst = welcomeElem.textContent.slice(14);
    accounts.forEach(acc => {
        let userPass = acc.owner.split(" ")[0].slice(0, 1) + acc.owner.split(" ")[1].slice(0, 1)
        if (acc.owner.startsWith(userFirst)) {
            acc.movements.push(-transferAmount)
        }
        if (userPass.toLowerCase() === transferTo) {
            acc.movements.push(transferAmount);
        }
        console.log(acc)
    })
    transferAmountElem.value = '';
    transferToElem.value = '';

})