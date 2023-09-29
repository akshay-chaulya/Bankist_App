// PROJECT 1 :- "Bankist" App
'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data
let accounts = [];
const account1 = {
    owner: "Jonas Schmedtmann",
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2, // %
    pin: 1111,

    movementsDates: [
        "2022-11-18T21:31:17.178Z",
        "2022-12-23T07:42:02.383Z",
        "2020-01-28T09:15:04.904Z",
        "2023-08-01T10:17:24.185Z",
        "2023-09-01T14:11:59.604Z",
        "2023-09-25T17:01:17.194Z",
        "2023-09-27T10:51:36.790Z",
        "2023-09-29T01:36:17.929Z",
    ],
    currency: "EUR",
    locale: "pt-PT", // de-DE
};

const account2 = {
    owner: "Jessica Davis",
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,

    movementsDates: [
        "2022-11-01T13:15:33.035Z",
        "2022-11-30T09:48:16.867Z",
        "2022-09-01T06:04:23.907Z",
        "2023-09-15T14:18:46.235Z",
        "2023-09-25T16:33:06.386Z",
        "2023-09-27T14:43:26.374Z",
        "2023-09-27T18:49:59.371Z",
        "2023-09-28T12:01:20.894Z",
    ],
    currency: "USD",
    locale: "en-US",
};

const account3 = {
    owner: "Akshay Chaulya",
    movements: [1000, 5000, 3400, -150, -790, 60000, -25000, -3210, -1000, 8500, -30, 80000],
    interestRate: 1.04,
    pin: 3333,

    movementsDates: [
        "2022-11-01T13:15:33.035Z",
        "2022-11-30T09:48:16.867Z",
        "2022-09-01T06:04:23.907Z",
        "2023-09-15T14:18:46.235Z",
        "2023-11-25T16:33:06.386Z",
        "2023-11-27T14:43:26.374Z",
        "2023-10-27T18:49:59.371Z",
        "2023-09-01T12:01:20.894Z",
        "2023-09-25T16:33:06.386Z",
        "2023-09-27T14:43:26.374Z",
        "2023-09-27T18:49:59.371Z",
        "2023-09-28T12:01:20.894Z",

    ],
    currency: "INR",
    locale: "en-IN",
};

// accounts = [account1, account2, account3];
// localStorage.setItem("accounts", `${JSON.stringify(accounts)}`)

// get the accounts from localStorage
accounts = JSON.parse(localStorage.getItem("accounts"))
const saveAccounts = () => localStorage.setItem("accounts", `${JSON.stringify(accounts)}`);

////////////////////////////////////////////////////////////
// Elements

const mainContainer = document.querySelector(".container");
const errorContainer = document.querySelector(".errorContainer");

const labaleWalcome = document.getElementById("welcome");
const labaleTotalAmount = document.getElementById("total_amount");
const labaleTimeDate = document.getElementById("time-Date");
const labaleMovements = document.querySelector(".movments");
const labaleAmountIn = document.querySelector(".summary_value--in")
const labaleAmountOut = document.querySelector(".summary_value--out")
const labaleInterestAmount = document.querySelector(".summary_value--interest")
const labaleLogoutTimer = document.querySelector(".logout_time--time");
const labaleErrorMess = document.getElementById("errorText");

const inputLoginUser = document.querySelector(".login_input--user");
const inputLoginPin = document.querySelector(".login_input--pin");
const inputTransferTo = document.querySelector(".transfer_input--to");
const inputTransferAmount = document.querySelector(".transfer_input--amount");
const inputLoainAmount = document.querySelector(".form_loan_input--amount")
const inputCloseUser = document.querySelector(".form_close_input--user");
const inputClosePin = document.querySelector(".form_close_input--pin");

const btnLogin = document.querySelector(".login_btn");
const btnSort = document.querySelector(".summary_btn");
const btnTransfer = document.querySelector(".btn--transfer");
const btnLoan = document.querySelector(".form_btn--loan");
const btnClose = document.querySelector(".form_btn--close");
const btnOk = document.getElementById("btnOk");

// Global variables ************
let currentAccount;
let accountTimout;

// mainContainer.classList.add("opacity")

// create and save the user name 
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

