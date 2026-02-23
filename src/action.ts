'use strict';

import _ from 'lodash';
import moment, { type Moment } from 'moment';
import axios from 'axios';
import type { ActionParams } from './types.js';

type ActionData = Record<string, unknown> & { requestData?: Record<string, unknown> };

export default class Action {
    firstNumber!: number;
    secondNumber!: number;
    now!: Moment;
    then!: Moment;
    result!: unknown;
    params!: ActionParams;
    data!: ActionData;
    headers!: Record<string, unknown>;
    method!: string | false;
    url!: string | false;

    constructor(data: ActionData, params: ActionParams) {
        if (typeof data !== 'object') {
            throw new Error('data must be an object');
        }
        if (typeof params !== 'object') {
            throw new Error('params must be an object');
        }
        if (!params.action || typeof params.action !== 'string') {
            throw new Error('param must have an action attribute of type string');
        }
        if (params.value === undefined) {
            throw new Error('param must have a value attribute');
        }
        if (!params.dataPath || typeof params.dataPath !== 'string') {
            throw new Error('param must have a dataPath attribute of type string');
        }
        if (typeof (this as Record<string, unknown>)[params.action] !== 'function') {
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

    set setFirstNumber(number: number) {
        if (typeof number !== 'number') {
            throw new Error('number must be of type number.');
        }
        this.firstNumber = number * 1;
    }

    get getFirstNumber(): number {
        return this.firstNumber;
    }

    set setSecondNumber(number: number) {
        if (typeof number !== 'number') {
            throw new Error('number must be of type number.');
        }
        this.secondNumber = number * 1;
    }

    get getSecondNumber(): number {
        return this.secondNumber;
    }

    set setNow(date: string | Date | Moment) {
        if (!date) {
            throw new Error('Please pass a date');
        }
        this.now = moment(date);
    }

    get getNow(): Moment {
        return this.now;
    }

    set setThen(date: string | Date | Moment) {
        if (!date) {
            throw new Error('Please pass a date');
        }
        this.then = moment(date);
    }

    get getThen(): Moment {
        return this.then;
    }

    set setResult(result: unknown) {
        if (typeof result !== 'boolean' && !result) {
            throw new Error('Please pass a result');
        }
        this.result = result;
    }

    get getResult(): unknown {
        return this.result;
    }

    set setParams(params: ActionParams) {
        if (typeof params !== 'object') {
            throw new Error('params must be an object');
        }
        if (!params.action || typeof params.action !== 'string') {
            throw new Error('param must have an action attribute of type string');
        }
        if (params.value === undefined) {
            throw new Error('param must have a value attribute');
        }
        if (!params.dataPath || typeof params.dataPath !== 'string') {
            throw new Error('param must have a dataPath attribute of type string');
        }
        if (typeof (this as Record<string, unknown>)[params.action] !== 'function') {
            throw new Error('invalid action');
        }
        this.params = params;
    }

    get getParams(): ActionParams {
        return this.params;
    }

    set setData(data: ActionData) {
        if (typeof data !== 'object') {
            throw new Error('data must be an object');
        }
        this.data = _.extend(this.data, data) as ActionData;
    }

    get getData(): ActionData {
        return this.data;
    }

    set setHeaders(headers: Record<string, unknown>) {
        if (typeof headers !== 'object') {
            throw new Error('headers must be an object');
        }
        this.headers = headers;
    }

    get getHeaders(): Record<string, unknown> {
        return this.headers;
    }

    set setMethod(method: string) {
        if (typeof method !== 'string') {
            throw new Error('method must be a sting');
        }
        this.method = method;
    }

    get getMethod(): string | false {
        return this.method;
    }

    set setUrl(url: string) {
        if (typeof url !== 'string') {
            throw new Error('url must be a sting');
        }
        this.url = url;
    }

    get getUrl(): string | false {
        return this.url;
    }

    getDataItem(item: string): unknown {
        if (typeof item !== 'string') {
            throw new Error('parameter must be a string.');
        }
        return _.get(this.data, item);
    }

    multiply(firstNumber?: number, secondNumber?: number): this {
        if (firstNumber !== undefined) {
            this.setFirstNumber = firstNumber;
        }
        if (secondNumber !== undefined) {
            this.setSecondNumber = secondNumber;
        }
        this.setResult = this.firstNumber * this.secondNumber;
        return this;
    }

    divide(firstNumber?: number, secondNumber?: number): this {
        if (firstNumber !== undefined) {
            this.setFirstNumber = firstNumber;
        }
        if (secondNumber !== undefined) {
            this.setSecondNumber = secondNumber;
        }
        this.setResult = this.firstNumber / this.secondNumber;
        return this;
    }

    add(firstNumber?: number, secondNumber?: number): this {
        if (firstNumber !== undefined) {
            this.setFirstNumber = firstNumber;
        }
        if (secondNumber !== undefined) {
            this.setSecondNumber = secondNumber;
        }
        this.setResult = this.firstNumber + this.secondNumber;
        return this;
    }

    substract(firstNumber?: number, secondNumber?: number): this {
        if (firstNumber !== undefined) {
            this.setFirstNumber = firstNumber;
        }
        if (secondNumber !== undefined) {
            this.setSecondNumber = secondNumber;
        }
        this.setResult = this.firstNumber - this.secondNumber;
        return this;
    }

    true(): this {
        this.setResult = true;
        return this;
    }

    false(): this {
        this.setResult = false;
        return this;
    }

    numberOfDays(then?: string | Date | Moment, now?: string | Date | Moment): this {
        if (then !== undefined) {
            this.setThen = then;
        }
        if (now !== undefined) {
            this.setNow = now;
        }
        this.setResult = Math.abs(this.now.diff(this.then, 'days'));
        return this;
    }

    numberOfWeeks(then?: string | Date | Moment, now?: string | Date | Moment): this {
        if (then !== undefined) {
            this.setThen = then;
        }
        if (now !== undefined) {
            this.setNow = now;
        }
        this.setResult = Math.abs(this.now.diff(this.then, 'weeks'));
        return this;
    }

    numberOfMonths(then?: string | Date | Moment, now?: string | Date | Moment): this {
        if (then !== undefined) {
            this.setThen = then;
        }
        if (now !== undefined) {
            this.setNow = now;
        }
        this.setResult = Math.abs(this.now.diff(this.then, 'months'));
        return this;
    }

    numberOfYears(then?: string | Date | Moment, now?: string | Date | Moment): this {
        if (then !== undefined) {
            this.setThen = then;
        }
        if (now !== undefined) {
            this.setNow = now;
        }
        this.setResult = Math.abs(this.now.diff(this.then, 'years'));
        return this;
    }

    async request(name: string, overrideData: Record<string, unknown>): Promise<this> {
        if (typeof name !== 'string') {
            throw new Error('name must be a string');
        }
        if (typeof overrideData !== 'object') {
            throw new Error('overrideData must be an object');
        }
        const config: {
            url: string | false;
            method: string | false;
            headers: Record<string, unknown>;
            params?: Record<string, unknown>;
            data?: Record<string, unknown>;
        } = {
            url: this.getUrl,
            method: this.getMethod,
            headers: this.getHeaders
        };
        let _data: Record<string, unknown>;
        if (overrideData) {
            _data = { ...overrideData };
        } else {
            _data = { ...this.getData };
        }
        delete _data.requestData;
        const method = String(this.getMethod).toLowerCase();
        if (method === 'get') {
            config.params = _data;
        } else if (method === 'post') {
            config.data = _data;
        } else {
            throw new Error('Invalid method. Method can only be POST or GET');
        }
        let requestData: Record<string, unknown> = (this.getData.requestData as Record<string, unknown>) ?? {};
        const response = await axios(config as import('axios').AxiosRequestConfig);
        requestData[name] = response.data;
        this.setData = { requestData };
        this.setResult = requestData[name];
        return this;
    }

    async run(): Promise<unknown> {
        const actionName = this.getParams.action as keyof Action;
        const fn = this[actionName] as (a?: unknown, b?: unknown) => unknown;
        await Promise.resolve(fn.call(this, this.getParams.value, this.getDataItem(this.getParams.dataPath)));
        return this.getResult;
    }
}
