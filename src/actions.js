'use strict';

import _ from 'lodash';
import moment from 'moment';
import axios from 'axios';

export default class Actions {

    constructor(data, params){
        if(!moment){
            throw new Error('momemt not found. Please import moment.');
        }

        if(!_){
            throw new Error('lodash not found. Please import lodash.');
        }

        if(typeof data !== 'object'){
            throw new Error('data must be an object');
        }

        if(typeof params !== 'object'){
            throw new Error('params must be an object');
        }

        if(!params.action || typeof params.action !== 'string'){
            throw new Error('param must have an action attribute of type string');
        }

        if(!params.value){
            throw new Error('param must have a value attribute');
        }

        if(!params.dataPath || typeof params.dataPath !== 'string'){
            throw new Error('param must have a dataPath attribute of type string');
        }

        if(!_.get(data, params.dataPath)){
            throw new Error('invalid data path');
        }

        if(typeof this[params.action] !== 'function'){
            throw new Error('invalid action');
        }

        this.firstNumber = 0;
        this.secondNumber = 0;
        this.now = moment();
        this.then = moment();
        this.result = null;
        this.params = params;
        this.data = data;
        this.headers = {};
        this.method = false;
        this.url = false;
    }

    set setFirstNumber (number){
        if(typeof number !== 'number'){
            throw new Error('number must be of type number.');
        }
        this.firstNumber = number * 1;
    }

    get getFirstNumber (){
        return this.firstNumber;
    }

    set setSecondNumber (number){
        if(typeof number !== 'number'){
            throw new Error('number must be of type number.');
        }
        this.secondNumber = number * 1;
    }

    get getSecondNumber (){
        return this.secondNumber;
    }

    set setNow (date){
        if(!date){
            throw new Error('Please pass a date');
        }
        this.now = moment(date);
    }

    get getNow (){
        return this.now;
    }

    set setThen (date){
        if(!date){
            throw new Error('Please pass a date');
        }
        this.then = moment(date);
    }

    get getThen (){
        return this.then;
    }

    set setResult (result){
        if(typeof result !== 'boolean' && !result){
            throw new Error('Please pass a result');
        }
        this.result = result;
    }

    get getResult (){
        return this.result;
    }

    set setParams (params){
        if(typeof params !== 'object'){
            throw new Error('params must be an object');
        }

        if(!params.action || typeof params.action !== 'string'){
            throw new Error('param must have an action attribute of type string');
        }

        if(!params.value){
            throw new Error('param must have a value attribute');
        }

        if(!params.dataPath || typeof params.dataPath !== 'string'){
            throw new Error('param must have a dataPath attribute of type string');
        }

        if(typeof this[params.action] !== 'function'){
            throw new Error('invalid action');
        }

        if(!_.get(this.getData, params.dataPath)){
            throw new Error('invalid data path');
        }

        this.params = params;
    }

    get getParams (){
        return this.params;
    }

    set setData (data){
        if(typeof data !== 'object'){
            throw new Error('data must be an object');
        }

        this.data = _.extend(this.data, data);
    }

    get getData (){
        return this.data;
    }

    set setHeaders(headers){
        if(typeof headers !== 'object'){
            throw new Error('headers must be an object');
        }
        this.headers = headers;
    }

    get getHeaders(){
        return this.headers;
    }

    set setMethod(method){
        if(typeof method !== 'string'){
            throw new Error('method must be a sting');
        }
        this.method = method;
    }

    get getMethod(){
        return this.method;
    }

    set setUrl(url){
        if(typeof url !== 'string'){
            throw new Error('url must be a sting');
        }
        this.url = url;
    }

    get getUrl(){
        return this.url;
    }

    getDataItem (item){
        if(typeof item !== 'string'){
            throw new Error('parameter must be a string.');
        }
        return _.get(this.data, item);
    }

    multiply (firstNumber, secondNumber){
        if(firstNumber){
            this.setFirstNumber = firstNumber;
        }
        if(secondNumber){
            this.setSecondNumber = secondNumber;
        }
        this.setResult = this.firstNumber * this.secondNumber;
        return this;
    }

    divide (firstNumber, secondNumber){
        if(firstNumber){
            this.setFirstNumber = firstNumber;
        }
        if(secondNumber){
            this.setSecondNumber = secondNumber;
        }
        this.setResult = this.firstNumber / this.secondNumber;
        return this;
    }

    add (firstNumber, secondNumber){
        if(firstNumber){
            this.setFirstNumber = firstNumber;
        }
        if(secondNumber){
            this.setSecondNumber = secondNumber;
        }
        this.setResult = this.firstNumber + this.secondNumber;
        return this;
    }

    substract (firstNumber, secondNumber){
        if(firstNumber){
            this.setFirstNumber = firstNumber;
        }
        if(secondNumber){
            this.setSecondNumber = secondNumber;
        }
        this.setResult = this.firstNumber - this.secondNumber;
        return this;
    }

    true (){
        this.setResult = true;
        return this;
    }

    false (){
        this.setResult = false;
        return this;
    }

    numberOfDays (then, now){
        if(then){
            this.setThen = then;
        }
        if(now){
            this.setNow = now;
        }
        this.setResult = Math.abs(this.now.diff(this.then, 'days'));
        return this;
    }

    numberOfWeeks (then, now){
        if(then){
            this.setThen = then;
        }
        if(now){
            this.setNow = now;
        }
        this.setResult = Math.abs(this.now.diff(this.then, 'weeks'));
        return this;
    }

    numberOfMonths (then, now){
        if(then){
            this.setThen = then;
        }
        if(now){
            this.setNow = now;
        }
        this.setResult = Math.abs(this.now.diff(this.then, 'months'));
        return this;
    }

    numberOfYears (then, now){
        if(then){
            this.setThen = then;
        }
        if(now){
            this.setNow = now;
        }
        this.setResult = Math.abs(this.now.diff(this.then, 'years'));
        return this;
    }

    async request (name){
        if(typeof name !== 'string'){
            throw new Error('name must be a string');
        }
        let config = {
            url: this.getUrl,
            method: this.getMethod,
            headers: this.getHeaders
        };
        let _data = {...this.getData};
        delete _data.requestData;

        if(this.getMethod.toLowerCase() === 'get'){
            config.params = _data;
        }else if(this.getMethod.toLowerCase() === 'post'){
            config.data = _data;
        }else{
            config.params = _data;
            config.data = _data;
        }
        let response = await axios(config);
        let requestData;
        if(this.getData.requestData){
            requestData = this.getData.requestData
        }else{
            requestData = {};
        }
        
        requestData[name] = response;
        this.setData = {requestData: requestData};
        this.setResult = requestData[name];
        return this;
    }

    async run (){
        await Promise.resolve(this[this.getParams.action](this.getParams.value, this.getDataItem(this.getParams.dataPath)));
        return this.getResult;
    }
}
