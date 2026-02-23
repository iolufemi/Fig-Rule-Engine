'use strict';

import Name from './name.js';
import { Engine, Rule, Fact } from 'json-rules-engine';
import _ from 'lodash';

type ArtifactFact = { name: string; data?: unknown };
type ArtifactRule = {
    name: string;
    conditions?: unknown;
    event?: unknown;
    priority?: number;
    onSuccess?: (event: unknown, almanac: unknown) => void;
    onFailure?: (event: unknown, almanac: unknown) => void;
};

export default class RuleEngine {
    artifacts: { facts?: Array<Record<string, unknown>>; rules?: Array<Record<string, unknown>> } = {};
    #engine: Engine;

    constructor() {
        this.#engine = new Engine([], { pathResolver: _.get as (value: object, path: string) => unknown });
        const _artifacts = Name.findByType();
        const _thisEngine = this.#engine;

        const factList = _artifacts.fact ?? [];
        for (const value of factList as ArtifactFact[]) {
            if (value.name && value.data !== undefined) {
                const _theData = value.data;
                const _theFact = new Fact(value.name, _theData);
                _thisEngine.addFact(_theFact);
                if (!this.artifacts.facts) {
                    this.artifacts.facts = [];
                }
                this.artifacts.facts.push({ [value.name]: _theData });
            }
        }

        const ruleList = _artifacts.rule ?? [];
        for (const value of ruleList as ArtifactRule[]) {
            if (
                value.name &&
                value.conditions !== undefined &&
                value.event !== undefined &&
                value.priority !== undefined &&
                value.onSuccess !== undefined &&
                value.onFailure !== undefined
            ) {
                const _theRule = new Rule(value as import('json-rules-engine').RuleProperties);
                _thisEngine.addRule(_theRule);
                if (!this.artifacts.rules) {
                    this.artifacts.rules = [];
                }
                this.artifacts.rules.push({ [value.name]: value });
            }
        }
    }

    run(): ReturnType<Engine['run']> {
        return this.#engine.run();
    }
}
