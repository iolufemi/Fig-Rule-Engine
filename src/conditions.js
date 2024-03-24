'use strict';

class Conditions {
    constructor(condition){
        if(condition && typeof condition !== 'object'){
            throw new Error('a condition must be an object');
        }

        if(!condition){
            this.condition = {};
        }else{
            this.condition = condition;
        }

        
    }

    get getCondition(){
        return this.condition;
    }

    set setCondition(condition){
        if(typeof condition !== 'object'){
            throw new Error('a condition must be an object');
        }
        this.condition = condition;
    }


}

module.exports.Conditions = Conditions;
