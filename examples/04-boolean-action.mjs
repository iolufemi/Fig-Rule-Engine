/**
 * Example 4: Boolean actions (true / false)
 *
 * BUSINESS: Set a clear "yes" or "no" result that other logic can use
 * (e.g. "is eligible?", "should we notify?").
 *
 * Run: node examples/04-boolean-action.mjs
 */

import { Action } from '../dist/index.js';

// Action constructor needs action (method name), value, dataPath. For true()/false() we don't use value/dataPath;
// we just need a valid action name so the constructor accepts it; then we call .true() or .false() directly.
const action = new Action(
    { x: 1 },
    { action: 'true', value: null, dataPath: 'x' }
);

// Set the action's result to true. Useful when you need an explicit boolean for downstream logic.
action.true();
console.log('action.true() result:', action.getResult);
console.log(action.getResult === true ? 'OK: true() passed.' : 'FAIL');

// Set the action's result to false.
action.false();
console.log('action.false() result:', action.getResult);

console.log('\n--- Sample result (structure from boolean actions) ---');
console.log(JSON.stringify({ getResult: action.getResult }, null, 2));

console.log(action.getResult === false ? '\nOK: Boolean action example passed.\n' : 'FAIL');
