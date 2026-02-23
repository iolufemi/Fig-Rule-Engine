'use strict';

import Name from './name.js';
import type { FactData } from './types.js';

export default class Fact {
    declare name?: string;

    constructor(name: string) {
        if (typeof name !== 'string') {
            throw new Error('name must be a string.');
        }
        const _name = new Name(name);
        _name.setType = 'fact';
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

    set setFact(fact: FactData) {
        if (typeof fact === 'object') {
            Name.find(this.name!).setData = fact;
        } else {
            Name.find(this.name!).setData = function (params: unknown, almanac: unknown): unknown {
                return (fact as (params: unknown, almanac: unknown) => unknown)(params, almanac);
            };
        }
    }

    get getFact(): FactData {
        const data = Name.find(this.name!).getData;
        return (data as FactData) ?? {};
    }

    static find(name: string): FactData {
        if (typeof name !== 'string') {
            throw new Error('Name must be a string');
        }
        const fact = Name.find(name);
        if (fact.getType !== 'fact') {
            throw new Error('fact not found');
        }
        const theFact = fact.getData;
        return (theFact as FactData) ?? {};
    }
}
