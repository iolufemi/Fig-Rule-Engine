/**
 * Example 9: API as endpoint to notify / POST result
 * Run rules, then POST the rule result to a public API (JSONPlaceholder).
 * Run: node examples/09-api-notify.mjs
 */
import { Fact, Condition, Conditions, Rule, RuleEngine, Action } from '../dist/index.js';

// 1. Simple rule: transaction amount > 100
const transactionFact = new Fact('transaction');
transactionFact.setFact = { amount: 250 };

const condition = new Condition();
condition.fact('transaction').operator('greaterThan').value(100).path('amount');

const conditions = new Conditions('highValue');
conditions.all([condition.getCondition]);

const rule = new Rule('highValueTx');
rule.conditions('highValue')
    .event('highValue', { threshold: 100 })
    .priority(1)
    .onSuccess(() => console.log('Rule fired: high-value transaction.'))
    .onFailure(() => console.log('Rule did not fire.'));

const ruleEngine = new RuleEngine();
const results = await ruleEngine.run();

// 2. POST the rule result to a public API (notification endpoint)
const payload = {
    title: 'Fig Rule Engine – rule result',
    body: JSON.stringify({
        events: results.events,
        almanacSuccess: results.almanacSuccess,
        failureEvents: results.failureEvents ?? []
    }),
    userId: 1
};

const notifyAction = new Action(
    { dummy: 1 },
    { action: 'request', value: null, dataPath: 'dummy' }
);
notifyAction.setUrl = 'https://jsonplaceholder.typicode.com/posts';
notifyAction.setMethod = 'POST';
notifyAction.setHeaders = { 'Content-type': 'application/json; charset=UTF-8' };

await notifyAction.request('notify', payload);

const notifyResult = notifyAction.getResult;
console.log('POST to https://jsonplaceholder.typicode.com/posts');
console.log('Response id:', notifyResult?.id);
console.log('Response title:', notifyResult?.title);

const ok = notifyResult && typeof notifyResult === 'object' && 'id' in notifyResult;
console.log(ok ? 'OK: API notify (POST result) example passed.\n' : 'FAIL');