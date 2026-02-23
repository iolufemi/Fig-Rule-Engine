/**
 * Example 3: Date difference (numberOfDays, numberOfWeeks, numberOfMonths, numberOfYears)
 * Run: node examples/03-date-difference.mjs
 */
import { Action } from '../dist/index.js';

const action = new Action(
    { dummy: 1 },
    { action: 'numberOfDays', value: null, dataPath: 'dummy' }
);

action.numberOfDays('2023-01-01', '2023-01-10');
console.log('Days between 2023-01-01 and 2023-01-10:', action.getResult);
console.log(action.getResult === 9 ? 'OK: numberOfDays passed.' : 'FAIL');

action.numberOfMonths('2023-01-01', '2024-01-01');
console.log('Months between 2023-01-01 and 2024-01-01:', action.getResult);
console.log(action.getResult === 12 ? 'OK: numberOfMonths passed.' : 'FAIL');

action.numberOfYears('2020-01-01', '2024-01-01');
console.log('Years between 2020 and 2024:', action.getResult);
console.log(action.getResult === 4 ? 'OK: Date difference example passed.\n' : 'FAIL');
