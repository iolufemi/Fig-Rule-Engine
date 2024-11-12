# Fig - Rule Engine

[![Node.js CI](https://github.com/iolufemi/project780/actions/workflows/node.js.yml/badge.svg)](https://github.com/iolufemi/project780/actions/workflows/node.js.yml)


# Rule Engine Documentation

This documentation provides an overview of each class and method within the Rule Engine system. The Rule Engine allows businesses to define and execute complex conditions, actions, and rules on data sets, which can help automate decision-making processes such as applying discounts, flagging suspicious transactions, and more. This guide is designed for both business and technical audiences, providing example use cases, step-by-step implementation, and code samples.

## Table of Contents

1. [Overview](#overview)
2. [Core Concepts](#core-concepts)
   - [Facts](#facts)
   - [Conditions](#conditions)
   - [Rules](#rules)
3. [Classes](#classes)
   - [Action](#action)
   - [Condition](#condition)
   - [Conditions](#conditions-class)
   - [Fact](#fact)
   - [Name](#name)
   - [Rule](#rule)
   - [RuleEngine](#ruleengine)
4. [Example Use Cases](#example-use-cases)
5. [Implementation Steps](#implementation-steps)

---

## Overview

The Rule Engine is a system that automates decision-making based on a set of predefined rules, conditions, and facts. It is highly flexible and can be adapted to a wide range of business scenarios, from validating transactions to determining eligibility for promotions. Using the Rule Engine, business teams can create rules without extensive coding knowledge, while developers can customize and expand the system's capabilities.

---

## Core Concepts

### Facts

**Facts** are pieces of information or data that the Rule Engine uses to make decisions. Facts can be any data relevant to a rule, such as customer transaction history, account status, or specific metrics.

- **Example**: A fact might be a customer's average monthly spending or the number of transactions in the last 30 days.

### Conditions

**Conditions** are logical statements that evaluate facts. They define what must be true (or false) for a rule to execute.

- **Example**: A condition could check if the customer's transaction amount is greater than a certain threshold or if the customer’s account is active.

### Rules

**Rules** are the core of the Rule Engine. They define actions that should occur if specified conditions are met. A rule can include multiple conditions, and each rule has a priority level, success actions, and failure actions.

- **Example**: If a customer spends more than $500 in a single transaction, apply a 10% discount.

---

## Classes

### Action

The `Action` class is responsible for executing specific mathematical or logical operations based on the parameters provided. It allows for custom calculations and comparisons on data.

#### Constructor

```javascript
new Action(data, params);
```

- **`data`** (Object): The data to be processed.
- **`params`** (Object): Specifies `action`, `value`, and `dataPath` for the action type, action value, and the data path.

#### Methods

- **Mathematical Operations**
  - `multiply`, `divide`, `add`, `substract`: Perform basic calculations.
- **Date Operations**
  - `numberOfDays`, `numberOfWeeks`, `numberOfMonths`, `numberOfYears`: Calculate date differences.
- **Logical Operations**
  - `true`, `false`: Set results as boolean values.
- **Request Execution**
  - `request`: Executes an HTTP request using the configured URL and method.

#### Example

```javascript
const data = { transactionStats: { sales: { medianDailyValue: 200 } } };
const params = { action: 'multiply', value: 0.3, dataPath: 'transactionStats.sales.medianDailyValue' };
const action = new Action(data, params);

action.multiply().getResult; // Returns 60
```

### Condition

The `Condition` class defines a single logical condition, specifying a fact, operator, and value to evaluate.

#### Constructor

```javascript
new Condition();
```

#### Methods

- **`path(path)`**: Sets the data path for the condition.
- **`fact(factName)`**: Sets the fact to evaluate.
- **`params(paramsObject)`**: Sets additional parameters for the condition.
- **`value(value)`**: Sets the comparison value.
- **`operator(operator)`**: Sets the operator (e.g., `greaterThan`, `equal`).

#### Example

```javascript
const condition = new Condition()
    .path('$.price')
    .fact('product-price')
    .operator('greaterThan')
    .value(100);
```

### Conditions Class

The `Conditions` class groups multiple conditions together, allowing you to define complex logical requirements for a rule. Conditions can be combined with logical operations like `all` (AND) and `any` (OR).

#### Constructor

```javascript
new Conditions(name);
```

- **`name`**: A unique identifier for the set of conditions.

#### Methods

- **`not(condition)`**: Sets a condition that must not be met.
- **`all(conditions)`**: Groups conditions that must all be met.
- **`any(conditions)`**: Groups conditions where any one condition can be met.

#### Example

```javascript
const conditions = new Conditions('promoConditions');
conditions
    .all([{ fact: 'customer_spend', operator: 'greaterThan', value: 500 }])
    .not({ fact: 'is_blacklisted', operator: 'equal', value: true });
```

### Fact

The `Fact` class is used to define or retrieve information that will be evaluated by conditions and rules.

#### Constructor

```javascript
new Fact(name);
```

#### Methods

- **`setFact(factData)`**: Assigns data or a function to the fact.
- **`getFact()`**: Retrieves the data or function associated with the fact.
- **`static find(name)`**: Finds and returns a saved fact by name.

#### Example

```javascript
const fact = new Fact('avgSales');
fact.setFact({ sales: 1000 });
Fact.find('avgSales'); // { sales: 1000 }
```

### Name

The `Name` class provides a structure to store and manage named items in the Rule Engine, such as facts, rules, and conditions.

#### Constructor

```javascript
new Name(name);
```

#### Methods

- **`setType(type)`**: Sets the type of the named item.
- **`setData(data)`**: Assigns data to the named item.
- **`getType()`**: Retrieves the type.
- **`getData()`**: Retrieves the data.
- **`static save(nameObj)`**: Saves a `Name` instance.
- **`static find(name)`**: Finds and returns a saved `Name` instance.

#### Example

```javascript
const name = new Name('discountRule');
name.setType = 'rule';
name.setData = { discount: 10 };
Name.save(name);
```

### Rule

The `Rule` class defines business rules, associating them with conditions, events, and handlers for success and failure.

#### Constructor

```javascript
new Rule(name);
```

#### Methods

- **`conditions(conditionsName)`**: Links conditions to the rule.
- **`event(type, params)`**: Defines the event type and parameters.
- **`priority(level)`**: Sets the rule’s priority.
- **`onSuccess(handler)`**: Sets a function to run if the rule succeeds.
- **`onFaliure(handler)`**: Sets a function to run if the rule fails.

#### Example

```javascript
const rule = new Rule('VIPDiscount');
rule
    .conditions('promoConditions')
    .event('applyDiscount', { discount: 20 })
    .priority(1);
```

### RuleEngine

The `RuleEngine` class is the core of the Rule Engine. It initializes the engine with facts and rules and runs the rules against provided data.

#### Constructor

```javascript
new RuleEngine();
```

#### Methods

- **`run()`**: Executes all rules and returns a promise with results.

#### Example

```javascript
const ruleEngine = new RuleEngine();
ruleEngine.run().then(results => console.log(results));
```

---

## Example Use Cases

### Use Case 1: Discount Application

A business wants to automatically apply a 10% discount to any customer who spends over $500 in a single transaction, provided the customer isn’t blacklisted.

1. **Create Facts**: Define `customer_spend` and `is_blacklisted`.
2. **Define Conditions**: Set a condition to check if `customer_spend > 500` and `is_blacklisted != true`.
3. **Set Up Rule**: Define a rule that applies a 10% discount if both conditions are met.

### Use Case 2: Fraud Detection

A bank wants to flag any transaction over $1000 if it occurs from a new device or location.

1. **Create Facts**: Define `transaction_amount`, `device_id`, and `location`.
2. **Define Conditions**: Check if `transaction_amount > 1000` and `device_id` or `location` is new.
3. **Set Up Rule**: Flag the transaction if these conditions are met.

---

## Implementation Steps

1. **Define Facts**: Set up the facts you need to evaluate, such as transaction data or customer status.
2. **Create Conditions**: Group logical checks on facts, using operators to define thresholds or states.
3. **Set Up Rules**: Associate conditions with specific events, setting priorities and success or failure handlers.
4. **Run Rule Engine**: Use the `RuleEngine` class to execute the rules against incoming data.
