/**
 * Example 2: Action arithmetic (e.g. calculate tax)
 *
 * BUSINESS: Compute tax as "price × tax rate" (e.g. 100 × 0.2 = 20).
 * This shows how to use the Action class for calculations that your rules might need.
 *
 * Run: node examples/02-action-arithmetic.mjs
 */

import { Action } from '../dist/index.js';

// Data we'll use: price and tax rate. The Action reads from this object.
const data = { price: 100, taxRate: 0.2 };

// Params: action = which method to run ('multiply'); value = second argument (0.2 = tax rate);
// dataPath = key in data for the first argument ('price' → 100). So run() will compute 100 * 0.2.
const params = { action: 'multiply', value: 0.2, dataPath: 'price' };
const action = new Action(data, params);

// run() executes the action (multiply) and returns the result.
const result = await action.run();

console.log('Tax (100 * 0.2):', result);

console.log('\n--- Sample result (structure from action.run()) ---');
console.log(JSON.stringify({ result }, null, 2));

console.log(result === 20 ? '\nOK: Action arithmetic example passed.\n' : 'FAIL');
