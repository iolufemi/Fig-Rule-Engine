'use strict';

import Fact from './fact.js';
import type { ConditionShape } from './types.js';

const DEFAULT_OP_LIST = [
    'equal',
    'notEqual',
    'lessThan',
    'lessThanInclusive',
    'greaterThan',
    'greaterThanInclusive',
    'in',
    'notIn',
    'contains',
    'doesNotContain'
];

export default class Condition {
    #condition: ConditionShape = {};
    #opList: string[] = [...DEFAULT_OP_LIST];

    constructor(overrideCondition?: ConditionShape) {
        if (overrideCondition) {
            if (this.#opList.indexOf(overrideCondition.operator ?? '') < 0) {
                throw new Error('Invalid Operator');
            }
            this.#condition = { ...overrideCondition };
        }
    }

    path(path: string): this {
        if (typeof path !== 'string') {
            throw new Error('a path must be a string');
        }
        this.#condition.path = path;
        return this;
    }

    fact(fact: string): this {
        if (typeof fact !== 'string') {
            throw new Error('a fact must be a string');
        }
        try {
            const _theFact = Fact.find(fact);
            if (_theFact) {
                this.#condition.fact = fact;
            } else {
                throw new Error('invalid fact');
            }
        } catch {
            throw new Error('invalid fact');
        }
        return this;
    }

    params(params: Record<string, unknown>): this {
        if (typeof params !== 'object') {
            throw new Error('a params must be an object');
        }
        this.#condition.params = params;
        return this;
    }

    value(value: unknown): this {
        if (!value) {
            throw new Error('please pass a value');
        }
        this.#condition.value = value;
        return this;
    }

    operator(op: string): this {
        if (typeof op !== 'string') {
            throw new Error('a op must be a string');
        }
        if (this.#opList.indexOf(op) < 0) {
            throw new Error('Invalid Operator');
        }
        this.#condition.operator = op;
        return this;
    }

    get getCondition(): ConditionShape {
        return this.#condition;
    }

    addOperator(op: string): this {
        if (typeof op !== 'string') {
            throw new Error('a op must be a string');
        }
        this.#opList.push(op);
        return this;
    }
}
