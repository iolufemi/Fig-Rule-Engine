[![Node.js CI](https://github.com/iolufemi/project780/actions/workflows/node.js.yml/badge.svg)](https://github.com/iolufemi/project780/actions/workflows/node.js.yml) [![codecov](https://codecov.io/gh/iolufemi/project780/graph/badge.svg?token=OkUkkAi7Er)](https://codecov.io/gh/iolufemi/project780)

# Fig Rule Engine Documentation

---

## For everyone (plain language)

**What is this?**  
The Fig Rule Engine helps you automate decisions. You give it **data** (e.g. “this customer spent $600” or “this customer is gold”), you define **rules** (e.g. “if spend &gt; $500 and status is gold, apply a discount”), and the engine tells you which rules passed or failed and what to do next.

**Why use it?**  
So you can run promotions, loyalty tiers, fraud checks, or any “if this, then that” logic in one place—without hard-coding every case in your app. Business people can understand the rules; developers plug in the data and run the engine.

**How does it work in one sentence?**  
You register **facts** (your data), **conditions** (the checks, like “amount greater than 500”), **rules** (which conditions must pass and what happens when they do or don’t), then you **run** the engine and get a result (and optionally call APIs or do calculations).

The rest of this document explains the same ideas in more detail: first for **everyone**, then **technical details** for developers.

---

## Overview (technical)

The **Fig Rule Engine** is a flexible tool designed to automate decision-making in business processes. It allows organizations to define custom rules, conditions, and actions that are evaluated against data points called **facts**. This engine is particularly useful for customer management, fraud detection, loyalty programs, and personalized marketing.

The Fig Rule Engine is modular and written in TypeScript. Facts, conditions, and rules are registered in a central registry and then evaluated by the **RuleEngine**.

---

## Table of Contents

1. [For everyone (plain language)](#for-everyone-plain-language)
2. [Overview (technical)](#overview-technical)
3. [Installation](#installation)
4. [API at a glance](#api-at-a-glance)
5. [Core Concepts](#core-concepts)
6. [Class Details](#class-details)
   - [Fact Class](#fact-class)
   - [Condition Class](#condition-class)
   - [Conditions Class](#conditions-class)
   - [Rule Class](#rule-class)
   - [Action Class](#action-class)
   - [RuleEngine Class](#ruleengine-class)
   - [Name Class](#name-class)
7. [Allowed Operators](#allowed-operators)
8. [RuleEngine requirements](#ruleengine-requirements)
9. [Example Use Cases](#example-use-cases)
   - [Runnable examples](#runnable-examples)
10. [Error handling](#error-handling)
11. [Testing](#testing)

---

## Installation

- **Node.js**: >= 20.19.0 (see `engines` in `package.json`).
- Install: `npm install`
- Build (TypeScript): `npm run build` — compiles `src/` to `dist/` with declarations.
- Test: `npm test` — runs the full test suite (build + coverage).

**Programmatic use (after build):**

```javascript
import { Name, Fact, Conditions, Condition, Rule, RuleEngine, Action } from '<package-or-path>/dist/index.js';
```

TypeScript users get types from the package `types` field (`dist/index.d.ts`). When consuming from the repo, run `npm run build` first, then import from `dist/`.

**Runnable examples:** The **examples/** directory contains runnable scripts. After `npm run build`, run e.g. `node examples/01-high-spending-discount.mjs`. See [Runnable examples](#runnable-examples) below.

---

## API at a glance

| Export       | Description |
|-------------|-------------|
| **Name**    | Internal registry for facts, conditions, and rules. Used by other classes. |
| **Fact**    | Stores a named data point (object or function). |
| **Condition** | Single logical check: fact + operator + value (+ path, params). Chainable; supports custom operators. |
| **Conditions** | Group of conditions with `all` (AND), `any` (OR), and `not`. |
| **Rule**    | Links a named Conditions set to an event, priority, onSuccess, and onFailure. |
| **RuleEngine** | Discovers facts and rules from the Name registry and runs the engine. |
| **Action**  | Operations on data: arithmetic, date differences, booleans, HTTP requests. |
| **ActionParams**, **ConditionShape**, **FactData** | TypeScript types (from `dist/index.js` types). |

---

## Core Concepts

### Facts (your data)
**Facts** are the data the engine uses to evaluate rules. Examples: “transaction amount is 600”, “customer status is gold”. A fact can be a fixed object (e.g. `{ amount: 500 }`) or a function that returns data when the engine runs. All conditions and rules depend on facts.

### Conditions (the checks)
**Conditions** are the criteria that must be met for a rule to trigger. Each condition checks one thing: e.g. “transaction amount greater than 500”, “customer status equal to gold”. You can combine conditions with “all must pass” (AND) or “at least one must pass” (OR).

### Rules (what happens when)
**Rules** link a set of conditions to outcomes: when the conditions pass, the rule **fires** and you can run success logic (e.g. apply discount); when they fail, you can run failure logic (e.g. show “not eligible”). Each rule needs a name, conditions, an event, a priority, and both success and failure handlers to be executed by the engine.

### Actions (calculations and API calls)
**Actions** are operations the engine or your code can run: arithmetic (e.g. tax = price × rate), date differences (e.g. days between two dates), or HTTP requests (e.g. fetch data from an API or POST a result to a webhook).

### Key terms used in examples and code

| Term | Meaning |
|------|--------|
| **path** | The field name inside the fact object that the condition checks. E.g. `path('amount')` means “use the fact’s `amount` field”. |
| **priority** | A number (≥ 1) that controls run order when multiple rules could fire: **higher number = runs first**. |
| **getCondition** | A getter on a Condition that returns the condition in the shape the engine needs. You pass it into `conditions.all([...])` or `conditions.any([...])` to plug that check into a group. |
| **event params** | Extra data attached to a rule when it fires (e.g. `{ discount: 10 }`, `{ threshold: 100 }`). Your code can read these to know *what value* was used (e.g. “10% off”, “above 100”). |
| **results.events** | List of rules that fired; each event has a **type** and **params**. |
| **results.almanacSuccess** | Whether the engine run completed successfully. |
| **results.failureEvents** | Rules that were evaluated but their conditions did **not** pass (so they did not fire). |
| **Action params** | For `new Action(data, params)`: **action** = which method to run (e.g. `'multiply'`, `'request'`); **value** = second argument to that method (e.g. tax rate); **dataPath** = key in `data` for the first argument (e.g. `'price'` → 100). |
| **request(name, overrideData)** | **name** = key to store the HTTP response under (e.g. `getData.requestData['post']`); **overrideData** = for GET sent as query params, for POST sent as request body. |

---

## Class Details

### Fact Class

- **Constructor:** `new Fact(name: string)`
- **setFact** (setter): Accepts an **object** or a **function** `(params, almanac) => value`. Use `fact.setFact = data` or `fact.setFact = (params, almanac) => value`.
- **getFact** (getter): Returns the stored data (object or function).
- **Fact.find(name)**: Returns the fact’s **data** (object or function), not a Fact instance. Throws if the fact is not found or not of type fact.

#### Example (object and function fact)

```javascript
const fact = new Fact('transaction');
fact.setFact = { amount: 1500 };
console.log(Fact.find('transaction')); // { amount: 1500 }

const dynamicFact = new Fact('computed');
dynamicFact.setFact = (params, almanac) => params.value * 2;
```

---

### Condition Class

- **Constructor:** `new Condition()` or `new Condition(overrideCondition)` (object with `fact`, `operator`, `value`, optional `path`, `params`).
- **Methods (chainable):** `fact(name)`, `operator(op)`, `value(value)`, `path(path)`, `params(params)`.
- **addOperator(op)**: Registers a custom operator name so it can be used in conditions.
- **getCondition** (getter): Returns the condition object.

Path can be a dot path (e.g. `amount`) or JSONPath-style (e.g. `$.price`).

#### Example

```javascript
const condition = new Condition();
condition.fact('transaction').operator('greaterThan').value(1000).path('amount');
console.log(condition.getCondition);
// { fact: 'transaction', operator: 'greaterThan', value: 1000, path: 'amount' }
```

---

### Conditions Class

- **Constructor:** `new Conditions(name: string)`
- **all(conditions)**: Adds conditions with AND logic. Accepts an array or a single condition object. Can be called multiple times; conditions accumulate.
- **any(conditions)**: Same as `all` but with OR logic.
- **not(condition)**: Adds a condition that must NOT be true.
- **getData** (getter): Returns the stored structure `{ all?, any?, not? }`.

---

### Rule Class

- **Constructor:** `new Rule(name: string)`
- **conditions(conditionsName)**: Links the rule to a named Conditions set (must exist).
- **event(type, params)**: When the rule fires, an event is emitted with a **type** (e.g. `'discount'`) and optional **params** (extra data for whoever handles the event). Params are arbitrary key-value data—e.g. `{ discount: 10 }` (how much to discount), `{ threshold: 100 }` (the cutoff value that defined “high value”), or `{ level: 'premium' }`—so listeners know both *what* happened and *with what values*.
- **priority(n)**: Sets priority (number **≥ 1**). Higher values run first.
- **onSuccess(fn)**, **onFailure(fn)**: Handlers `(event, almanac) => …`. **Both must be set** for the rule to be registered with the RuleEngine.
- **Rule.find(name)**: Returns the **Name** object for that rule (with `getType`, `conditions`, `event`, etc.), not raw data.

#### Example

```javascript
const rule = new Rule('highValuePurchase');
rule.conditions('purchaseConditions')
    .event('applyDiscount', { discount: 10 })
    .priority(1)
    .onSuccess(() => console.log('Discount applied'))
    .onFailure(() => console.log('Discount not applied'));
```

---

### Action Class

- **Constructor:** `new Action(data, params)` where **params** = `{ action: string, value: unknown, dataPath: string }`.
- **Setters/getters:** setFirstNumber, getFirstNumber, setSecondNumber, getSecondNumber, setNow, setThen, setResult, setParams, setData, setHeaders, setMethod, setUrl, getData, getParams, getHeaders, getMethod, getUrl, getResult.
- **getDataItem(item)**: Returns the value at dot path `item` in `this.data` (e.g. `getDataItem('data.amount')`).

**Actions (methods):**

| Method | Description |
|--------|-------------|
| multiply, divide, add, substract | Arithmetic (firstNumber, secondNumber). Note: method name is **substract** (typo in API). |
| true, false | Set result to boolean true/false. |
| numberOfDays, numberOfWeeks, numberOfMonths, numberOfYears | Date difference (then, now). |
| request(name, overrideData) | HTTP request. Requires **setUrl**, **setMethod** (only **GET** or **POST**). Response is stored in **getData.requestData[name]**. |
| run() | Runs the action specified in **params.action** with **params.value** and the value at **params.dataPath**; returns a Promise of the result. |

Validation: numbers for numeric setters, method must be GET or POST for request, etc.

#### Example (request)

```javascript
const action = new Action({ key: 1 }, { action: 'multiply', value: 2, dataPath: 'key' });
action.setUrl = 'https://api.example.com/data';
action.setMethod = 'GET';
action.setHeaders = { 'X-Custom': 'value' };
await action.request('myRequest', { id: 1 });
console.log(action.getData.requestData.myRequest); // response data
```

---

### RuleEngine Class

- **Constructor:** `new RuleEngine()` — Discovers facts and rules via **Name.findByType()** and registers them with the underlying engine. Only rules that have **name**, **conditions**, **event**, **priority**, **onSuccess**, and **onFailure** are added.
- **run()**: Returns a **Promise** with the engine result. Important fields: **events** (array of rules that fired; each has `type` and `params`), **almanacSuccess** (whether the run succeeded), **failureEvents** (rules that were evaluated but did not pass). Your code can use these to apply discounts, log outcomes, or POST to an API.
- **artifacts** (property): `{ facts?: Array<…>, rules?: Array<…> }` — snapshot of registered facts and rules.

#### Example

```javascript
const ruleEngine = new RuleEngine();
const result = await ruleEngine.run();
console.log(result.events, result.almanac);
```

---

### Name Class

**Name** is the internal registry used by Fact, Conditions, and Rule. You typically do not construct Name directly for business logic; use Fact, Conditions, and Rule instead.

- **Name.save(nameObj)**: Saves a Name instance (used internally).
- **Name.find(name)**: Returns the Name instance by name. Throws if not found.
- **Name.findAll()**: Returns all saved names.
- **Name.findByType()**: Returns an object keyed by type: `{ fact: [...], rule: [...], conditions: [...] }`. Each value is an array of `{ name, ... }` items. Used by RuleEngine to discover facts and rules.
- **Name.update(name, obj)**: Updates a Name’s `type` and/or `data` (obj may have `type`, `data`).

---

## Allowed Operators

Built-in operators (for conditions):

- **String/number:** `equal`, `notEqual`
- **Numeric:** `lessThan`, `lessThanInclusive`, `greaterThan`, `greaterThanInclusive`
- **Array:** `in`, `notIn`, `contains`, `doesNotContain`

Operators are **extensible**: use **Condition.addOperator('customOp')** to register a custom operator name (the actual evaluation is provided by the underlying json-rules-engine or custom operators).

---

## RuleEngine requirements

For a rule to be registered and executed by **RuleEngine**:

- It must have: **name**, **conditions**, **event**, **priority**, **onSuccess**, and **onFailure**.
- **priority** must be a number **≥ 1**.
- The named **Conditions** and referenced **Facts** must already exist in the Name registry.

---

## Example Use Cases

### Runnable examples

After `npm run build`, run any script from the project root (e.g. `node examples/01-high-spending-discount.mjs`).

| Script | In plain language | Technical note |
|--------|-------------------|-----------------|
| `01-high-spending-discount.mjs` | **Promo rule:** Give a discount only when the purchase is over $500 **and** the customer is gold. | AND conditions, success/failure handlers. |
| `02-action-arithmetic.mjs` | **Calculate tax:** Multiply price by tax rate (e.g. 100 × 0.2 = 20). | Action arithmetic and `run()`. |
| `03-date-difference.mjs` | **Date math:** Compute days, months, or years between two dates. | `numberOfDays`, `numberOfMonths`, `numberOfYears`. |
| `04-boolean-action.mjs` | **Yes/no flags:** Set a result to true or false for use in other logic. | Action `true()` / `false()`. |
| `05-or-conditions.mjs` | **Tier access:** Grant access if the customer is gold **or** silver (either is enough). | OR conditions (`any`). |
| `06-rule-failure.mjs` | **When the rule doesn’t apply:** Purchase is too small, so no discount; show a “not eligible” outcome. | Rule does not fire; `onFailure` runs. |
| `07-api-request.mjs` | **Call an API:** Fetch one record from a public demo API (no login). | HTTP GET with Action. |
| `08-api-as-fact.mjs` | **Use API data in rules:** Fetch data from an API, treat it as a fact, then run rules on it (e.g. “is this post valid?”). | API response → Fact → RuleEngine. |
| `09-api-notify.mjs` | **Send results to an API:** Run rules, then POST the result (e.g. which rules fired) to a webhook or endpoint. | RuleEngine result → HTTP POST. |

**How to read the examples:** Each file in `examples/` has a short **business summary** at the top (what the example does in plain language), then **line-by-line comments** in the code so both developers and non-developers can follow step by step. Run any example with `node examples/XX-name.mjs` after `npm run build`. At the end of each example, a **Sample result** is printed so you can see the exact structure of the output.

**Sample result and API payload structure:** When you run the examples, you’ll see output like the following.

*Structure of `ruleEngine.run()` result (rule examples 01, 05, 06, 08, 09):*

```json
{
  "events": [
    { "type": "discount", "params": { "discount": 10 } }
  ],
  "almanacSuccess": true,
  "failureEvents": []
}
```

- **events** — Array of rules that fired; each has **type** and **params**.
- **almanacSuccess** — Whether the engine run completed successfully.
- **failureEvents** — Rules that were evaluated but their conditions did not pass (optional; may be absent on the raw result).
- **almanac** — Optional runtime fact storage from the engine (when present).

*Structure of the API payload body when POSTing rule result (example 09 — notify):*

```json
{
  "events": [
    { "type": "highValue", "params": { "threshold": 100 } }
  ],
  "almanacSuccess": true,
  "failureEvents": [],
  "almanac": {}
}
```

Your webhook or API can read **events** (what fired and with what params), **almanacSuccess**, **failureEvents**, and **almanac** to log, audit, or react to the rule run.

### 1. High-spending customer discount

Apply a 10% discount when amount > 500 and status is gold. **onSuccess** and **onFailure** must both be set for the rule to run. Runnable as `node examples/01-high-spending-discount.mjs`.

```javascript
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
ruleEngine.run().then(results => console.log(results));
```

### 2. Action arithmetic and run()

Use **Action** with **multiply**, **add**, **divide**, **substract** and **run()** to compute values from data (e.g. tax = price × rate). See `examples/02-action-arithmetic.mjs`.

### 3. Date-based rules

Use Action methods **numberOfDays**, **numberOfWeeks**, **numberOfMonths**, **numberOfYears** with optional `then` and `now` arguments (or set via **setThen** / **setNow**). See `examples/03-date-difference.mjs`.

### 4. Custom operator

Call **Condition.addOperator('myOp')** before using `'myOp'` in a condition. The underlying engine must support or be extended with the corresponding operator implementation.

### 5. Boolean actions and OR conditions

Use Action methods **true()** and **false()** for boolean results (see `examples/04-boolean-action.mjs`). Use **Conditions.any([...])** for OR logic (see `examples/05-or-conditions.mjs`).

### 6. Rule that does not fire (onFailure)

When conditions are not met, no event is emitted and **onFailure** is called. See `examples/06-rule-failure.mjs`.

### 7. HTTP request in an action

Use **setUrl**, **setMethod** (GET or POST), **setHeaders**, then **request(name, overrideData)**. Read the response from **getResult** or **getData.requestData[name]**. A full runnable example using the public [JSONPlaceholder](https://jsonplaceholder.typicode.com) API (no auth) is in `examples/07-api-request.mjs`.

### 8. API as input (fact)

Fetch from a public API with **Action.request()**, then set the response as a **Fact**. Build conditions and rules that evaluate against this fact and run the engine. See `examples/08-api-as-fact.mjs`.

### 9. API as notify (POST result)

Run the rule engine, then **POST** the rule result (e.g. `results.events`, `almanacSuccess`) to an API endpoint using **Action** with **setMethod('POST')** and **request(name, payload)**. See `examples/09-api-notify.mjs`.

---

## Error handling

Common errors:

- **Invalid fact name** or fact not found when building a condition.
- **Invalid operator** (not in the allowed list and not added via addOperator).
- **Missing onSuccess or onFailure** on a rule (rule will not be registered).
- **Priority &lt; 1** or non-numeric priority.
- **Action:** invalid **params** (missing or wrong type for action, value, dataPath), invalid **data**, or **action** not a valid method name.
- **request():** **setMethod** not GET or POST (e.g. PATCH throws).

---

## Testing

- **Command:** `npm test` — runs `npm run build` then the test suite with coverage (c8 + mocha). Tests are in **test/** as TypeScript (e.g. `action.test.ts`, `engine.test.ts`, `rulesEngine.test.ts`) and run against the built **dist/** output.
- **Lint:** `npx eslint src test` (ESLint 10 with TypeScript support).

---

## License and author

- **License:** Apache-2.0  
- **Author:** iolufemi &lt;iolufemi@ymail.com&gt;