// calculat date and for movments
const calcDate = function (local, date) {
    const calcDayDates = (date1, date2) =>
        Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));
    const dayPassed = calcDayDates(new Date(), date)
    if (dayPassed === 0) return "Today";
    if (dayPassed === 1) return "Yesterday";
    if (dayPassed <= 7) return `${dayPassed} day ago`;
    else return new Intl.DateTimeFormat(local).format(date);
}

// set amounts in cuntry wise currancy
const modify = function (num) {
    const options = {
        style: "currency",
        currency: currentAccount.currency,
    }
    return new Intl.NumberFormat(currentAccount.local, options).format(num);
}

// login inputs user name and pin functioning
function loginInputSomeFunctionig() {
    const allInputs = Array.from(document.querySelectorAll(".modifyInputs"));
    allInputs.forEach((el, i) => {
        if (i % 2 === 0) {
            el.addEventListener("keydown", (stap) => {
                if (stap.keyCode === 39) allInputs[i + 1].focus();
            })
        } else {
            el.addEventListener("keydown", (stap) => {
                if (stap.keyCode === 37) allInputs[i - 1].focus();
            })
        }
    })
}
loginInputSomeFunctionig()

// login btn 
btnLogin.addEventListener('click', (e) => {
    e.preventDefault()
    login();
})

// login function find the user account and call all function
function login() {
    const inputLoginUserValue = inputLoginUser.value.trim();
    const inputLoginPinValue = Number(inputLoginPin.value);
    inputLoginUser.value = inputLoginPin.value = '';
    inputLoginPin.blur()
    inputLoginUser.blur()
    currentAccount = accounts.
        find(acc => acc.userName === inputLoginUserValue);

    if (inputLoginPinValue && inputLoginUserValue) {
        if (
            currentAccount
            && currentAccount.pin === inputLoginPinValue
        ) {
            displayAccount(currentAccount);
            updateUI(currentAccount);
        } else if (currentAccount
            && currentAccount.pin !== inputLoginPinValue
        ) {
            displayMessage("Wrong password!");
        } else {
            displayMessage("This account dose not exist")
        }
    } else {
        displayMessage("Please fillup all inputs properly!");
    }
}

// the user acount and owner name display and setDate function call
function displayAccount(account) {
    labaleWalcome.textContent = `Welcome back, ${account.owner.split(' ')[0]}`
    mainContainer.classList.add("opacity");
    setDateTime();
}

// set today Date and time in Web page
function setDateTime() {
    // const local = navigator.language;
    const options = {
        hour: 'numeric',
        minute: 'numeric',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        weekday: 'long',
    }

    const dateTime = new Intl.DateTimeFormat(currentAccount.locale, options).format();
    labaleTimeDate.textContent = dateTime;
}

// all calcDisplayBalance, calcDisplaySummary and displayMovments call in one function
function updateUI(account) {
    calcDisplayBalance(account)
    calcDisplaySummary(account);
    displayMovments(account);
    startLogoutTimer();
    saveAccounts();
}

// calculat the balance and save it and display
function calcDisplayBalance(account) {
    account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
    labaleTotalAmount.textContent = modify(account.balance);
}

// calculat in, out and interest amount and display it. 
function calcDisplaySummary(account) {
    const IN = account.movements
        .filter(mov => mov > 0)
        .reduce((acc, mov) => acc + mov, 0);
    const OUT = Math.abs(account.movements
        .filter(mov => mov < 0)
        .reduce((acc, mov) => acc + mov, 0));
    const interest = account.movements
        .filter(mov => mov > 0)
        .map(mov => mov * account.interestRate / 100)
        .filter(interest => interest > 1)
        .reduce((acc, mov) => acc + mov, 0);

    labaleAmountIn.textContent = modify(IN);;
    labaleAmountOut.textContent = modify(OUT);;
    labaleInterestAmount.textContent = modify(interest);
}

