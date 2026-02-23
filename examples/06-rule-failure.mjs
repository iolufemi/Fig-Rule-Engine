/**
 * Example 6: Rule that does not fire (onFailure) — amount too low
 * Run: node examples/06-rule-failure.mjs
 */
import { Fact, Condition, Conditions, Rule, RuleEngine } from '../dist/index.js';

const transactionFact = new Fact('transaction');
transactionFact.setFact = { amount: 100 }; // Below 500

const condition1 = new Condition();
condition1.fact('transaction').operator('greaterThan').value(500).path('amount');

const conditions = new Conditions('noDiscountEligibility');
conditions.all([condition1.getCondition]);

const rule = new Rule('noDiscount');
rule.conditions('noDiscountEligibility')
    .event('discount', { discount: 0 })
    .priority(1)
    .onSuccess(() => console.log('Discount applied'))
    .onFailure(() => console.log('Discount could not be applied (amount too low)'));

const ruleEngine = new RuleEngine();
const results = await ruleEngine.run();
console.log('Events fired:', results.events.length);
console.log(results.events.length === 0 ? 'OK: Rule failure (onFailure) example passed.\n' : 'FAIL');
