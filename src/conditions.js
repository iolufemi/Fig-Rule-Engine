'use strict';

import Name from './name.js';

export default class Conditions{
    constructor(name){
        if(typeof name !== 'string'){
            throw new Error('name must be a string.');
        }

        let _name = new Name(name);
        _name.setType = 'conditions';
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

    not(condition){
        if(!Name.find(this.name).getData){
            Name.find(this.name).setData = {};
        }

        Name.find(this.name).setData = {...Name.find(this.name).getData, not:[condition]};
        return this;
    }

    all(_conditions){
        let _name = Name.find(this.name);
        if(!_name.getData){
            _name.setData = {};
        }
        let _all;
        if(_name.getData.all){
            _all = _name.getData.all;
        }else{
            _all = [];
        }
        if(typeof _conditions === 'object' && _conditions.length > 0){
            _all = [..._all, ..._conditions];
        }

        if(typeof _conditions === 'object' && !_conditions.length){
            _all.push(_conditions);
        }

        let _prevData = _name.getData;
        let _newData = {..._prevData, all: _all};
        
        _name.setData = _newData;
        
        return this;
    }

    any(_conditions){
        let _name = Name.find(this.name);
        if(!_name.getData){
            _name.setData = {};
        }
        let _any;
        if(_name.getData.any){
            _any = _name.getData.any;
        }else{
            _any = [];
        }
        if(typeof _conditions === 'object' && _conditions.length > 0){
            _any = [..._any, ..._conditions];
        }

        if(typeof _conditions === 'object' && !_conditions.length){
            _any.push(_conditions);
        }

        let _prevData = _name.getData;
        let _newData = {..._prevData, any: _any};
        
        _name.setData = _newData;
        
        return this;
    }

    get getData(){
        let _name = Name.find(this.name);
        return _name.getData;
    }

}
