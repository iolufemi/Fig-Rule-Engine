/**
 * Example 6: Rule that does not fire (onFailure)
 *
 * BUSINESS: Same discount rule as Example 1, but the transaction amount is only $100.
 * So the rule's conditions are NOT met — no discount is applied, and we run the
 * "failure" path (e.g. show "not eligible" or log that the rule did not apply).
 *
 * Run: node examples/06-rule-failure.mjs
 */

import { Fact, Condition, Conditions, Rule, RuleEngine } from '../dist/index.js';

// Fact: transaction amount is 100 (below the 500 threshold we'll check).
const transactionFact = new Fact('transaction');
transactionFact.setFact = { amount: 100 };

// Condition: "transaction.amount" must be greater than 500. With amount=100, this will fail.
const condition1 = new Condition();
condition1.fact('transaction').operator('greaterThan').value(500).path('amount');

const conditions = new Conditions('noDiscountEligibility');
conditions.all([condition1.getCondition]);

// Rule: when conditions fail, onFailure is called; no event is added to results.events.
// event() is still required; discount: 0 would be the "amount" if the rule ever fired (here it won't).
const rule = new Rule('noDiscount');
rule
    .conditions('noDiscountEligibility')
    .event('discount', { discount: 0 })
    .priority(1)
    .onSuccess(() => console.log('Discount applied'))
    .onFailure(() => console.log('Discount could not be applied (amount too low)'));

const ruleEngine = new RuleEngine();
const results = await ruleEngine.run();

// We expect zero events (rule did not fire) and onFailure was called.
console.log('Events fired:', results.events.length);

console.log('\n--- Sample result (structure from ruleEngine.run() when no rule fires) ---');
console.log(JSON.stringify({
    events: results.events,
    almanacSuccess: results.almanacSuccess,
    failureEvents: results.failureEvents ?? []
}, null, 2));

console.log(results.events.length === 0 ? '\nOK: Rule failure (onFailure) example passed.\n' : 'FAIL');
