/**
 * Example 5: OR conditions (any) — rule fires if status is gold OR silver
 * Run: node examples/05-or-conditions.mjs
 */
import { Fact, Condition, Conditions, Rule, RuleEngine } from '../dist/index.js';

const fact = new Fact('customer_status');
fact.setFact = { status: 'silver' }; // Not gold; silver qualifies with "any"

const condGold = new Condition();
condGold.fact('customer_status').operator('equal').value('gold').path('status');
const condSilver = new Condition();
condSilver.fact('customer_status').operator('equal').value('silver').path('status');

const conditions = new Conditions('premiumStatus');
conditions.any([condGold.getCondition, condSilver.getCondition]);

const rule = new Rule('premiumAccess');
rule.conditions('premiumStatus')
    .event('grantAccess', { level: 'premium' })
    .priority(1)
    .onSuccess(() => console.log('Premium access granted (gold or silver).'))
    .onFailure(() => console.log('Access denied.'));

const ruleEngine = new RuleEngine();
const results = await ruleEngine.run();
console.log('Events:', results.events.length, results.events[0]?.type);
console.log(results.events.length === 1 && results.events[0].type === 'grantAccess'
    ? 'OK: OR conditions example passed.\n' : 'FAIL');
