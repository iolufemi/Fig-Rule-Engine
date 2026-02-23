/**
 * Example 7: HTTP request (Action with a public API)
 * Run: node examples/07-api-request.mjs
 * Uses JSONPlaceholder (https://jsonplaceholder.typicode.com) - no auth required.
 */
import { Action } from '../dist/index.js';

const action = new Action(
    { dummy: 1 },
    { action: 'request', value: null, dataPath: 'dummy' }
);

action.setUrl = 'https://jsonplaceholder.typicode.com/posts/1';
action.setMethod = 'GET';
action.setHeaders = {};

await action.request('post', {});

const result = action.getResult;
const byName = action.getData.requestData?.post;

console.log('GET https://jsonplaceholder.typicode.com/posts/1');
console.log('Response (getResult):', typeof result === 'object' && result !== null ? { ...result } : result);
console.log('Response (requestData.post):', typeof byName === 'object' && byName !== null ? { ...byName } : byName);

const ok = result && typeof result === 'object' && 'id' in result && result.id === 1 && 'title' in result;
console.log(ok ? 'OK: API request example passed.\n' : 'FAIL');
