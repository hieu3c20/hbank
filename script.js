'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'ho van hieu',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2021-01-28T09:15:04.904Z',
    '2022-12-13T10:17:24.185Z',
    '2022-12-25T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2022-12-26T23:36:17.929Z',
    '2022-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'vn-VN',
};

const account2 = {
  owner: 'nguyen manh hai',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2021-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2022-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'vn-VN',
};

const account3 = {
  owner: 'tran nhu lam',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    '2022-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2022-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2022-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2021-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'vn-VN',
};

const account4 = {
  owner: 'do doan vu',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    '2023-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2011-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2022-02-05T16:33:06.386Z',
    '2021-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2026-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'vn-VN',
};

const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////
// // Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const popupClose = document.querySelector('.popup-close');
const insButton = document.querySelector('.instructor');
const popupInstructions = document.querySelector('.popup-instructor');
const popupLayout = document.querySelector('.layout');

/////////////////////////////////////////////////
// // Functions
const formatMovementDate = function (date, locale) {
  const calcDayPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const dayPassed = calcDayPassed(new Date(), date);

  switch (dayPassed) {
    case 0:
      return 'Today';
    case 1:
      return 'Yesterday';
  }
  if (dayPassed <= 7) {
    return `${dayPassed} days ago`;
  }

  /**
   * 
  const day = `${date.getDate()}`.padStart(2, 0);
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const year = date.getFullYear();
  const hour = `${date.getHours()}`.padStart(2, 0);
  const minute = `${date.getMinutes()}`.padStart(2, 0);
  const second = `${date.getSeconds()}`.padStart(2, 0);
   */

  return new Intl.DateTimeFormat(locale).format(date);
};

const calcDisplayBalance = function (acc) {
  const balanceDisplay = acc.movements.reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
  acc.balance = balanceDisplay;
  labelBalance.textContent = formatCurr(
    balanceDisplay,
    acc.locale,
    acc.currency
  );
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);

    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = new Intl.NumberFormat(acc.locale, {
      style: 'currency',
      currency: acc.currency,
    }).format(mov);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCurr(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCurr(out, acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((interestRate, i, arr) => interestRate >= 1)
    .reduce((acc, intR) => acc + intR, 0);
  labelSumInterest.textContent = formatCurr(interest, acc.locale, acc.currency);
};

const updateUI = function (acc) {
  displayMovements(acc);

  calcDisplayBalance(acc);

  calcDisplaySummary(acc);
};

const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsername(accounts);

const formatCurr = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    time--;
  };

  let time = 180;
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

/////////////////////////////////////////////////
// // Interface Interaction

/**
 * 
const year = current.getFullYear();
const day = `${current.getDate()}`.padStart(2, 0);
const month = `${current.getMonth() + 1}`.padStart(2, 0);
const hour = `${current.getHours()}`.padStart(2, 0);
const minute = `${current.getMinutes()}`.padStart(2, 0);
const second = `${current.getSeconds()}`.padStart(2, 0);

labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minute}:${second}`;
 */
let currentAccount, timer;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );

  if (currentAccount && currentAccount.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    const current2 = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    };

    // const locale = navigator.language;

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(current2);

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    updateUI(currentAccount);
  } else {
    labelWelcome.textContent = 'error! try again';
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiveAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiveAcc &&
    currentAccount.balance >= amount &&
    receiveAcc?.userName !== currentAccount.userName
  ) {
    setTimeout(function () {
      currentAccount.movements.push(-amount);
      receiveAcc.movements.push(amount);

      currentAccount.movementsDates.push(new Date().toISOString());
      receiveAcc.movementsDates.push(new Date().toISOString());

      updateUI(currentAccount);

      clearInterval(timer);
      timer = startLogOutTimer();
    }, 1500);
  } else {
    labelWelcome.textContent = 'cannot transfer';
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputLoanAmount.value;

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      currentAccount.movements.push(amount);

      currentAccount.movementsDates.push(new Date().toISOString());

      updateUI(currentAccount);

      clearInterval(timer);
      timer = startLogOutTimer();
    }, 3000);
  }

  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );

    accounts.splice(index, 1);

    containerApp.style.opacity = 0;

    labelWelcome.textContent = 'Log in to get started';
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;

btnSort.addEventListener('click', function (e) {
  setTimeout(function () {
    e.preventDefault();

    displayMovements(currentAccount, !sorted);
    sorted = !sorted;
  }, 1000);
});

insButton.addEventListener('click', function () {
  popupInstructions.classList.remove('hidden');
  popupLayout.classList.remove('hidden');
});

