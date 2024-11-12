/* globals describe it before after*/
'use strict';

import * as chai from 'chai';
import Action from '../src/action.js';
import sinon from 'sinon';
import _ from 'lodash';
import moment from 'moment';
import axios from 'axios';
chai.should();
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

let data = {
    'requestId' : 283,
    'data' : {
        'requestId' : 283,
        'agentId' : 10,
        'amount' : 20000,
        'purpose' : 'Cash In Cash Out',
        'repaymentPeriod' : 3,
        'loanProduct' : 2,
        'firstname' : 'Deborah',
        'lastname' : 'Offor',
        'bvn' : '22180730476',
        'loanHistory' : [
            {
                'serviceType' : 'cdl',
                'loanAmount' : 50000,
                'repaymentAmount' : 60000,
                'interest' : 4,
                'repaymentFrequency' : 'weekly',
                'repaymentStatus' : 'complete',
                'loanDisbursementDate' : '2020-04-06 12:49:30',
                'repaymentsCount' : 3,
                'defaultedCount' : 1
            }
        ],
        'transactionStats' : {
            'sales' : {
                'totalCount' : 4728,
                'totalValue' : 35666172,
                'avgMonthlyValue' : 5944362,
                'avgMonthlyCount' : 788,
                'avgDailyValue' : 198145.4, // Median daily total sales value over last 6months
                'avgDailyCount' : 26.27, // Average daily no of transactions 
                'medianDailyValue' : 202656.69
            },
            'vas' : {
                'totalCount' : 1058,
                'totalValue' : 1837232,
                'avgMonthlyValue' : 306205.33,
                'avgMonthlyCount' : 176.33,
                'avgDailyValue' : 10206.85, // Median daily VAS sales value over last 6months
                'avgDailyCount' : 5.88,
                'medianDailyValue' : 10908.44
            },
            'pos' : {
                'totalCount' : 2661,
                'totalValue' : 16879080,
                'avgMonthlyValue' : 2813180,
                'avgMonthlyCount' : 443.5,
                'avgDailyValue' : 93772.67,
                'avgDailyCount' : 14.78,
                'medianDailyValue' : 100347
            },
            'transfer' : {
                'totalCount' : 1009,
                'totalValue' : 16949860,
                'avgMonthlyValue' : 2824976.67,
                'avgMonthlyCount' : 168.17,
                'avgDailyValue' : 94165.89, // Median daily Transfer  sales value over last 6 months
                'avgDailyCount' : 5.61,
                'medianDailyValue' : 91138.67
            },
            'deposits' : {
                'totalCount' : 0,
                'totalValue' : 0,
                'avgMonthlyValue' : 0,
                'avgMonthlyCount' : 0,
                'avgDailyValue' : 0,
                'avgDailyCount' : 0,
                'medianDailyValue' : 0
            },
            'commissions' : {
                'totalCount' : 0,
                'totalValue' : 0,
                'avgMonthlyValue' : 0,
                'avgMonthlyCount' : 0,
                'avgDailyValue' : 0,
                'avgDailyCount' : 0,
                'medianDailyValue' : 0
            }
        },
        'fullbiodata1' : {
            'accountId' : '00000003',
            'username' : 'debbyoffor',
            'firstName' : 'Deborah',
            'lastName' : 'Offor',
            'gender' : 'Female',
            'dateOfBirth' : '2020-05-03T19:41:24.0626459',
            'bvn' : '22180730476',
            'phoneNumber' : '08072161276',
            'emailAddress' : 'debbyoffor@gmail.com',
            'address' : 'Oweh Street',
            'state' : 'Lagos',
            'lga' : 'Ikorodu',
            'isActive' : true,
            'isBlocked' : false,
            'isSuspended' : false,
            'dateOnboarded' : '2020-05-03'
        },
        'fullbiodata2' : null,
        'activeLast7days' : false,
        'activeLast30days' : true // Active ; transacted in the last 7 days
    }
};

let params =  {
    action: 'multiply',
    value: 0.3,
    dataPath: 'data.transactionStats.sales.medianDailyValue'
};
let action = new Action(data, params);

let methods = [
    'setFirstNumber',
    'getFirstNumber',
    'setSecondNumber',
    'getSecondNumber',
    'setNow',
    'getNow',
    'setThen',
    'getThen',
    'setResult',
    'getResult',
    'setParams',
    'getParams',
    'setData',
    'getData',
    'getDataItem',
    'multiply',
    'divide',
    'add',
    'substract',
    'true',
    'false',
    'numberOfDays',
    'numberOfWeeks',
    'numberOfMonths',
    'numberOfYears',
    'request',
    'run'
];

