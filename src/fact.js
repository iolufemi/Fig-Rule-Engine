'use strict';

import Name from './name.js';

export default class Fact {
    constructor(name){
        if(typeof name !== 'string'){
            throw new Error('name must be a string.');
        }

        let _name = new Name(name);
        _name.setType = 'fact';
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

    set setFact(fact){

        if(typeof fact === 'object'){
            Name.find(this.name).setData = fact;
        }else{
            Name.find(this.name).setData = function(params, almanac){
                return fact(params, almanac);
            };
        }
        
    }

    get getFact(){
        return Name.find(this.name).getData;
    }

    static find(name){
        if(typeof name !== 'string'){
            throw new Error('Name must be a string');
        }

        let fact = Name.find(name);
        if(fact.getType !== 'fact'){
            throw new Error('fact not found');
        }

        let theFact = fact.getData;
        if(!theFact){
            theFact = {};
        }

        return theFact;
    }

}
