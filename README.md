[![Node.js CI](https://github.com/iolufemi/project780/actions/workflows/node.js.yml/badge.svg)](https://github.com/iolufemi/project780/actions/workflows/node.js.yml) [![codecov](https://codecov.io/gh/iolufemi/project780/graph/badge.svg?token=OkUkkAi7Er)](https://codecov.io/gh/iolufemi/project780)

# Fig Rule Engine Documentation

## Overview

The **Fig Rule Engine** is a flexible tool designed to automate decision-making in business processes. It allows organizations to define custom rules, conditions, and actions that are evaluated against data points called "facts." This engine is particularly useful for customer management, fraud detection, loyalty programs, and personalized marketing.

The Fig Rule Engine is modular, making it adaptable for various business cases. This documentation will guide both technical and non-technical users on configuring, implementing, and using the Fig Rule Engine for their needs.

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
**Facts** are individual pieces of data that the Rule Engine uses to evaluate rules. A fact can represent a simple value (like a number or a string) or a more complex structure (such as an object with nested properties). Facts are the building blocks of the Fig Rule Engine since all conditions and rules depend on the data they provide.

- **Example**: A fact called `transaction` with data `{ amount: 500 }` could be used to determine if a transaction qualifies for a discount.

### Conditions
**Conditions** define the criteria that must be met for a rule to activate. Each condition is a logical check that uses facts and operators to evaluate whether specific business requirements are satisfied.

- **Example**: A condition might check if `transaction.amount` is greater than 1000.

### Rules
**Rules** are a collection of conditions linked to specific actions. When all conditions within a rule are met, the rule’s actions are executed. Rules define your business logic, such as offering discounts, flagging suspicious activity, or assigning customer rewards.

- **Example**: A rule could state: "If `transaction.amount > 500` and `customer_status = gold`, then apply a 10% discount."

### Actions
**Actions** are the operations that occur when a rule is triggered. Actions might involve calculations, checking values, or even making HTTP requests to external systems. These allow the Fig Rule Engine to perform meaningful tasks based on the outcome of rule evaluations.

---

## Class Details

### Fact Class

The `Fact` class stores and manages individual data points. Facts can be simple values, such as a number or string, or functions that dynamically generate data.

#### Constructor

```javascript
new Fact(name);
```

- **`name`** (String): A unique identifier for the fact.

#### Methods

- **`setFact(data)`**: Sets the data for the fact. Data can be a simple value (e.g., `{ amount: 500 }`) or a more complex object.
- **`getFact()`**: Retrieves the data stored in the fact.
- **`static find(name)`**: Finds and returns a saved fact by its name. Useful for retrieving facts across different parts of your system.

#### Example

```javascript
const fact = new Fact('transaction');
fact.setFact = { amount: 1500 };
const retrievedFact = Fact.find('transaction');
console.log(retrievedFact.getFact); // Output: { amount: 1500 }
```

---

### Condition Class

The `Condition` class represents a single logical check. Each condition evaluates a fact against an operator and a target value, using an optional path to specify where to look within the fact’s data.

#### Constructor

```javascript
new Condition();
```

#### Methods

- **`fact(name)`**: Specifies the fact to evaluate. The fact must already be defined and saved.
- **`operator(op)`**: Sets the operator for the condition (e.g., `greaterThan`, `equal`).
- **`value(value)`**: Sets the target value that the fact’s data is compared against.
- **`path(path)`**: Specifies the data path within the fact (e.g., `amount`). Useful when dealing with nested objects.

#### Example

```javascript
// Assume 'transaction' is a fact with data { amount: 1200 }
const fact = new Fact('transaction');
fact.setFact = { amount: 1200 };

// Create a condition to check if 'transaction.amount' is greater than 1000
const condition = new Condition();
condition.fact('transaction')
         .operator('greaterThan')
         .value(1000)
         .path('amount');

console.log(condition.getCondition); 
// Output: { fact: 'transaction', operator: 'greaterThan', value: 1000, path: 'amount' }
```

---

### Conditions Class

The `Conditions` class is a container for multiple conditions. It allows you to define complex rules with multiple conditions combined using logical operators (AND, OR, NOT). This enables sophisticated rule configurations based on your business needs.

#### Constructor

```javascript
new Conditions(name);
```

- **`name`** (String): A unique identifier for the condition group.

#### Methods

- **`all(conditionsArray)`**: Combines conditions with an AND logic (all conditions must be true).
- **`any(conditionsArray)`**: Combines conditions with OR logic (at least one condition must be true).
- **`not(condition)`**: Adds a condition that must NOT be true.

#### Example

```javascript
const conditions = new Conditions('purchaseConditions');

// Define individual conditions
const condition1 = new Condition();
condition1.fact('transaction').operator('greaterThan').value(1000).path('amount');

const condition2 = new Condition();
condition2.fact('customer_status').operator('equal').value('gold');

// Combine conditions with AND logic
conditions.all([condition1.getCondition, condition2.getCondition]);

console.log(conditions.getData); 
// Output: { all: [condition1, condition2] }
```

---

### Rule Class

The `Rule` class defines a business rule by linking a set of conditions with a priority level and actions that execute when the rule’s conditions are met. Rules are the foundation of decision-making logic in the Fig Rule Engine.

#### Constructor

```javascript
new Rule(name);
```

#### Methods

- **`conditions(conditionsName)`**: Sets the conditions required for the rule to activate. Conditions must already be defined.
- **`event(type, params)`**: Defines an event with a type and optional parameters that specify what actions should occur when the rule triggers.
- **`priority(level)`**: Sets the priority level. Higher-priority rules execute first.
- **`onSuccess(handler)`**: A function that runs when conditions are met.
- **`onFailure(handler)`**: A function that runs when conditions are not met.

#### Example

```javascript
const rule = new Rule('highValuePurchase');

// Link conditions
rule.conditions('purchaseConditions');

// Define an event triggered if rule conditions are met
rule.event('applyDiscount', { discount: 10 });

// Set priority level and success action
rule.priority(1);
rule.onSuccess(() => console.log('Discount applied successfully'));

console.log(Name.find('highValuePurchase').getData); 
// Output: { discount: 10, conditions: {...}, priority: 1 }
```

---

### Action Class

The `Action` class performs specific operations on data, such as calculations, logical checks, and HTTP requests. Actions can be set to trigger once a rule’s conditions are met.

#### Constructor

```javascript
new Action(data, params);
```

- **`data`** (Object): The dataset on which the action operates.
- **`params`** (Object): Configuration that specifies the `action`, `value`, and `dataPath`.

  - **`action`**: A string representing the action to perform (e.g., `multiply`).
  - **`value`**: The operand for the action (e.g., the multiplier in a `multiply` action).
  - **`dataPath`**: The data path within `data` that locates the target value.

#### Methods

Here are descriptions and examples for each method:

1. **`multiply(firstNumber, secondNumber)`**: Multiplies two numbers and stores the result.
   ```javascript
   const action = new Action({ transaction: { amount: 500 } }, { action: 'multiply', value: 0.3, dataPath: 'transaction.amount' });
   action.multiply(500, 0.3);
   console.log(action.getResult); // 150
   ```

2. **`divide(firstNumber, secondNumber)`**: Divides two numbers and stores the result.
   ```javascript
   action.divide(500, 2);
   console.log(action.getResult); // 250
   ```

3. **`add(firstNumber, secondNumber)`**: Adds two numbers and stores the result.
   ```javascript
   action.add(400, 100);
   console.log(action.getResult); // 500
   ```

4. **`subtract(firstNumber, secondNumber)`**: Subtracts `secondNumber` from `firstNumber` and stores the result.
   ```javascript
   action.subtract(400, 100);
   console.log(action.getResult); // 300


   ```

5. **`numberOfDays(then, now)`**: Calculates the number of days between two dates.
   ```javascript
   action.numberOfDays('2023-01-01', '2023-01-10');
   console.log(action.getResult); // 9
   ```

6. **`request(name, overrideData)`**: Executes an HTTP request and stores the response.
   ```javascript
   action.setUrl = 'https://api.example.com/data';
   action.setMethod = 'GET';
   action.request('testRequest', { overrideKey: 'overrideValue' }).then(() => {
       console.log(action.getResult); // Displays the response data
   });
   ```

---

### RuleEngine Class

The `RuleEngine` class is responsible for initializing all facts, conditions, and rules, and then evaluating them. It is the main interface for executing rules and performing the required actions.

#### Constructor

```javascript
new RuleEngine();
```

#### Methods

- **`run()`**: Executes all rules and returns a promise with the results. Each rule’s conditions are checked, and if met, the specified actions are triggered.

#### Example

```javascript
const ruleEngine = new RuleEngine();
ruleEngine.run().then(results => console.log(results));
```

---

## Allowed Operators

The Fig Rule Engine supports various operators that can be applied in conditions to compare values:

1. **String and Number Operators**
   - `equal`
   - `notEqual`
2. **Number Operators**
   - `greaterThan`
   - `greaterThanInclusive`
   - `lessThan`
   - `lessThanInclusive`
3. **Array Operators**
   - `in`
   - `notIn`
   - `contains`
   - `doesNotContain`

These operators enable various types of comparisons, providing flexibility in creating complex rule conditions.

---

## Example Use Case

### Use Case: Apply Discount for High-Spending Customers

**Scenario**: Apply a 10% discount for customers who spend more than $500 and have a "gold" membership status. This example includes `onSuccess` and `onFailure` handlers to demonstrate different outcomes.

#### Step-by-Step Implementation:

1. **Define Facts**:
   ```javascript
   const transactionFact = new Fact('transaction');
   transactionFact.setFact = { amount: 600 };

   const customerStatusFact = new Fact('customer_status');
   customerStatusFact.setFact = { status: 'gold' };
   ```

2. **Define Conditions**:
   ```javascript
   const condition1 = new Condition();
   condition1.fact('transaction').operator('greaterThan').value(500).path('amount');

   const condition2 = new Condition();
   condition2.fact('customer_status').operator('equal').value('gold').path('status');
   ```

3. **Set Conditions in Conditions Class**:
   ```javascript
   const conditions = new Conditions('promoEligibility');
   conditions.all([condition1.getCondition, condition2.getCondition]);
   ```

4. **Create Rule with Event, Priority, onSuccess, and onFailure Handlers**:
   ```javascript
   const rule = new Rule('applyDiscount');
   
   rule.conditions('promoEligibility')
        .event('discount', { discount: 10 })
        .priority(1)
        .onSuccess(() => console.log('Discount applied successfully'))
        .onFailure(() => console.log('Discount could not be applied'));
   ```

5. **Execute Rule Engine**:
   ```javascript
   const ruleEngine = new RuleEngine();
   ruleEngine.run().then(results => console.log(results));
   // Output: 'Discount applied successfully' (if conditions are met)
   // Output: 'Discount could not be applied' (if conditions are not met)
   ```
