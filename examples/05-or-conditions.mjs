/**
 * Example 5: OR conditions (any) — premium access
 *
 * BUSINESS: Grant premium access if the customer is gold OR silver.
 * Only one of the conditions needs to pass (OR logic), unlike Example 1 where ALL had to pass.
 *
 * Run: node examples/05-or-conditions.mjs
 */

import { Fact, Condition, Conditions, Rule, RuleEngine } from '../dist/index.js';

// Fact: customer status is "silver". With OR, either "gold" or "silver" will trigger the rule.
const fact = new Fact('customer_status');
fact.setFact = { status: 'silver' };

// Condition A: status must equal "gold".
const condGold = new Condition();
condGold.fact('customer_status').operator('equal').value('gold').path('status');

// Condition B: status must equal "silver".
const condSilver = new Condition();
condSilver.fact('customer_status').operator('equal').value('silver').path('status');

// ANY of these conditions can pass (OR). We name this group "premiumStatus".
const conditions = new Conditions('premiumStatus');
conditions.any([condGold.getCondition, condSilver.getCondition]);

// Rule: if premiumStatus passes (gold OR silver), fire "grantAccess".
const rule = new Rule('premiumAccess');
rule
    .conditions('premiumStatus')
    .event('grantAccess', { level: 'premium' })  // level = tier name for listeners (e.g. for logging or UI).
    .priority(1)
    .onSuccess(() => console.log('Premium access granted (gold or silver).'))
    .onFailure(() => console.log('Access denied.'));

const ruleEngine = new RuleEngine();
const results = await ruleEngine.run();

console.log('Events:', results.events.length, results.events[0]?.type);

console.log('\n--- Sample result (structure from ruleEngine.run()) ---');
console.log(JSON.stringify({
    events: results.events,
    almanacSuccess: results.almanacSuccess,
    failureEvents: results.failureEvents ?? []
}, null, 2));

console.log(results.events.length === 1 && results.events[0].type === 'grantAccess'
    ? '\nOK: OR conditions example passed.\n' : 'FAIL');
