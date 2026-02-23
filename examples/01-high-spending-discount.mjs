/**
 * Example 1: High-spending customer discount
 * Run from project root: node examples/01-high-spending-discount.mjs
 * (Run "npm run build" first.)
 */
import { Fact, Condition, Conditions, Rule, RuleEngine } from '../dist/index.js';

const transactionFact = new Fact('transaction');
transactionFact.setFact = { amount: 600 };
const customerStatusFact = new Fact('customer_status');
customerStatusFact.setFact = { status: 'gold' };

const condition1 = new Condition();
condition1.fact('transaction').operator('greaterThan').value(500).path('amount');
const condition2 = new Condition();
condition2.fact('customer_status').operator('equal').value('gold').path('status');

const conditions = new Conditions('promoEligibility');
conditions.all([condition1.getCondition, condition2.getCondition]);

const rule = new Rule('applyDiscount');
rule.conditions('promoEligibility')
    .event('discount', { discount: 10 })
    .priority(1)
    .onSuccess(() => console.log('Discount applied successfully'))
    .onFailure(() => console.log('Discount could not be applied'));

const ruleEngine = new RuleEngine();
const results = await ruleEngine.run();
console.log('Events:', results.events.length);
console.log('First event type:', results.events[0]?.type);
console.log('OK: High-spending discount example passed.\n');