let number1 = 4;
let number2 = 2;
let input;

describe('#Action', function(){
    let final;
    for (let n in methods){
        it('should have method ' + methods[n], function(done){
            action.should.have.property(methods[n]);
            done();
        });

        describe('#Getters and Setters', function(){
            if(methods[n].substring(0,3) === 'set'){

                let name = methods[n].split('set')[1];

                it('should set and get ' + name, function(done){
                    if(methods[n] === 'setFirstNumber'){
                        input = number1;
                    }

                    if(methods[n] === 'setSecondNumber'){
                        input = number2;
                    }

                    if(methods[n] === 'setNow'){
                        input = new Date().toISOString();
                    }

                    if(methods[n] === 'setThen'){
                        input = new Date('2000-01-01').toISOString();
                    }

                    if(methods[n] === 'setParams'){
                        input = params;
                    }

                    if(methods[n] === 'setData'){
                        input = data;
                    }


                    action[methods[n]] = input;
                    
                    if(methods[n] === 'getDataItem'){
                        final = action['get'+name](params.dataPath);
                    }else{
                        final = action['get'+name];
                    }

                    if(typeof final.toISOString === 'function'){
                        final.toISOString().should.equal(input);
                    }else if(methods[n] === 'getDataItem'){
                        final.should.equal(data.data.transactionStats.sales.medianDailyValue);
                    }else{
                        final.should.equal(input);
                    }

                    done();
                });

            }

        });

        if(methods[n].substring(0,3) !== 'set' && methods[n].substring(0,3) !== 'get'){
            it('should execute method ' + methods[n], function(done){

                let mathOps = [
                    'multiply',
                    'divide',
                    'add',
                    'substract'
                ];

                let truthOps = [
                    'true',
                    'false',
                ];

                let dateOps = [
                    'numberOfDays',
                    'numberOfWeeks',
                    'numberOfMonths',
                    'numberOfYears',
                ];

                if(mathOps.indexOf(methods[n]) > -1){
                    final = action[methods[n]](number1, number2);
                    if(methods[n] === 'multiply'){
                        final.getResult.should.equal(4*2);
                    }
                    if(methods[n] === 'divide'){
                        final.getResult.should.equal(4/2);
                    }
                    if(methods[n] === 'add'){
                        final.getResult.should.equal(4+2);
                    }
                    if(methods[n] === 'substract'){
                        final.getResult.should.equal(4-2);
                    }

                    done();
                }else if(truthOps.indexOf(methods[n]) > -1){
                    final = action[methods[n]]();
                    final.getResult.should.be[methods[n]];
                    done();
                }else if(dateOps.indexOf(methods[n]) > -1){
                    action.setNow = new Date().toISOString();
                    action.setThen = new Date('2000-01-01').toISOString();
                    final = action[methods[n]]();

                    final.getResult.should.be.greaterThan(0);
                    done();
                }else if(methods[n] === 'run'){
                    action[methods[n]]()
                        .then(function(final){
                            final.should.equal(data.data.transactionStats.sales.medianDailyValue * params.value);
                            done();
                        })
                        .catch(function(err){
                            done(err);
                        });
                }else if(methods[n] === 'request'){
                    this.timeout(10000);
                    // action.setUrl = 'https://eowevaehva5quou.m.pipedream.net/';
                    action.setUrl = 'https://6732310b2a1b1a4ae10f3284.mockapi.io/test';
                    action.setMethod = 'GET';
                    action.headers = {testHeader: 'test'};
                    // action.setData = {testData: 'Testdata'};
                    action.setData = { Name: 'Name 2' };
                    action[methods[n]]('getRequest', { Name: 'Name 2' })
                        .then(function(final){
                            final.getResult[0].Name.should.equal('Name 2');
                            final.getData.requestData.getRequest.should.be.an('array');
                            action.setMethod = 'POST';
                            return action[methods[n]]('postRequest', { Name: 'Name 100'});
                        })
                        .then(function(final){
                            final.getResult.Name.should.equal('Name 100');
                            final.getData.requestData.getRequest.should.be.an('array');
                            final.getData.requestData.postRequest.should.be.an('object');
                            action.setMethod = 'PATCH';
                            action[methods[n]]('patchRequest', { Name: 'Name 2' }).should.eventually.throw('Invalid method. Method can only be POST or GET');
                            done();
                        })
                        .catch(function(err){
                            done(err);
                        });
                }
        
            });

        }
    }

});

