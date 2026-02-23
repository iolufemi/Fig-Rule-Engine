/**
 * Example 8: API as input (use API response as a fact)
 *
 * BUSINESS: Pull data from an external API, then run your rules against that data.
 * Example flow: fetch a "post" from a demo API, register it as a fact "apiPost",
 * then run a rule that checks "is this post from user 1 and has id 1?" — useful when
 * your facts come from another system or service.
 *
 * Run: node examples/08-api-as-fact.mjs
 */

import { Action, Fact, Condition, Conditions, Rule, RuleEngine } from '../dist/index.js';

// --- STEP 1: Fetch from a public API ---
const action = new Action(
    { dummy: 1 },
    { action: 'request', value: null, dataPath: 'dummy' }
);
action.setUrl = 'https://jsonplaceholder.typicode.com/posts/1';
action.setMethod = 'GET';
action.setHeaders = {};
await action.request('post', {});

const apiResponse = action.getResult;

// --- STEP 2: Register the API response as a fact the engine can use ---
const apiPostFact = new Fact('apiPost');
apiPostFact.setFact = apiResponse;

// --- STEP 3: Define a rule that checks that fact ---
// Condition A: apiPost.userId must equal 1.
const condUserId = new Condition();
condUserId.fact('apiPost').operator('equal').value(1).path('userId');
// Condition B: apiPost.id must equal 1.
const condId = new Condition();
condId.fact('apiPost').operator('equal').value(1).path('id');

const conditions = new Conditions('apiPostValid');
conditions.all([condUserId.getCondition, condId.getCondition]);

const rule = new Rule('apiPostCheck');
rule
    .conditions('apiPostValid')
    .event('apiPostValid', { source: 'api' })  // source = where the fact came from (for logging/audit).
    .priority(1)
    .onSuccess(() => console.log('API-as-fact: post from API passed rule (userId=1, id=1).'))
    .onFailure(() => console.log('API-as-fact: post did not pass rule.'));

const ruleEngine = new RuleEngine();
const results = await ruleEngine.run();

console.log('Events:', results.events.length, results.events[0]?.type);

console.log('\n--- Sample result (structure from ruleEngine.run()) ---');
console.log(JSON.stringify({
    events: results.events,
    almanacSuccess: results.almanacSuccess,
    failureEvents: results.failureEvents ?? []
}, null, 2));

const ok = results.events.length === 1 && results.events[0].type === 'apiPostValid';
console.log(ok ? '\nOK: API as fact example passed.\n' : 'FAIL');
