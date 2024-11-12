'use strict';
import {Engine, Rule} from 'json-rules-engine';
import Action from './src/action.js';

export default class RuleEngine {
    constructor(data){
        this.data = data;
        this.failureReasons = [];
        this.successEvent = {
            event: {

            }, 
            result:{

            }
        };
        this.engine = new Engine();
        let _this = this;

        let event1 = {
            type: 'passed-rule1',
            params: {
                action: 'multiply',
                value: 0.3,
                dataPath: 'data.transactionStats.sales.medianDailyValue'
            }
        };

        let action1 = new Action(this.data, event1.params);

        // Condition 1
        let conditions1 = {
            all: [
                {
                    fact: 'statement',
                    operator: 'greaterThanInclusive',
                    path:'$.data.transactionStats.sales.avgDailyCount',
                    value: 15
                }, {
                    fact: 'statement',
                    operator: 'greaterThanInclusive',
                    path:'$.data.transactionStats.sales.medianDailyValue',
                    value: 30000
                },
                {
                    fact: 'statement',
                    operator: 'greaterThanInclusive',
                    path:'$.data.transactionStats.vas.medianDailyValue',
                    value: 3000
                },
                {
                    fact: 'statement',
                    operator: 'greaterThanInclusive',
                    path:'$.data.transactionStats.transfer.medianDailyValue',
                    value: 20000
                },
                {
                    fact: 'statement',
                    operator: 'equal',
                    path:'$.data.activeLast7days',
                    value: true
                },
                {
                    fact: 'date',
                    operator: 'greaterThanInclusive',
                    params: action1,
                    value: 180
                }
            ]
        };


        const rule1 = new Rule({name: 'rule1', conditions: conditions1, event: event1, priority: 6});
        this.engine.addRule(rule1);

        let event2 = {
            type: 'passed-rule2',
            params: {
                action: 'multiply',
                value: 0.25,
                dataPath: 'data.transactionStats.sales.medianDailyValue'
            }
        };

        let action2 = new Action(this.data, event2.params);

        let conditions2 = {
            all: [
                {
                    fact: 'statement',
                    operator: 'greaterThanInclusive',
                    path:'$.data.transactionStats.sales.avgDailyCount',
                    value: 5
                }, {
                    fact: 'statement',
                    operator: 'greaterThanInclusive',
                    path:'$.data.transactionStats.sales.medianDailyValue',
                    value: 20000
                },
                {
                    fact: 'statement',
                    operator: 'greaterThanInclusive',
                    path:'$.data.transactionStats.vas.medianDailyValue',
                    value: 3500
                },
                {
                    fact: 'statement',
                    operator: 'equal',
                    path:'$.data.activeLast7days',
                    value: true
                },
                {
                    fact: 'date',
                    operator: 'greaterThanInclusive',
                    params: action2,
                    value: 90
                }
            ]
        };

        const rule2 = new Rule({name: 'rule2',conditions: conditions2, event: event2, priority: 5});
        this.engine.addRule(rule2);

        let event3 = {
            type: 'passed-rule3',
            params: {
                action: 'multiply',
                value: 0.2,
                dataPath: 'data.transactionStats.sales.medianDailyValue'
            }
        };

        let action3 = new Action(this.data, event3.params);

        let conditions3 = {
            all: [
                {
                    fact: 'statement',
                    operator: 'greaterThanInclusive',
                    path:'$.data.transactionStats.sales.avgDailyCount',
                    value: 3
                }, {
                    fact: 'statement',
                    operator: 'greaterThanInclusive',
                    path:'$.data.transactionStats.sales.medianDailyValue',
                    value: 10000
                },
                {
                    fact: 'statement',
                    operator: 'equal',
                    path:'$.data.activeLast7days',
                    value: true
                },
                {
                    fact: 'date',
                    operator: 'greaterThanInclusive',
                    params: action3,
                    value: 90
                }
            ]
        };

        const rule3 = new Rule({name: 'rule3', conditions: conditions3, event: event3, priority: 4});
        this.engine.addRule(rule3);

        let event4 = {
            type: 'passed-rule4',
            params: {
                action: 'multiply',
                value: 0.2,
                dataPath: 'data.transactionStats.sales.medianDailyValue'
            }
        };

        let action4 = new Action(this.data, event4.params);

        let conditions4 = {
            all: [
                {
                    fact: 'statement',
                    operator: 'equal',
                    path:'$.data.activeLast7days',
                    value: true
                },
                {
                    fact: 'date',
                    operator: 'greaterThanInclusive',
                    params: action4,
                    value: 30
                }
            ]
        };

        const rule4 = new Rule({name: 'rule4', conditions: conditions4, event: event4, priority: 3});
        this.engine.addRule(rule4);

        let event5 = {
            type: 'passed-rule5',
            params: {
                action: 'multiply',
                value: 0.2,
                dataPath: 'data.transactionStats.sales.medianDailyValue'
            }
        };

        let action5 = new Action(this.data, event5.params);

        let conditions5 = {
            all: [
                {
                    fact: 'statement',
                    operator: 'equal',
                    path:'$.data.activeLast30days',
                    value: true
                },
                {
                    fact: 'date',
                    operator: 'greaterThanInclusive',
                    params: action5,
                    value: 30
                }
            ]
        };
        

        const rule5 = new Rule({name: 'rule5', conditions: conditions5, event: event5, priority: 2});
        this.engine.addRule(rule5);

        this.engine.on('passed-rule1', (event, almanac, result) => {
            _this.successEvent.event = result;
            _this.successEvent.result = action1.run();
            _this.engine.stop();
        });

        this.engine.on('passed-rule2', (event, almanac, result) => {
            _this.successEvent.event = result;
            _this.successEvent.result = action2.run();
            _this.engine.stop();
        });

        this.engine.on('passed-rule3', (event, almanac, result) => {
            _this.successEvent.event = result;
            _this.successEvent.result = action3.run();
            _this.engine.stop();
        });

        this.engine.on('passed-rule4', (event, almanac, result) => {
            _this.successEvent.event = result;
            _this.successEvent.result = action4.run();
            _this.engine.stop();
        });

        this.engine.on('passed-rule5', (event, almanac, result) => {
            _this.successEvent.event = result;
            _this.successEvent.result = action5.run();
            _this.engine.stop();
        });


        this.engine.on('failure', (event, almanac, result) => {
            _this.failureReasons.push(result);
        });

        let statementFact = function(params, almanac){
            return _this.data;
        };

        this.engine.addFact('statement', statementFact);

        let dateFact = function(params, almanac){
            let action = action1;
            action.setThen = action.getDataItem('data.fullbiodata1.dateOnboarded');
            action.setNow = new Date();
            return action.numberOfDays().getResult;
        };

        this.engine.addFact('date', dateFact);
    }

    run(){
        let _this = this;
        return new Promise(function(resolve, reject){
            _this.engine.run()
                .then(function(){
                    return resolve({
                        successEvents: _this.successEvent,
                        failureReasons: _this.failureReasons
                    });
                })
                .catch(function(err){
                    return reject(err);
                });
        });
    }
}


// start the engine
// add facts to the engine. Facts are data
// facts has name, and a fact can be removed.
// You can add a rule to the engine. 
// rules have name, conditions, events and priority. they also have onSuccess and onFailure functions. The functions are optional and the priority is optional
// rules can be removed
// Rules can be updated
// You can add and remove a custom operator to an engine
// You can add and remove an operator decorator
// you can set conditions to an engine
// you can remove conditions from an engine
// you can run the engine
// you can stop the engine
// You can get fact value from almanac
// you can store rules to JSON
// conditions have names
// AI should be able to configure the rules.












// Operator

// Decorator

// Engine

// Rule

// Events

// Conditions

// Fact

// Name