describe('Action Class', () => {
    let axiosStub;

    before(() => {
        // Stub axios to avoid making real HTTP requests
        axiosStub = sinon.stub(axios, 'request');
    });

    after(() => {
        // Restore axios
        axiosStub.restore();
    });

    describe('Constructor', () => {

        it('should create an instance with valid data and params', () => {
            const data = { key: 10 };
            const params = { action: 'multiply', value: 2, dataPath: 'key' };
            const action = new Action(data, params);
            action.should.be.an('object');
            action.getData.should.equal(data);
            action.getParams.should.equal(params);
        });

        it('should throw an error if data is not an object', () => {
            (() => new Action('notObject', { action: 'multiply', value: 2, dataPath: 'key' })).should.throw('data must be an object');
        });

        it('should throw an error if params is not an object', () => {
            (() => new Action({}, 'notObject')).should.throw('params must be an object');
        });

        it('should throw an error if params lacks an action attribute', () => {
            (() => new Action({}, { value: 2, dataPath: 'key' })).should.throw('param must have an action attribute of type string');
        });

        it('should throw an error if params lacks a value attribute', () => {
            (() => new Action({}, { action: 'multiply', dataPath: 'key' })).should.throw('param must have a value attribute');
        });

        it('should throw an error if params lacks a dataPath attribute', () => {
            (() => new Action({}, { action: 'multiply', value: 2 })).should.throw('param must have a dataPath attribute of type string');
        });

        // it('should throw an error if dataPath is invalid', () => {
        //     (() => new Action({}, { action: 'multiply', value: 2, dataPath: 'invalidPath' })).should.throw('invalid data path');
        // });

        it('should throw an error if action is not a valid method', () => {
            (() => new Action({key: 2}, { action: 'nonExistentMethod', value: 2, dataPath: 'key' })).should.throw('invalid action');
        });
    });

    describe('Method Tests', () => {
        let action;

        beforeEach(() => {
            action = new Action({ key: 10 }, { action: 'multiply', value: 2, dataPath: 'key' });
        });

        it('should set and get firstNumber correctly', () => {
            action.setFirstNumber = 5;
            action.getFirstNumber.should.equal(5);
        });

        it('should throw an error if setting firstNumber to non-number', () => {
            (() => action.setFirstNumber = 'notNumber').should.throw('number must be of type number.');
        });

        it('should set and get secondNumber correctly', () => {
            action.setSecondNumber = 8;
            action.getSecondNumber.should.equal(8);
        });

        it('should throw an error if setting secondNumber to non-number', () => {
            (() => action.setSecondNumber = 'notNumber').should.throw('number must be of type number.');
        });

        it('should set and get result correctly', () => {
            action.setResult = true;
            action.getResult.should.equal(true);
        });

        it('should throw an error if setting result to non-boolean', () => {
            (() => action.setResult = undefined).should.throw('Please pass a result');
        });

        it('should multiply two numbers correctly', () => {
            action.multiply(5, 10).getResult.should.equal(50);
        });

        it('should divide two numbers correctly', () => {
            action.divide(10, 2).getResult.should.equal(5);
        });

        it('should add two numbers correctly', () => {
            action.add(3, 7).getResult.should.equal(10);
        });

        it('should subtract two numbers correctly', () => {
            action.substract(10, 5).getResult.should.equal(5);
        });

        it('should calculate number of days correctly', () => {
            action.numberOfDays('2023-01-01', '2023-01-10').getResult.should.equal(9);
        });

        it('should calculate number of weeks correctly', () => {
            action.numberOfWeeks('2023-01-01', '2023-02-01').getResult.should.equal(4);
        });

        it('should calculate number of months correctly', () => {
            action.numberOfMonths('2023-01-01', '2024-01-01').getResult.should.equal(12);
        });

        it('should calculate number of years correctly', () => {
            action.numberOfYears('2020-01-01', '2024-01-01').getResult.should.equal(4);
        });
    });

    describe('Async request Method', () => {
        it('should throw an error if name is not a string', async () => {
            const action = new Action({ key: 10 }, { action: 'multiply', value: 2, dataPath: 'key' });
            let _request = action.request(123);
            _request.should.eventually.throw('name must be a string');
        });

        it('should make a request and update requestData', async () => {
            axiosStub.resolves({ data: 'responseData' });

            const action = new Action({ Name: 'Name 1' }, { action: 'multiply', value: 2, dataPath: 'id' });
            action.setMethod = 'GET';
            action.setUrl = 'https://6732310b2a1b1a4ae10f3284.mockapi.io/test';
            // action.setUrl = 'https://eowevaehva5quou.m.pipedream.net/';
            action.headers = {testHeader: 'test'};
            action.setData = { Name: 'Name 2' };

            action.request('testRequest').should.eventually.be.an('array').that.is.equal([{ Name: 'Name 2', id: '2' }]);
        });
    });
});


