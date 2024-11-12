[![Node.js CI](https://github.com/iolufemi/project780/actions/workflows/node.js.yml/badge.svg)](https://github.com/iolufemi/project780/actions/workflows/node.js.yml)

# Fig Rule Engine Documentation

The **Fig Rule Engine** is designed to automate business decisions by defining rules, conditions, and actions that operate on data points (referred to as facts). This engine is flexible and can help businesses create complex decision-making flows based on facts about customers, transactions, and more. It’s designed for both technical and non-technical users, allowing them to create rules without extensive coding.

---

## Table of Contents

1. [Overview](#overview)
2. [Core Concepts](#core-concepts)
3. [Class Details](#class-details)
    - [Fact](#fact)
    - [Condition](#condition)
    - [Conditions](#conditions)
    - [Rule](#rule)
    - [Action](#action)
    - [Name](#name)
    - [RuleEngine](#ruleengine)
4. [Allowed Operators](#allowed-operators)
5. [Example Use Cases](#example-use-cases)
6. [Implementation Steps](#implementation-steps)

---

## Overview

The **Fig Rule Engine** enables automation of decisions through a set of rules, each with associated conditions and actions. The engine works by evaluating conditions on data (facts) and executing the defined actions if those conditions are met. This documentation serves as both a guide for developers and an overview for business teams.

---

## Core Concepts

### Facts
**Facts** are data points or information that the Rule Engine evaluates. They can be constants, such as a customer’s monthly spending, or dynamically generated, such as the current date. Facts are used within conditions to make decisions.

- **Example**: A fact named `monthly_spend` may hold a customer’s monthly spending amount.

### Conditions
**Conditions** define the logic of the Rule Engine. Each condition evaluates a fact against a specified operator and value.

- **Example**: A condition could check if `monthly_spend` is greater than 500.

### Rules
**Rules** represent the actions that should be taken if specified conditions are met. Each rule consists of one or more conditions and defines what should happen if the rule is met (or not met). 

- **Example**: If `monthly_spend > 500`, apply a 10% discount to the customer’s next purchase.

---

## Class Details

### Fact Class

The `Fact` class represents individual data points. Facts can be simple values (e.g., numbers, strings) or functions that calculate a result.

#### Constructor

```javascript
new Fact(name);
```

- **`name`** (String): A unique identifier for the fact. 

#### Methods

- **`setFact(data)`**: Sets the fact’s data, which can be an object, a number, or a function.
- **`getFact()`**: Retrieves the fact data.
- **`static find(name)`**: Finds and returns a saved fact by name.

#### Restrictions & Checks
- **name**: Must be a string and unique within the system.

#### Example

```javascript
const fact = new Fact('monthly_spend');
fact.setFact({ spend: 1000 });
Fact.find('monthly_spend'); // { spend: 1000 }
```

### Condition Class

The `Condition` class represents a single logical condition that evaluates a fact. It specifies which fact to use, the operator, and the value to compare against.

#### Constructor

```javascript
new Condition();
```

#### Methods

- **`fact(name)`**: Specifies the fact to evaluate (must be a valid, existing fact).
- **`operator(op)`**: Specifies the operator (e.g., `greaterThan`).
- **`value(value)`**: Specifies the value to compare against.
- **`path(path)`**: Sets the data path (must be a string).

#### Restrictions & Checks
- **fact**: Throws an error if the fact name is not a string or does not exist.
- **operator**: Must be one of the allowed operators.

#### Example

```javascript
const condition = new Condition();
condition.fact('monthly_spend')
         .operator('greaterThan')
         .value(500);
```

### Conditions Class

The `Conditions` class groups multiple conditions, allowing complex criteria that require logical combinations of conditions (AND, OR, NOT).

#### Constructor

```javascript
new Conditions(name);
```

- **`name`** (String): A unique identifier for the set of conditions.

#### Methods

- **`all(conditionsArray)`**: Groups conditions with an AND operator.
- **`any(conditionsArray)`**: Groups conditions with an OR operator.
- **`not(condition)`**: Adds a condition that must not be met.

#### Restrictions & Checks
- **name**: Must be a unique string.

#### Example

```javascript
const conditions = new Conditions('promoEligibility');
conditions.all([{ fact: 'monthly_spend', operator: 'greaterThan', value: 500 }])
         .not({ fact: 'blacklisted', operator: 'equal', value: true });
```

### Rule Class

The `Rule` class defines the core logic of the Fig engine, specifying conditions, events, and actions.

#### Constructor

```javascript
new Rule(name);
```

#### Methods

- **`conditions(conditionsName)`**: Links a set of conditions to the rule.
- **`event(type, params)`**: Defines the event type and parameters.
- **`priority(level)`**: Sets the rule’s priority.
- **`onSuccess(handler)`**: Specifies a function to execute on success.
- **`onFaliure(handler)`**: Specifies a function to execute on failure.

#### Restrictions & Checks
- **conditions**: Must match a valid `Conditions` instance.
- **priority**: Must be a positive integer.
- **onSuccess** / **onFailure**: Must be functions.

#### Example

```javascript
const rule = new Rule('applyDiscount');
rule.conditions('promoEligibility')
     .event('applyDiscount', { discount: 10 })
     .priority(1);
```

### Action Class

The `Action` class performs operations on data based on provided parameters. 

#### Constructor

```javascript
new Action(data, params);
```

- **`data`** (Object): Data for the action to operate on.
- **`params`** (Object): Config for action type, value, and data path.

#### Methods

- **`multiply`, `divide`, `add`, `subtract`**: Performs basic arithmetic.
- **`numberOfDays`, `numberOfWeeks`, `numberOfMonths`, `numberOfYears`**: Date calculations.
- **`true`, `false`**: Sets boolean result.
- **`request`**: Executes an HTTP request.

#### Restrictions & Checks
- `data`: Must be an object.
- `params.action`: Must match an `Action` method name.

#### Example

```javascript
const action = new Action({ medianDailyValue: 200 }, { action: 'multiply', value: 0.3, dataPath: 'medianDailyValue' });
action.multiply().getResult; // Returns 60
```

### Name Class

The `Name` class manages named instances (facts, rules, conditions) and provides methods for saving and retrieving them.

#### Constructor

```javascript
new Name(name);
```

#### Methods

- **`setType(type)`**: Sets the type (e.g., fact, rule).
- **`setData(data)`**: Sets data for the named item.
- **`getData()`**: Retrieves data.
- **`static find(name)`**: Finds a named instance by name.

#### Restrictions & Checks
- `setType`: Must be a string.
- `setData`: Must be an object or function.

#### Example

```javascript
const name = new Name('discountRule');
name.setType = 'rule';
name.setData = { discount: 10 };
Name.save(name);
```

### RuleEngine Class

The `RuleEngine` class initializes all facts and rules and evaluates them.

#### Constructor

```javascript
new RuleEngine();
```

#### Methods

- **`run()`**: Executes all rules and returns results.

#### Example

```javascript
const ruleEngine = new RuleEngine();
ruleEngine.run().then(results => console.log(results));
```

---

## Allowed Operators

The following operators are supported within conditions:

1. **String and Number Operators**
   - `equal`, `notEqual`
2. **Number Operators**
   - `greaterThan`, `greaterThanInclusive`, `lessThan`, `lessThanInclusive`
3. **Array Operators**
   - `in`, `notIn`, `contains`, `doesNotContain`

These operators allow for a variety of comparisons to suit complex rule requirements.

---

## Example Use Cases

### Use Case 1: Apply Discount to High-Spending Customers

**Scenario**: A business wants to automatically apply a 10% discount to customers who spend more than $500 in a single transaction and are not on a blacklist.

1. **Facts**: 
   - `transaction_amount`
   - `is_blacklisted`
2. **Conditions**: 
   - `transaction_amount > 500`
   - `is_blacklisted != true`
3. **Rule**: 
   - If the conditions are met, apply a 10% discount.

### Use Case 2: Flag Suspicious Transactions

**Scenario**: A bank wants to flag any transaction over $1000 if it originates from a new device or location.

1. **

Facts**: 
   - `transaction_amount`
   - `device_id`
   - `location`
2. **Conditions**: 
   - `transaction_amount > 1000`
   - `device_id` or `location` is new.
3. **Rule**: 
   - Flag the transaction if both conditions are met.

---

## Implementation Steps

1. **Define Facts**: Identify key facts like `transaction_amount` and `customer_status`.
2. **Create Conditions**: Specify the rules for each fact using operators.
3. **Set Up Rules**: Combine conditions and link actions for each rule.
4. **Run Rule Engine**: Execute rules through `RuleEngine` to evaluate the conditions and apply results.
