/**
 * Example 2: Action arithmetic and run()
 * Run: node examples/02-action-arithmetic.mjs
 */
import { Action } from '../dist/index.js';

const data = { price: 100, taxRate: 0.2 };
const params = { action: 'multiply', value: 0.2, dataPath: 'price' };
const action = new Action(data, params);

// Compute tax: price * taxRate via run() (uses params.action, params.value, params.dataPath)
const result = await action.run();
console.log('Tax (100 * 0.2):', result);
console.log(result === 20 ? 'OK: Action arithmetic example passed.\n' : 'FAIL');
