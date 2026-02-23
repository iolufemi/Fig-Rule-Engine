/**
 * Example 3: Date difference (days, months, years)
 *
 * BUSINESS: Answer questions like "how many days between two dates?"
 * or "how many months/years?" — useful for eligibility windows, subscription age, etc.
 *
 * Run: node examples/03-date-difference.mjs
 */

import { Action } from '../dist/index.js';

// Create an Action configured for a date operation (numberOfDays).
// We pass dummy data and params so the constructor is valid; we'll call the methods directly.
const action = new Action(
    { dummy: 1 },
    { action: 'numberOfDays', value: null, dataPath: 'dummy' }
);

// numberOfDays(then, now): compute days between "then" and "now".
// getResult = the value produced by the last action method call (here, 9).
action.numberOfDays('2023-01-01', '2023-01-10');
console.log('Days between 2023-01-01 and 2023-01-10:', action.getResult);
console.log(action.getResult === 9 ? 'OK: numberOfDays passed.' : 'FAIL');

// Same idea for months and years.
action.numberOfMonths('2023-01-01', '2024-01-01');
console.log('Months between 2023-01-01 and 2024-01-01:', action.getResult);
console.log(action.getResult === 12 ? 'OK: numberOfMonths passed.' : 'FAIL');

action.numberOfYears('2020-01-01', '2024-01-01');
console.log('Years between 2020 and 2024:', action.getResult);

console.log('\n--- Sample result (structure from date actions) ---');
console.log(JSON.stringify({
    numberOfDays: 9,
    numberOfMonths: 12,
    numberOfYears: 4
}, null, 2));

console.log(action.getResult === 4 ? '\nOK: Date difference example passed.\n' : 'FAIL');
