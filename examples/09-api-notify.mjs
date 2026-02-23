/**
 * Example 9: API as endpoint to notify (POST rule result)
 *
 * BUSINESS: Run your rules, then send the outcome to another system (e.g. webhook,
 * audit log, or notification service). Here we run a simple "high-value transaction"
 * rule and POST the rule result (events, etc.) to a demo API so an external system
 * can react (e.g. send an alert or log the decision).
 *
 * Run: node examples/09-api-notify.mjs
 */

import { Fact, Condition, Conditions, Rule, RuleEngine, Action } from '../dist/index.js';

// --- STEP 1: Run a simple rule (high-value transaction) ---
const transactionFact = new Fact('transaction');
transactionFact.setFact = { amount: 250 };

const condition = new Condition();
condition.fact('transaction').operator('greaterThan').value(100).path('amount');

const conditions = new Conditions('highValue');
conditions.all([condition.getCondition]);

const rule = new Rule('highValueTx');
rule
    .conditions('highValue')
    // event(type, params): when this rule fires, an event is emitted with "type" and optional "params".
    // params are custom data for whoever handles the event. Here:
    //   threshold: 100 — the cutoff we used in the condition (amount > 100). It means "transactions
    //   above 100 count as high-value". Including it lets listeners know what "high value" meant.
    .event('highValue', { threshold: 100 })
    .priority(1)
    .onSuccess(() => console.log('Rule fired: high-value transaction.'))
    .onFailure(() => console.log('Rule did not fire.'));

const ruleEngine = new RuleEngine();
const results = await ruleEngine.run();

console.log('\n--- Sample result (structure from ruleEngine.run()) ---');
console.log(JSON.stringify({
    events: results.events,
    almanacSuccess: results.almanacSuccess,
    failureEvents: results.failureEvents ?? [],
    almanac: results.almanac != null ? '(present: runtime fact storage)' : undefined
}, null, 2));

// --- STEP 2: POST the rule result to an API (e.g. webhook or audit endpoint) ---
// events = rules that fired (each has type + params); almanacSuccess = run succeeded;
// failureEvents = rules that were evaluated but conditions did not pass.
// JSONPlaceholder expects title, body, userId; your real endpoint may expect different fields.
const bodyPayload = {
    events: results.events,
    almanacSuccess: results.almanacSuccess,
    failureEvents: results.failureEvents ?? [],
    almanac: results.almanac != null ? results.almanac : undefined
};
const payload = {
    title: 'Fig Rule Engine – rule result',
    body: JSON.stringify(bodyPayload),
    userId: 1
};

console.log('\n--- Sample API payload (body structure: events, almanac, failureEvents) ---');
console.log(JSON.stringify(bodyPayload, null, 2));

const notifyAction = new Action(
    { dummy: 1 },
    { action: 'request', value: null, dataPath: 'dummy' }
);
notifyAction.setUrl = 'https://jsonplaceholder.typicode.com/posts';
notifyAction.setMethod = 'POST';
notifyAction.setHeaders = { 'Content-type': 'application/json; charset=UTF-8' };

await notifyAction.request('notify', payload);

const notifyResult = notifyAction.getResult;
console.log('\nPOST to https://jsonplaceholder.typicode.com/posts');
console.log('Response id:', notifyResult?.id);
console.log('Response title:', notifyResult?.title);

console.log('\n--- Sample API response (from POST) ---');
console.log(JSON.stringify(notifyResult, null, 2));

const ok = notifyResult && typeof notifyResult === 'object' && 'id' in notifyResult;
console.log(ok ? '\nOK: API notify (POST result) example passed.\n' : 'FAIL');
