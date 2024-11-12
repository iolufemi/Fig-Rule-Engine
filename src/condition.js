'use strict';

import Fact from './fact.js';

export default class Condition {

    #condition = {};
    #opList = [ //move this to it's own class
        // for strings and numbers
        'equal',
        'notEqual',

        // for numbers
        'lessThan',
        'lessThanInclusive',
        'greaterThan',
        'greaterThanInclusive',

        // for arrays
        'in',
        'notIn',
        'contains',
        'doesNotContain'];

    constructor(overrideCondition){
        if(overrideCondition){
            if(this.#opList.indexOf(overrideCondition.operator) < 0){
                throw new Error('Invalid Operator');
            }
            this.#condition = overrideCondition;
        }
        // {
        // fact: 'product-price',
        // path: '$.price',
        // params: {
        //   productId: 'widget'
        // },
        // operator: 'greaterThan',
        // value: 100
        // }

        // {
        //  fact: 'product-price',
        // params: {
        //   productId: 'widget',
        //   path: '$.price'
        // },
        // operator: 'greaterThan',
        // // "value" contains a fact
        // value: {
        //   fact: 'budget' // "params" and "path" helpers are available as well
        // }

        
    }

    path(path){
        if(typeof path !== 'string'){
            throw new Error('a path must be a string');
        }
        this.#condition.path = path;
        return this;
    }

    fact(fact){
        if(typeof fact !== 'string'){
            throw new Error('a fact must be a string');
        }

        let _theFact;

        try{
            _theFact = Fact.find(fact);
        }catch(e){
            throw new Error('invalid fact2');
        }
        

        if(_theFact){
            this.#condition.fact = fact;
        }else{
            throw new Error('invalid fact');
        }

        return this;
    }

    params(params){
        if(typeof params !== 'object'){
            throw new Error('a params must be an object');
        }

        this.#condition.params = params;

        return this;
    }

    value(value){
        if(!value){
            throw new Error('please pass a value');
        }

        this.#condition.value = value;

        return this;
    }

    operator(op){
        if(typeof op !== 'string'){
            throw new Error('a op must be a string');
        }
        // let opList = 

        if(this.#opList.indexOf(op) < 0){
            throw new Error('Invalid Operator');
        }

        this.#condition.operator = op;

        return this;
    }

    get getCondition(){
        return this.#condition;
    }

    addOperator(op){
        if(typeof op !== 'string'){
            throw new Error('a op must be a string');
        }
        this.#opList.push(op);
        return this;
    }

}
