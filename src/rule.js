'use strict';

import Name from './name.js';

export default class Rule {
    constructor(name){
        if(typeof name !== 'string'){
            throw new Error('name must be a string.');
        }

        let _name = new Name(name);
        _name.setType = 'rule';
        Name.save(_name);

        this.setName = _name.getName;
    }

    set setName(name){
        if(typeof name !== 'string'){
            throw new Error('name must be a string.');
        }
        if(!this.name){
            this.name = name;
        }else{
            throw new Error('name already set.');
        }
    }

    get getName(){
        return this.name;
    }

    conditions(_name){
        if(typeof _name !== 'string'){
            throw new Error('Name must be a string.');
        }

        let conditions = Name.find(_name);
        if(conditions.getType !== 'conditions'){
            throw new Error('conditions not found');
        }

        let _rule = Name.find(this.name);
        if(_rule.getType !== 'rule'){
            throw new Error('rule not found');
        }

        let ourConditions = conditions.getData;
        if(ourConditions){
            // remember to test that updating the conditions data from directly will also update the conditions in the Rules class. 
            // test of they are truely referencing each other.
            _rule.conditions = ourConditions;
        }
        return this;
    }

    event(type, params){
        if(typeof type !== 'string'){
            throw new Error('Type must be a string.');
        }

        if(params && typeof params !== 'object'){
            throw new Error('Params must be an object.');
        }

        let _rule = Name.find(this.name);
        if(_rule.getType !== 'rule'){
            throw new Error('rule not found');
        }

        let _event = {
            type: type,
            params: params
        };

        _rule.event = _event;

        return this;
    }

    priority(_priority){
        if(typeof _priority !== 'number'){
            throw new Error('_priority must be a string.');
        }

        if(_priority < 1 ){
            throw new Error('_priority must be a positive number.');
        }

        let _rule = Name.find(this.name);
        if(_rule.getType !== 'rule'){
            throw new Error('rule not found');
        }

        _rule.priority = _priority;

        return this;
    }

    onSuccess(_funct){
        if(typeof _funct !== 'function'){
            throw new Error('_funct must be a function.');
        }

        let _theFunct = function(_event, _almanac){
            return _funct(_event, _almanac);
        };

        let _rule = Name.find(this.name);
        if(_rule.getType !== 'rule'){
            throw new Error('rule not found');
        }

        _rule.onSuccess = _theFunct;
        return this;
    }

    onFailure(_funct){
        if(typeof _funct !== 'function'){
            throw new Error('_funct must be a function.');
        }

        let _theFunct = function(_event, _almanac){
            return _funct(_event, _almanac);
        };

        let _rule = Name.find(this.name);
        if(_rule.getType !== 'rule'){
            throw new Error('rule not found');
        }

        _rule.onFailure = _theFunct;
        return this;
    }

    static find(name){
        if(typeof name !== 'string'){
            throw new Error('Name must be a string');
        }

        let _rule = Name.find(name);
        if(_rule.getType !== 'rule'){
            throw new Error('rule not found');
        }

        return _rule;
    }

}