// display all current account movments
function displayMovments(account, sort = false) {
    labaleMovements.innerHTML = "";
    let movs = sort ? account.movements.slice().sort((a, b) => a - b) : account.movements;
    movs.forEach((mov, i) => {
        const date = new Date(account.movementsDates[i])
        let movementsDate = calcDate(account.locale, date)

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
            <span class="moveDate">${movementsDate}</span>
            <span class="moveAmount">${modify(mov)}</span>
        `
        labaleMovements.prepend(div);
    })
    movmentBg()
}

// background coloring in movents
function movmentBg() {
    const movementElems = Array.from(document.querySelectorAll(".move"));
    movementElems.forEach((el, i) => {
        if (i % 2 == 0) {
            el.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
        }
    })
}

// sort all movments
let sorted = false;
btnSort.addEventListener('click', () => {
    displayMovments(currentAccount, !sorted);
    sorted = !sorted;
})

// logout the account in time
function startLogoutTimer() {
    let time = 600;
    if (accountTimout) {
        clearInterval(accountTimout)
    }
    const tick = function () {
        let minutes = String(Math.trunc(time / 60)).padStart(2, 0);
        let second = String(time % 60).padStart(2, 0);
        labaleLogoutTimer.textContent = `${minutes}:${second}`
        time--;
        if (minutes == 0 && second == 0) {
            clearInterval(accountTimout)
            mainContainer.classList.remove("opacity");
        }
    }
    tick();
    accountTimout = setInterval(tick, 1000)
}


// Transfer money
btnTransfer.addEventListener("click", (e) => {
    e.preventDefault();

    const recever = accounts
        .find(acc => acc.userName === inputTransferTo.value);
    let transferAmount = Number(inputTransferAmount.value);

    if (
        recever && recever !== currentAccount
        && currentAccount.balance >= transferAmount
        && transferAmount > 0
    ) {
        recever.movements.push(transferAmount);
        currentAccount.movements.push(-transferAmount);

        recever.movementsDates.push(new Date().toISOString());
        currentAccount.movementsDates.push(new Date().toISOString());
        updateUI(currentAccount);
        displayMessage(`${modify(transferAmount)} \n transfer succsefuly`)
    } else {
        if (!inputTransferAmount.value || !inputTransferTo.value) {
            displayMessage("Please fill proparly")
        } else if (!recever) {
            displayMessage("This Account dose not esxit")
        } else if (recever === currentAccount) {
            displayMessage("This Account same as current account")
        } else if (currentAccount.balance < transferAmount) {
            displayMessage("Your enter amount is not in your account")
        } else {
            displayMessage("Please enter a valide amount")
        }
    }
    inputTransferAmount.value = inputTransferTo.value = "";
    inputTransferTo.blur();
    inputTransferAmount.blur();
})

// Requast for loan 
btnLoan.addEventListener("click", (e) => {
    e.preventDefault();

    let loanAmount = Math.floor(Number(inputLoainAmount.value));
    const eligibility = currentAccount.movements.some(acc => acc >= loanAmount * 0.1);
    if (loanAmount > 0 && eligibility) {
        currentAccount.movements.push(loanAmount);
        currentAccount.movementsDates.push(new Date().toISOString());
        updateUI(currentAccount)
        displayMessage(`Loan amount ${modify(loanAmount)} is successfuly diposit in your account. `)
    } else {
        if (loanAmount <= 0) {
            displayMessage("Please enter a valide amount");
        } else {
            displayMessage(`Eligibility: Minimum 10% of amount should be diposit in your acount.
            The eligibility criteria could not Fill.`)
        }
    }

    inputLoainAmount.value = "";
    inputLoainAmount.blur();
})

// Close accounts
btnClose.addEventListener("click", (e) => {
    e.preventDefault();

    if (
        inputCloseUser.value === currentAccount.userName
        && Number(inputClosePin.value) === currentAccount.pin
    ) {
        const index = accounts.findIndex(acc => acc.userName === currentAccount.userName);
        accounts.splice(index, 1)
        mainContainer.classList.remove("opacity");
        saveAccounts()
        displayMessage("Account deleted successfuly")

    } else if (!inputClosePin.value || !inputCloseUser.value) {
        displayMessage("Please fill proparly")
    } else if (
        inputCloseUser.value === currentAccount.userName
        && Number(inputClosePin.value) !== currentAccount.pin
    ) {
        displayMessage("Wrong password!")
    } else {
        displayMessage("Dose not match current acount")
    }
    inputClosePin.value = inputCloseUser.value = "";
    inputClosePin.blur();
})

// Ok Error
btnOk.addEventListener("click", displayMessage);

// for Error messages
function displayMessage(mess = "This is an error!") {
    // errorContainer.style.height = `${document.body.offsetHeight + mainContainer.offsetHeight}px`
    document.body.classList.toggle("overflow");
    errorContainer.classList.toggle("display");
    labaleErrorMess.textContent = mess;
}
