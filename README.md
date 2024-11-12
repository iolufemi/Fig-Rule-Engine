[![Node.js CI](https://github.com/iolufemi/project780/actions/workflows/node.js.yml/badge.svg)](https://github.com/iolufemi/project780/actions/workflows/node.js.yml)

# Fig Rule Engine Documentation

## Overview

The **Fig Rule Engine** is a flexible and powerful tool for automating business decisions based on defined rules, conditions, and actions. This engine operates by evaluating data points (known as facts) against conditions to decide whether a rule’s actions should be executed. It is highly customizable and supports various types of conditions and actions, making it suitable for complex decision-making scenarios.

This documentation will guide both technical and non-technical users on how to configure and operate the Fig Rule Engine.

---

## Table of Contents

1. [Core Concepts](#core-concepts)
2. [Class Details](#class-details)
   - [Fact Class](#fact-class)
   - [Condition Class](#condition-class)
   - [Conditions Class](#conditions-class)
   - [Rule Class](#rule-class)
   - [Action Class](#action-class)
   - [Name Class](#name-class)
   - [RuleEngine Class](#ruleengine-class)
3. [Allowed Operators](#allowed-operators)
4. [Example Use Cases](#example-use-cases)

---

## Core Concepts

### Facts
**Facts** are the core data points that the Rule Engine evaluates. They can be simple values (e.g., customer status) or complex functions that calculate a result based on parameters. Facts are essential to the engine, as they provide the information that rules and conditions depend on.

- **Example**: A fact named `monthly_spend` that stores the total spending amount of a customer each month.

### Conditions
**Conditions** define the criteria that must be met for a rule to execute. They use facts along with operators (such as greater than or equal to) to check if specific requirements are fulfilled.

- **Example**: A condition might check if `monthly_spend` is greater than 500.

### Rules
**Rules** are sets of conditions linked to actions. If the conditions within a rule are satisfied, the rule's actions are executed.

- **Example**: A rule could apply a 10% discount if `monthly_spend` is above 500 and the customer is not blacklisted.

### Actions
**Actions** are operations performed on data, such as calculations, logical checks, or HTTP requests. They are executed when the conditions within a rule are met.

---

## Class Details

### Fact Class

The `Fact` class is responsible for managing individual data points. Facts can be static values or functions that dynamically return data. 

#### Constructor

```javascript
new Fact(name);
```

- **`name`** (String): A unique identifier for the fact.

#### Methods

- **`setFact(data)`**: Sets the fact’s data, which can be an object, a number, or a function.
- **`getFact()`**: Retrieves the fact data.
- **`static find(name)`**: Finds and returns a saved fact by name.

#### Example

```javascript
const fact = new Fact('monthly_spend');
fact.setFact({ spend: 1000 });
Fact.find('monthly_spend'); // { spend: 1000 }
```

---

### Condition Class

The `Condition` class represents a single logical condition that checks a fact against an operator and a value. Conditions are used to determine if a rule should execute.

#### Constructor

```javascript
new Condition();
```

#### Methods

- **`fact(name)`**: Sets the fact to evaluate (must be a valid, existing fact).
- **`operator(op)`**: Sets the operator (e.g., `greaterThan`).
- **`value(value)`**: Sets the value to compare against.
- **`path(path)`**: (Optional) Specifies the path within the fact’s data.

#### Example

```javascript
const condition = new Condition();
condition.fact('monthly_spend')
         .operator('greaterThan')
         .value(500);
```

---

### Conditions Class

The `Conditions` class groups multiple conditions into logical combinations (AND, OR, NOT) for more complex rule criteria.

#### Constructor

```javascript
new Conditions(name);
```

- **`name`** (String): A unique name for the condition set.

#### Methods

- **`all(conditionsArray)`**: Combines conditions with an AND logic.
- **`any(conditionsArray)`**: Combines conditions with an OR logic.
- **`not(condition)`**: Adds a condition that must not be met.

#### Example

```javascript
const conditions = new Conditions('promoEligibility');
conditions.all([{ fact: 'monthly_spend', operator: 'greaterThan', value: 500 }])
         .not({ fact: 'blacklisted', operator: 'equal', value: true });
```

---

### Rule Class

The `Rule` class defines the core business logic by linking conditions, events, and actions.

#### Constructor

```javascript
new Rule(name);
```

#### Methods

- **`conditions(conditionsName)`**: Sets the conditions required for the rule.
- **`event(type, params)`**: Defines the event type and parameters.
- **`priority(level)`**: Sets the priority level (higher priority rules execute first).
- **`onSuccess(handler)`**: Specifies a function to execute when the rule is successful.
- **`onFailure(handler)`**: Specifies a function to execute when the rule fails.

#### Example

```javascript
const rule = new Rule('applyDiscount');
rule.conditions('promoEligibility')
     .event('applyDiscount', { discount: 10 })
     .priority(1);
```

---

### Action Class

The `Action` class performs operations on data. It supports arithmetic calculations, logical checks, and HTTP requests. 

#### Constructor

```javascript
new Action(data, params);
```

- **`data`** (Object): The dataset for action processing.
- **`params`** (Object): Config specifying the action type, value, and data path.
  - **`action`**: String representing the action (must match a method name).
  - **`value`**: Operand for the action.
  - **`dataPath`**: Path within `data` to access the targeted data.

#### Methods

The following methods perform specific actions:

1. **`multiply(firstNumber, secondNumber)`**: Multiplies two numbers and stores the result.
2. **`divide(firstNumber, secondNumber)`**: Divides `firstNumber` by `secondNumber`.
3. **`add(firstNumber, secondNumber)`**: Adds two numbers.
4. **`subtract(firstNumber, secondNumber)`**: Subtracts `secondNumber` from `firstNumber`.
5. **`true()`**: Sets the result to `true`.
6. **`false()`**: Sets the result to `false`.
7. **`numberOfDays(then, now)`**: Calculates the number of days between two dates.
8. **`numberOfWeeks(then, now)`**: Calculates the number of weeks between two dates.
9. **`numberOfMonths(then, now)`**: Calculates the number of months between two dates.
10. **`numberOfYears(then, now)`**: Calculates the number of years between two dates.
11. **`request(name, overrideData)`**: Executes an HTTP request and stores the response.

#### Example

```javascript
const action = new Action({ medianDailyValue: 200 }, { action: 'multiply', value: 0.3, dataPath: 'medianDailyValue' });
action.multiply().getResult; // 60
```

---

### Name Class

The `Name` class manages named instances like facts, rules, and conditions. It provides methods for saving and retrieving them.

#### Constructor

```javascript
new Name(name);
```

#### Methods

- **`setType(type)`**: Sets the type (e.g., `fact`, `rule`).
- **`setData(data)`**: Sets data for the named instance.
- **`getData()`**: Retrieves data.
- **`static find(name)`**: Finds a saved instance by name.

#### Example

```javascript
const name = new Name('discountRule');
name.setType = 'rule';
name.setData = { discount: 10 };
Name.save(name);
```

---

### RuleEngine Class

The `RuleEngine` class is the main component that loads and executes rules and facts.

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

The following operators are supported:

1. **String and Number Operators**
   - `equal`, `notEqual`
2. **Number Operators**
   - `greaterThan`, `greaterThanInclusive`, `lessThan`, `lessThanInclusive`
3. **Array Operators**
   - `in`, `notIn`, `contains`, `doesNotContain`

---

## Example Use Cases

### Use Case 1: Apply Discount to High-Spending Customers

**Scenario**: A business wants to apply a 10% discount to customers who spend over $500 in a single transaction and are not blacklisted.

1. **Facts**: 
   - `transaction_amount`
   - `is_blacklisted`
2. **Conditions**: 
   - `transaction_amount > 500`
   - `is_blacklisted != true`
3. **Rule**: 
   - If conditions are met, apply a 10% discount.

### Use Case 2: Flag Suspicious Transactions

**Scenario**: A bank wants to flag transactions over $1000 if they originate from a new device or location.

1. **Facts**: 
   - `transaction_amount`
   - `device_id`
   - `location`
2. **Conditions**: 
   - `transaction_amount > 1000`
   - `device_id` or `location` is new.
3. **Rule**: 
   - Flag the transaction if both conditions are met.
