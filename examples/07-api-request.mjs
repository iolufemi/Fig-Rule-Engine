/**
 * Example 7: HTTP request (call a public API)
 *
 * BUSINESS: Fetch data from an external service (e.g. get one record from a demo API).
 * No login required — uses the free JSONPlaceholder API. Shows how to set URL, method (GET),
 * and read the response from the Action.
 *
 * Run: node examples/07-api-request.mjs
 */

import { Action } from '../dist/index.js';

// Create an Action that will perform an HTTP "request". The constructor needs action, value, dataPath.
const action = new Action(
    { dummy: 1 },
    { action: 'request', value: null, dataPath: 'dummy' }
);

// Configure the request: URL, HTTP method, and optional headers.
action.setUrl = 'https://jsonplaceholder.typicode.com/posts/1';
action.setMethod = 'GET';
action.setHeaders = {};

// request(name, overrideData): name = key to store the response under (e.g. getData.requestData['post']);
// overrideData = for GET, query params; for POST, request body. Here we use GET with no extra params.
await action.request('post', {});

// Read the response: getResult holds the last result; requestData['post'] holds the response by name.
const result = action.getResult;
const byName = action.getData.requestData?.post;

console.log('GET https://jsonplaceholder.typicode.com/posts/1');
console.log('Response (getResult):', typeof result === 'object' && result !== null ? { ...result } : result);
console.log('Response (requestData.post):', typeof byName === 'object' && byName !== null ? { ...byName } : byName);

console.log('\n--- Sample result (structure from action.getResult / requestData) ---');
console.log(JSON.stringify({
    getResult: result,
    requestDataKey: 'post',
    requestDataPost: byName
}, null, 2));

const ok = result && typeof result === 'object' && 'id' in result && result.id === 1 && 'title' in result;
console.log(ok ? '\nOK: API request example passed.\n' : 'FAIL');
