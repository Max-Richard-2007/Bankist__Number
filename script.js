"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: "Max Richard",
  movements: [900.41, 10800.23, -7606.5, 55500, -1042.21, -23.9, 4000],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2023-11-18T21:31:17.178Z",
    "2023-12-23T07:42:02.383Z",
    "2024-01-28T09:15:04.904Z",
    "2024-04-01T10:17:24.185Z",
    "2024-05-08T14:11:59.604Z",
    "2024-06-01T17:01:17.194Z",
    "2024-06-02T23:36:17.929Z",
    "2024-06-03T10:51:36.790Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2023-11-01T13:15:33.035Z",
    "2023-11-30T09:48:16.867Z",
    "2023-12-25T06:04:23.907Z",
    "2024-01-25T14:18:46.235Z",
    "2024-02-05T16:33:06.386Z",
    "2024-06-01T14:43:26.374Z",
    "2024-06-02T18:49:59.371Z",
    "2024-06-03T12:01:20.894Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  // console.log(daysPassed);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    // Create current date and time

    return new Intl.DateTimeFormat(locale).format(date);

    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth()}`.padStart(2, 0);
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;
  }
};

const formatCur = function (value, locale, currency) {
  return Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const date = new Date(acc.movementsDates[i]);
    const displayDates = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDates}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);

      labelWelcome.textContent = "Log in to get started";
      containerApp.style.opacity = 0;
    }

    // Decrese 1s
    time--;
  };

  // Set time to 5 minutes
  let time = 300;

  // call the timer every second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

///////////////////////////////////////
// Event handlers

let currentAccount, timer;

// FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 0;

btnLogin.addEventListener("click", function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  // console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;

    // create current date and time

    // Experimenting API
    const now = new Date();

    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      // month: "long",
      month: "numeric",
      year: "numeric",
      // weekday: "long",
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // labelDate.textContent = new Intl.DateTimeFormat("en-US", options).format(
    //   now
    // );

    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth()}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}/, ${hour}:${min}`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date()).toString();
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer()
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      // add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

        // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer()

    }, 2500);
  }
  inputLoanAmount.value = "";
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = "";
});

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// Conversion
// console.log(Number('23')); // 23
// console.log(+'23'); // 23

// Parsing

// console.log(`\n Parsing \n\n`);

// console.log('Parsin In: ', Number.parseInt('30px', 10));
// console.log('Parsin In: ', Number.parseInt('e30', 10));

// console.log('Parsin In: ', Number.parseInt('  2.5rem  '));
// console.log(Number.parseFloat('  2.5rem  '));

// console.log(parseFloat(' 2.5rem  '));

// console.log(`\n NaN \n \n`)

// Check if value is NaN
// console.log(Number.isNaN(20));
// console.log(Number.isNaN('20'));
// console.log(Number.isNaN(+'20X'));
// console.log(Number.isNaN(23 / 0));

// console.log(`\n isFinite \n \n`)

// Checking is value is number
// console.log(Number.isFinite(20))
// console.log(Number.isFinite('20'));
// console.log(Number.isFinite(+'20X'));
// console.log(Number.isFinite(23 / 0));

// console.log(`\n isInteger \n \n`)

// console.log(Number.isInteger(23));
// console.log(Number.isInteger(23.0));
// console.log(Number.isInteger(23 / 0));

// console.log(`\n Math sqrt \n \n`);

// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));
// console.log(8 ** (1 / 3));

// console.log(`\n Math max \n \n`);

// console.log(Math.max(5, 18, 23, 11, 2));
// console.log(Math.max(5, 18, "23", 11, 2));
// console.log(Math.max(5, 18, "23px", 11));

// console.log(`\n Math min \n \n`);

// console.log(Math.min(5, 18, 23, 1));

// console.log(`\n Math PI \n \n`);

// console.log(Math.PI * Number.parseFloat("10px") ** 2);

// console.log(Math.trunc(Math.random() * 6) + 1);

// const randomInt = (min, max) =>
//   Math.trunc(Math.random() * (max - min + 1) + min);
// console.log(randomInt(10, 20));

// // Rounding integers
// console.log("Round: ", Math.round(23.3));
// console.log("Round: ", Math.round(23.9));

// console.log("ceil: ", Math.ceil(23.3));
// console.log("ceil: ", Math.ceil(23.9));

// console.log("Floor: ", Math.floor(23.3));
// console.log("Floor: ", Math.floor("23.3"));

// console.log("Trunc: ", Math.trunc(23.3));

// console.log("Trunc: ", Math.trunc(-23.3));
// console.log("Floor: ", Math.floor(-23.9));

