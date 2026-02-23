/**
 * Example 1: High-spending customer discount
 *
 * BUSINESS: Apply a 10% discount only when BOTH are true:
 *   - Transaction amount is greater than $500
 *   - Customer status is "gold"
 *
 * Run from project root (after "npm run build"):
 *   node examples/01-high-spending-discount.mjs
 */

import { Fact, Condition, Conditions, Rule, RuleEngine } from '../dist/index.js';

// --- FACTS (the data the engine will check) ---

// Create a fact named "transaction" and set its data: one field "amount" = 600.
const transactionFact = new Fact('transaction');
transactionFact.setFact = { amount: 600 };

// Create a fact named "customer_status" and set its data: one field "status" = "gold".
const customerStatusFact = new Fact('customer_status');
customerStatusFact.setFact = { status: 'gold' };

// --- CONDITIONS (the checks we want to run) ---

// Condition 1: check the fact "transaction" — its "amount" field must be greater than 500.
// path('amount') = the field name inside the fact object to check.
const condition1 = new Condition();
condition1.fact('transaction').operator('greaterThan').value(500).path('amount');

// Condition 2: check the fact "customer_status" — its "status" field must equal "gold".
const condition2 = new Condition();
condition2.fact('customer_status').operator('equal').value('gold').path('status');

// Group conditions: ALL must pass (AND logic). We name this group "promoEligibility".
// getCondition = the condition in the shape the engine needs; we pass it into all().
const conditions = new Conditions('promoEligibility');
conditions.all([condition1.getCondition, condition2.getCondition]);

// --- RULE (what happens when conditions pass or fail) ---

// Create a rule named "applyDiscount" that uses the "promoEligibility" conditions.
const rule = new Rule('applyDiscount');
rule
    .conditions('promoEligibility')
    // discount: 10 = e.g. 10% or 10 currency units — your app decides; params are for whoever handles the event.
    .event('discount', { discount: 10 })
    .priority(1)   // Run order: higher number = runs first (when you have multiple rules).
    .onSuccess(() => console.log('Discount applied successfully'))   // Called when conditions pass.
    .onFailure(() => console.log('Discount could not be applied'));  // Called when conditions fail.

// --- RUN THE ENGINE ---

// The engine discovers all registered facts and rules, then evaluates them.
const ruleEngine = new RuleEngine();
const results = await ruleEngine.run();

// Results tell us which rules fired (events) and other details.
console.log('Events:', results.events.length);
console.log('First event type:', results.events[0]?.type);

console.log('\n--- Sample result (structure from ruleEngine.run()) ---');
console.log(JSON.stringify({
    events: results.events,
    almanacSuccess: results.almanacSuccess,
    failureEvents: results.failureEvents ?? []
}, null, 2));

console.log('\nOK: High-spending discount example passed.\n');
