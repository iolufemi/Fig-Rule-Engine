/**
 * Example 4: Boolean actions (true() and false())
 * Run: node examples/04-boolean-action.mjs
 */
import { Action } from '../dist/index.js';

const action = new Action(
    { x: 1 },
    { action: 'true', value: null, dataPath: 'x' }
);
action.true();
console.log('action.true() result:', action.getResult);
console.log(action.getResult === true ? 'OK: true() passed.' : 'FAIL');

action.false();
console.log('action.false() result:', action.getResult);
console.log(action.getResult === false ? 'OK: Boolean action example passed.\n' : 'FAIL');
