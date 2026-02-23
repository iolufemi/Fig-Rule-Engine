'use strict';

import Name from './name.js';
import type { ConditionShape } from './types.js';

type ConditionsData = {
    all?: unknown[];
    any?: unknown[];
    not?: unknown[];
} & Record<string, unknown>;

export default class Conditions {
    declare name?: string;

    constructor(name: string) {
        if (typeof name !== 'string') {
            throw new Error('name must be a string.');
        }
        const _name = new Name(name);
        _name.setType = 'conditions';
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

    not(condition: unknown): this {
        const nameObj = Name.find(this.name!);
        if (!nameObj.getData) {
            nameObj.setData = {};
        }
        const prev = (nameObj.getData ?? {}) as ConditionsData;
        nameObj.setData = { ...prev, not: [condition] };
        return this;
    }

    all(_conditions: ConditionShape | ConditionShape[]): this {
        const _name = Name.find(this.name!);
        if (!_name.getData) {
            _name.setData = {};
        }
        const prev = _name.getData as ConditionsData;
        let _all = prev?.all ?? [];
        if (typeof _conditions === 'object' && Array.isArray(_conditions) && _conditions.length > 0) {
            _all = [..._all, ..._conditions];
        }
        if (typeof _conditions === 'object' && (!Array.isArray(_conditions) || _conditions.length === 0)) {
            _all.push(_conditions as ConditionShape);
        }
        _name.setData = { ...prev, all: _all };
        return this;
    }

    any(_conditions: ConditionShape | ConditionShape[]): this {
        const _name = Name.find(this.name!);
        if (!_name.getData) {
            _name.setData = {};
        }
        const prev = _name.getData as ConditionsData;
        let _any = prev?.any ?? [];
        if (typeof _conditions === 'object' && Array.isArray(_conditions) && _conditions.length > 0) {
            _any = [..._any, ..._conditions];
        }
        if (typeof _conditions === 'object' && (!Array.isArray(_conditions) || _conditions.length === 0)) {
            _any.push(_conditions as ConditionShape);
        }
        _name.setData = { ...prev, any: _any };
        return this;
    }

    get getData(): ConditionsData {
        return Name.find(this.name!).getData as ConditionsData;
    }
}
