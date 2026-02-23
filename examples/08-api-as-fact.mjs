/**
 * Example 8: API as input / fact
 * Fetch from a public API, set the response as a fact, then run rules against it.
 * Run: node examples/08-api-as-fact.mjs
 */
import { Action, Fact, Condition, Conditions, Rule, RuleEngine } from '../dist/index.js';

// 1. Fetch from public API
const action = new Action(
    { dummy: 1 },
    { action: 'request', value: null, dataPath: 'dummy' }
);
action.setUrl = 'https://jsonplaceholder.typicode.com/posts/1';
action.setMethod = 'GET';
action.setHeaders = {};
await action.request('post', {});

const apiResponse = action.getResult;

// 2. Register API response as a fact
const apiPostFact = new Fact('apiPost');
apiPostFact.setFact = apiResponse;

// 3. Rule: fire when post userId is 1 and id is 1
const condUserId = new Condition();
condUserId.fact('apiPost').operator('equal').value(1).path('userId');
const condId = new Condition();
condId.fact('apiPost').operator('equal').value(1).path('id');

const conditions = new Conditions('apiPostValid');
conditions.all([condUserId.getCondition, condId.getCondition]);

const rule = new Rule('apiPostCheck');
rule.conditions('apiPostValid')
    .event('apiPostValid', { source: 'api' })
    .priority(1)
    .onSuccess(() => console.log('API-as-fact: post from API passed rule (userId=1, id=1).'))
    .onFailure(() => console.log('API-as-fact: post did not pass rule.'));

const ruleEngine = new RuleEngine();
const results = await ruleEngine.run();

console.log('Events:', results.events.length, results.events[0]?.type);
const ok = results.events.length === 1 && results.events[0].type === 'apiPostValid';
console.log(ok ? 'OK: API as fact example passed.\n' : 'FAIL');