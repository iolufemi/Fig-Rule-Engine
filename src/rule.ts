'use strict';

import Name from './name.js';

type RuleEvent = { type: string; params?: Record<string, unknown> };
type RuleHandler = (event: unknown, almanac: unknown) => void | unknown;

export default class Rule {
    declare name?: string;

    constructor(name: string) {
        if (typeof name !== 'string') {
            throw new Error('name must be a string.');
        }
        const _name = new Name(name);
        _name.setType = 'rule';
        Name.save(_name);
        this.setName = _name.getName;
    }

    set setName(name: string) {
        if (typeof name !== 'string') {
            throw new Error('name must be a string.');
        }
        if (!this.name) {
            this.name = name;
        } else {
            throw new Error('name already set.');
        }
    }

    get getName(): string {
        return this.name!;
    }

    conditions(_name: string): this {
        if (typeof _name !== 'string') {
            throw new Error('Name must be a string.');
        }
        const conditions = Name.find(_name);
        if (conditions.getType !== 'conditions') {
            throw new Error('conditions not found');
        }
        const _rule = Name.find(this.name!) as Name & { conditions?: unknown };
        if (_rule.getType !== 'rule') {
            throw new Error('rule not found');
        }
        const ourConditions = conditions.getData;
        if (ourConditions) {
            _rule.conditions = ourConditions;
        }
        return this;
    }

    event(type: string, params?: Record<string, unknown>): this {
        if (typeof type !== 'string') {
            throw new Error('Type must be a string.');
        }
        if (params !== undefined && params !== null && typeof params !== 'object') {
            throw new Error('Params must be an object.');
        }
        const _rule = Name.find(this.name!) as Name & { event?: RuleEvent };
        if (_rule.getType !== 'rule') {
            throw new Error('rule not found');
        }
        _rule.event = { type, params };
        return this;
    }

    priority(_priority: number): this {
        if (typeof _priority !== 'number') {
            throw new Error('_priority must be a string.');
        }
        if (_priority < 1) {
            throw new Error('_priority must be a positive number.');
        }
        const _rule = Name.find(this.name!) as Name & { priority?: number };
        if (_rule.getType !== 'rule') {
            throw new Error('rule not found');
        }
        _rule.priority = _priority;
        return this;
    }

    onSuccess(_funct: RuleHandler): this {
        if (typeof _funct !== 'function') {
            throw new Error('_funct must be a function.');
        }
        const _theFunct = function (_event: unknown, _almanac: unknown): void | unknown {
            return _funct(_event, _almanac);
        };
        const _rule = Name.find(this.name!) as Name & { onSuccess?: RuleHandler };
        if (_rule.getType !== 'rule') {
            throw new Error('rule not found');
        }
        _rule.onSuccess = _theFunct;
        return this;
    }

    onFailure(_funct: RuleHandler): this {
        if (typeof _funct !== 'function') {
            throw new Error('_funct must be a function.');
        }
        const _theFunct = function (_event: unknown, _almanac: unknown): void | unknown {
            return _funct(_event, _almanac);
        };
        const _rule = Name.find(this.name!) as Name & { onFailure?: RuleHandler };
        if (_rule.getType !== 'rule') {
            throw new Error('rule not found');
        }
        _rule.onFailure = _theFunct;
        return this;
    }

    static find(name: string): Name {
        if (typeof name !== 'string') {
            throw new Error('Name must be a string');
        }
        const _rule = Name.find(name);
        if (_rule.getType !== 'rule') {
            throw new Error('rule not found');
        }
        return _rule;
    }
}