// // Rounding decimals
// console.log("toFixed: ", (2.7).toFixed(0));
// console.log("toFixed: ", (2.7).toFixed(3));
// console.log("toFixed: ", (2.7).toFixed(2));
// console.log("toFixed: Use + to convert the number ", +(2.745).toFixed(2));

// console.log(8 % 3);
// console.log(8 / 3); // 8 = 2 * 3 + 2

// console.log(6 % 2);
// console.log(6 / 2);

// console.log(7 % 2);
// console.log(7 / 2);

// const isEven = (n) => n % 2 === 0;
// console.log(8);
// console.log(76);
// console.log(1338);

// labelBalance.addEventListener("click", function () {
//   [...document.querySelectorAll(".movements__row")].forEach(function (row, i) {
//     if (i % 2 === 0) row.style.backgroundColor = "orangered";
//     if (i % 3 === 0) row.style.backgroundColor = "blue";
//   });
// });

// 287,460,000,000
// const diameter = 287_460_000_000;
// console.log(diameter);

// const price = 345_99;
// console.log(price);

// const transferFeel = 15_00;
// const transferFeel2 = 1_500;

// const PI = 3.1415;
// console.log(PI);

// console.log(Number("230_000"));
// console.log(parseInt("230_000"));

// console.log("2 ** 53 - 1 = ", 2 ** 53 - 1);
// console.log(Number.Max_SAFE_INTEGER);
// console.log("2 ** 53 + 1 = ", 2 ** 53 + 1);
// console.log("2 ** 53 + 2 = ", 2 ** 53 + 2);
// console.log("2 ** 53 + 3 = ", 2 ** 53 + 3);
// console.log("2 ** 53 + 4 = ", 2 ** 53 + 4);

// // console.log(758734875082738478057208972893885947587498270894759887); // ERRORE
// console.log("n = ", 758734875082738478057208972893885947587498270894759887n);
// console.log("BigInt = ", BigInt(7587348750842738));

// // Operation
// console.log("1000n + 10000n = ", 1000n + 10000n);
// console.log("1000n * 10000n = ", 10000000000000000000n * 10000000000000000000n);

// const huge = 925890324759073445808858937957n;
// const num = 23;

// console.log(huge * BigInt(num));

// // Exceptions
// console.log("200n > 15 = ", 200n > 15);
// console.log("20 === 20 = ", 20 === 20);
// console.log("typeof 20n = ", typeof 20n);
// console.log("20 == '20' = ", 20 == "20");

// create date

/*
const now = new Date();
console.log(now);

console.log(new Date("May 05 30 9:56:13"));
console.log(new Date("May 30, 2024"));
console.log(account1.movementsDates[0]);

console.log(new Date("2024, 5, 30"));

console.log(new Date("0"));
console.log(new Date(3 * 24 * 60 * 60 * 1000));
*/

// Working with dates
// const future = new Date(2024, 5, 30, 10, 15);
// console.log("Year =", future.getFullYear());
// console.log("Date =", future.getDate());
// console.log("Month =", future.getMonth());
// console.log("Day =", future.getDay());
// console.log("Hours =", future.getHours());
// console.log("Minutes =", future.getMinutes());
// console.log("Seconds =", future.getSeconds());
// console.log("Milliseconds =", future.getMilliseconds());
// console.log('All of them =',future.toISOString());
// console.log('Milliseconds =',future.getTime());

// future.setFullYear(2024);
// console.log(future)

// const future = new Date(2024, 6, 10, 6, 31);
// console.log(+future);

// const calcDaysPassed = (date1, date2) =>
//   (date2 - date1) / (1000 * 60 * 60 * 24);
// const days1 = calcDaysPassed(new Date(2024, 6, 3), new Date(2024, 6, 13));
// console.log(days1);

// const num = 426455.43;

// const options = {
//   style: "unit",
//   unit: "celsius",
//   // currency: "USD",
// };

// console.log("US: ", Intl.NumberFormat("en-Us", options).format(num));
// console.log("Germany: ", Intl.NumberFormat("de-DE", options).format(num));
// console.log("Syria: ", Intl.NumberFormat("ar-SY", options).format(num));

// SetTimeout
// const ingredients = ["olives", "spinach"];

// const pizzaTimer = setTimeout(
//   (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2} 🍕`),
//   3000,
//   ...ingredients
// );

// console.log("Waiting...");

// if (ingredients.includes("spinach")) clearTimeout(pizzaTimer);

// setInterval
// setInterval(function () {
//   const now = new Date();
//   const hours = now.getHours();
//   const minute = now.getMinutes();
//   const seconds = now.getSeconds();

//   console.log(`${hours}:${minute}:${seconds}`);
// }, 1000);