popupClose.addEventListener('click', function () {
  popupInstructions.classList.add('hidden');
  popupLayout.classList.add('hidden');
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

/** 
// USE REDUCER TO CALCULATE ALL THE DEPOSIT AND WITHDRAWAL OF THE ACCOUNT
const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sum, cur) => {
      // cur > 0 ? (sum.deposits += cur) : (sum.withdrawals += cur);
      sum[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sum;
    },
    { deposits: 0, withdrawals: 0 }
  );
console.log(deposits, withdrawals);
*/

/**
 * CHALLENGE WITH ARRAY (STANDARDIZE SENTENCE)
 * 
const standardizeSentence = sentence => {
  const expectation = [
    'a',
    'an',
    'the',
    'and',
    'but',
    'or',
    'in',
    'with',
    'on',
  ];

  const word = sentence
    .toLowerCase()
    .split(' ')
    .map(word =>
      expectation.includes(word) ? word : word[0].toUpperCase() + word.slice(1)
    )
    .join(' ');

  return word;
};

console.log(standardizeSentence('this is nice title'));
console.log(standardizeSentence('this is long title but not too long'));
 */

/**
 * CHALLENGE WITH ARRAY (8 CHALLENGE)
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1 CALCULATE THE RECOMMENDED FOOD FOR EACH OF THE DOG
dogs.forEach(
  dog => (dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28))
);
console.log(dogs);
// 2 CHECK WHETHER SARAHS DOG EAT ENOUGH
const amountOfSarah = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(amountOfSarah);
console.log(
  `sarah's dog is eating too ${
    amountOfSarah.curFood > amountOfSarah.recommendedFood ? 'much' : 'title'
  }`
);
// 3 ARRAY WITH DOG EAT TOO MUCH AND TO LITTLE
const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood < dog.recommendedFood)
  .map(dog => dog.owners)
  .flat();
console.log(ownersEatTooMuch);

const ownersEatTooTitle = dogs
  .filter(dog => dog.curFood > dog.recommendedFood)
  .map(dog => dog.owners)
  .flat();
console.log(ownersEatTooTitle);

// 4 PRINT THE DOG EAT TOO MUCH OR TOO TITLE
console.log(
  `${ownersEatTooMuch.join(
    ' and '
  )} dogs eat too much \n${ownersEatTooTitle.join(' and ')} dogs eat too title`
);

// 5 PRINT WHETHER HAVING THE DOG EAT ENOUGH AMOUNT OF FOOD => JUST PRINT TRUE OR FALSE
console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));

// 6 PRINT THE DOG EATING THE PROPER AMOUNT OF FOOD (90% OR 110% OF RECOMMENDED FOOD)
const properFood = dog =>
  dog.curFood > dog.recommendedFood * 0.9 &&
  dog.curFood < dog.recommendedFood * 1.1;

console.log(dogs.some(properFood));

// 7 ARRAY CONTAIN THE DOG THAT EAT ENOUGH AMOUNT OF FOOD
console.log(dogs.filter(properFood));

// 8  CREATE A SHALLOW COPY OF THE DOGS ARRAY AND SORT IT BY RECOMMENDED FOOD PORTION IN ASCENDING ORDER
const dogsSorted = dogs.slice().sort((a, b) => a.curFood - b.recommendedFood);
console.log(dogsSorted);

labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    if (i % 2 === 0) row.style.backgroundColor = 'yellow';
    if (i % 3 === 0) row.style.backgroundColor = 'blue';
  });
});
 */

/*
PRACTICE WITH FILTER TO FIND OUT MOVEMENT > 0, < 0

// filter method
const deposit = movements.filter(function (mov) {
  return mov > 0;
});

// array and a loop
const depositFor = [];
for (const mov of movements) {
  if (mov > 0) depositFor.push(mov);
}

// filter method (movement<0)
const withdrawal = movements.filter(function (mov, i, map) {
  return mov < 0;
});
*/

/*
PRACTICE WITH REDUCER TO FIND OUT SUM OF MOVEMENT (WITHDRAW AND DEPOSIT)

// reduce method to calculate greatest value
const calcGreatest = movements.reduce(function (acc, mov) {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);
*/

/*
PRACTICE INTEGRATED MAP, FILTER, REDUCE 
(human age = 2 times dog age if dog age < 2, else: human age = 16 + dog age time 4
filter adult = human age > 18 
calculate average age of previous adult)

const calcAverageHumanAge = function (dogAge) {
  const humanAges = dogAge.map(dog => (
    dog <= 2 ? 2*dog : 16 + dog * 4
  ))
  const adult = humanAges.filter(age => age >= 18)
  const averageAge = adult.reduce((acc, age) => (
    (acc + age)
  ), 0) / adult.length
  return averageAge
};
const dogAges = [5, 2, 4, 1, 15, 8, 3]
calcAverageHumanAge(dogAges);
*/

/*
PRACTICE WITH FIND, FILTER, MAP
// find method 
const accountFind = accounts.find(acc => acc.interestRate === 0.7)

// filter methods 
const accountFilter = accounts.filter(acc => acc.interestRate > 0.7)

// map methods 
const accountMap = accounts.map(acc => acc.interestRate < 0.7)
console.log(accountMap);
*/

/*
// SORTING ARRAY OR NUMBER
const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
console.log(owners.sort());
console.log(owners);

// Numbers
console.log(movements);
// return < 0, A, B (keep order)
// return > 0, B, A (switch order)

// Ascending
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
// });
movements.sort((a, b) => a - b);
console.log(movements);

// Descending
// movements.sort((a, b) => {
//   if (a > b) return -1;
//   if (a < b) return 1;
// });
movements.sort((a, b) => b - a);
console.log(movements);
*/

/*
SIMPLE ARRAY METHOD

let arr = ['a', 'b', 'c', 'd', 'e'];
// SLICE
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(-1));
console.log(arr.slice(1, -2));
console.log(arr.slice());
console.log([...arr]);

// SPLICE
console.log(arr.splice(2));
arr.splice(-1);
console.log(arr);
arr.splice(1, 2);
console.log(arr);

// REVERSE
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());
console.log(arr2);

// CONCAT
const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]);

// JOIN
console.log(letters.join(' - '));
*/

/*
// MORE WAYS OF CREATING AND FILLING ARRAY

const arr = [1, 2, 3, 4, 5, 6, 7];
// console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// Emprty arrays + fill method
const x = new Array(7);
// console.log(x.map(() => 5));
x.fill(2, 3, 5);
console.log(x);
x.fill(1);
console.log(x);
arr.fill(23, 2, 6);
console.log(arr);

// Array.from
const y = Array.from({ length: 7 }, () => 1);
console.log(y);
const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementsUI);
  const movementsUI2 = [...document.querySelectorAll('.movements__value')];
  const movementAfterMap = movementsUI2.map(node =>
    node.textContent.replace('€', '')
  );
  console.log(movementsUI2);
  console.log(movementAfterMap);
});
*/
