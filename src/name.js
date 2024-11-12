'use strict';

export default class Name {

    static #names = {};

    constructor(name){
        if(typeof name !== 'string'){
            throw new Error('name must be a string.');
        }
        this.setName = name;
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

    set setType(type){
        if(typeof type !== 'string'){
            throw new Error('type must be a string.');
        }
        this.type = type;
    }

    get getType(){
        return this.type;
    }

    set setData(data){
        if(typeof data !== 'object' && typeof data !== 'function'){
            throw new Error('data must be an object or a function.');
        }

        this.data = data;
        
    }

    get getData(){
        return this.data;
    }

    static save(nameObj){
        let isName = nameObj instanceof Name;
        if(!isName){
            throw new Error('You can only save Name instances');
        }
        if(this.#names[nameObj.getName]){
            throw new Error('This name already exists');
        }

        this.#names[nameObj.getName] = nameObj;
        return this.#names;
        // update

    }

    static find(name){
        if(typeof name !== 'string'){
            throw new Error('Name must be a string');
        }

        if(!this.#names[name]){
            throw new Error('name not found');
        }

        return this.#names[name];
    }

    static findAll(){
        return this.#names;
    }

    static findByType() {
        return Object.entries(this.#names).reduce((acc, [key, value]) => {
            const type = value.type;
            const item = { ...value, name: key };

            if (!acc[type]) {
                acc[type] = [];
            }
            acc[type].push(item);

            return acc;
        }, {});
    }

    static update(name, obj){
        if(typeof name !== 'string'){
            throw new Error('Name must be a string');
        }

        if(typeof obj !== 'object'){
            throw new Error('Update parameter must be an object');
        }

        if(!this.#names[name]){
            throw new Error('name not found');
        }

        if(obj.type){
            this.#names[name].setType = obj.type;
        }

        if(obj.data){
            this.#names[name].setData = obj.data;
        }

        return this.#names[name];
    }

}
