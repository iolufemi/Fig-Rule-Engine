'use strict';

import Name from './name.js';
import {Engine, Rule, Fact} from 'json-rules-engine';
import _ from 'lodash'; 


export default class RuleEngine {
    artifacts = {};
    #engine;
    constructor(){
        this.#engine = new Engine([], _.get);

        let _artifacts = Name.findByType();
        let _thisEngine = this.#engine;
        let _this = this;

        // add Facts;
        _artifacts.fact.forEach(function(value){
            if(value.name && value.data){
                let _theData = value.data;
                let _theFact = new Fact(value.name, _theData);
                _thisEngine.addFact(_theFact);
                if(!_this.artifacts.facts){
                    _this.artifacts.facts = [];
                }
                let _ourFact = {};
                _ourFact[value.name] = _theData;
                _this.artifacts.facts.push(_ourFact);
            }
        });

        // add Rules;
        _artifacts.rule.forEach(function(value){
            if(value.name && value.conditions && value.event && value.priority && value.onSuccess && value.onFailure){
                let _theData = value;
                let _theRule = new Rule(_theData);
                _thisEngine.addRule(_theRule);
                if(!_this.artifacts.rules){
                    _this.artifacts.rules = [];
                }
                let _ourRule = {};
                _ourRule[value.name] = _theData;
                _this.artifacts.rules.push(_ourRule);
            }    
        });
    }

    // returns promise
    run(){
        return this.#engine.run();
    }
}
