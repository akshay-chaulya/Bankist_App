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
            if (accountTimout) {
                clearInterval(accountTimout)
            }
            startLogoutTimer();

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
    setDate();
}

// set today Date in Web page
function setDate() {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth();
    month += 1;
    let year = date.getFullYear();
    day = day > 10 ? day : `0${day}`;
    month = month > 10 ? month : `0${month}`;
    labaleTimeDate.textContent = `${day}/${month}/${year}`;
}

// all calcDisplayBalance, calcDisplaySummary and displayMovments call in one function
function updateUI(account) {
    calcDisplayBalance(account)
    calcDisplaySummary(account);
    displayMovments(account.movements);
}

// calculat the balance and save it and display
function calcDisplayBalance(account) {
    account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
    labaleTotalAmount.textContent = account.balance
}

// calculat in, out and interest amount and display it. 
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

    labaleAmountIn.textContent = `₹${IN}`;
    labaleAmountOut.textContent = `₹${Math.abs(OUT)}`;
    labaleInterestAmount.textContent = `₹${interest}`
}

// display all current account movments
function displayMovments(movements, sort = false) {
    labaleMovements.innerHTML = "";
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
            <span class="moveAmount">₹${Math.abs(mov)}</span>
        `
        labaleMovements.prepend(div);
    })
}

// sort all movments
let sorted = false;
btnSort.addEventListener('click', () => {
    displayMovments(currentAccount.movements, !sorted);
    sorted = !sorted;
})

// logout the account in time
function startLogoutTimer() {
    let minutes = 10;
    let second = 60;
    accountTimout = setInterval(() => {
        second = second == 0 ? 60 : second - 1;
        if (second == 59) {
            minutes -= 1;
        }
        second = second < 10 && second > 0 ? `0${second}` : second;
        let logoutTimeStr = minutes < 10 ? `0${minutes}:${second}` : `${minutes}:${second}`
        labaleLogoutTimer.textContent = logoutTimeStr;
        if (minutes == 0 && second == 0) {
            labaleLogoutTimer.textContent = "00:00"
            clearInterval(accountTimout)
            mainContainer.classList.remove("opacity");
        }
    }, 1000)

}


// Transfer money
btnTransfer.addEventListener("click", (e) => {
    e.preventDefault();

    const recever = accounts
        .find(acc => acc.userName === inputTransferTo.value);
    let transferAmount = Number(inputTransferAmount.value);
    inputTransferAmount.value = inputTransferTo.value = "";
    inputTransferTo.blur();
    inputTransferAmount.blur();

    if (
        recever && recever !== currentAccount
        && currentAccount.balance >= transferAmount
        && transferAmount > 0
    ) {
        recever.movements.push(transferAmount);
        currentAccount.movements.push(-transferAmount);
        updateUI(currentAccount);
        displayMessage(`${transferAmount} \n transfer succsefuly`)
    } else {
        if (!recever) {
            displayMessage("This Account dose not esxit")
        } else if (recever === currentAccount) {
            displayMessage("This Account same as current account")
        } else if (currentAccount.balance < transferAmount) {
            displayMessage("Your enter amount is not in your account")
        } else {
            displayMessage("Please enter a valide amount")
        }
    }
})

// Requast for loan 
btnLoan.addEventListener("click", (e) => {
    e.preventDefault();

    let loanAmount = Number(inputLoainAmount.value);
    const eligibility = currentAccount.movements.some(acc => acc >= loanAmount * 0.1);
    if (loanAmount > 0 && eligibility) {
        currentAccount.movements.push(loanAmount);
        updateUI(currentAccount)
        displayMessage(`Loan amount ${loanAmount} is successfuly diposit in your account. `)
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
btnOk.addEventListener("click", () => {
    displayMessage()
})

// for Error messages
function displayMessage(mess = "This is an error!") {
    // errorContainer.style.height = `${document.body.offsetHeight + mainContainer.offsetHeight}px`
    document.body.classList.toggle("overflow");
    errorContainer.classList.toggle("display");
    labaleErrorMess.textContent = mess;
}
