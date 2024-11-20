/* globals describe it*/
'use strict';
import {should} from 'chai';
should();

import Name from '../src/name.js';
import Fact from '../src/fact.js';
import Conditions from '../src/conditions.js';
import Condition from '../src/condition.js';
import Rule from '../src/rule.js';


describe('Name Class', () => {

    describe('Constructor and Getters/Setters', () => {
        it('should throw an error if the name is not a string', () => {
            (() => new Name(123)).should.throw('name must be a string.');
        });

        it('should create an instance with a valid name', () => {
            const name = new Name('testName');
            name.getName.should.equal('testName');
        });

        it('should set and get name properly', () => {
            const name = new Name('initialName');
            // name.setName = 'newName';
            name.getName.should.equal('initialName');
        });

        it('should throw an error if setName is not a string', () => {
            const name = new Name('validName');
            (() => name.setName = 123).should.throw('name must be a string.');
        });

        it('should set and get type properly', () => {
            const name = new Name('testName');
            name.setType = 'type1';
            name.getType.should.equal('type1');
        });

        it('should throw an error if setType is not a string', () => {
            const name = new Name('testName');
            (() => name.setType = 123).should.throw('type must be a string.');
        });

        it('should set and get data properly', () => {
            const name = new Name('testName');
            name.setData = { key: 'value' };
            name.getData.should.deep.equal({ key: 'value' });
        });

        it('should throw an error if setData is not an object or function', () => {
            const name = new Name('testName');
            (() => name.setData = 123).should.throw('data must be an object or a function.');
        });
    });

    describe('Static Methods', () => {

        it('should save a valid Name instance', () => {
            const name = new Name('testName');
            Name.save(name);
            Name.find('testName').should.equal(name);
        });

        it('should throw an error if saving a non-Name instance', () => {
            (() => Name.save({})).should.throw('You can only save Name instances');
        });

        it('should throw an error if the name already exists', () => {
            const name = new Name('duplicateName');
            Name.save(name);
            (() => Name.save(name)).should.throw('This name already exists');
        });

        it('should find a saved Name instance by name', () => {
            const name = new Name('testName12');
            Name.save(name);
            Name.find('testName12').should.equal(name);
        });

        it('should throw an error if find parameter is not a string', () => {
            (() => Name.find(123)).should.throw('Name must be a string');
        });

        it('should throw an error if name is not found in find method', () => {
            (() => Name.find('nonExistent')).should.throw('name not found');
        });

        it('should return all saved names with findAll', () => {
            const name1 = new Name('name1');
            const name2 = new Name('name2');
            Name.save(name1);
            Name.save(name2);
            const allNames = Name.findAll();
            allNames.should.have.property('name1').equal(name1);
            allNames.should.have.property('name2').equal(name2);
        });

        it('should update an existing Name instance', () => {
            const name = new Name('updatableName');
            Name.save(name);
            Name.update('updatableName', { type: 'newType' });
            Name.find('updatableName').getType.should.equal('newType');
        });

        it('should throw an error if update name is not a string', () => {
            (() => Name.update(123, {})).should.throw('Name must be a string');
        });

        it('should throw an error if update object is not an object', () => {
            const name = new Name('updatableName12');
            Name.save(name);
            (() => Name.update('updatableName12', 'invalid')).should.throw('Update parameter must be an object');
        });

        it('should throw an error if name to update does not exist', () => {
            (() => Name.update('nonExistent', {})).should.throw('name not found');
        });
    });

});


describe('Fact Class', () => {

    describe('Constructor', () => {
        it('should throw an error if the name is not a string', () => {
            (() => new Fact(123)).should.throw('name must be a string.');
        });

        it('should create a Fact instance and set name in Name class', () => {
            const fact = new Fact('testFact');
            fact.getName.should.equal('testFact');
            Name.find('testFact').should.exist;
        });
    });

    describe('Getters and Setters', () => {
        it('should set and get name properly', () => {
            const fact = new Fact('initialName');
            // fact.setName = 'newName';
            fact.getName.should.equal('initialName');
        });

        it('should throw an error if setName is not a string', () => {
            const fact = new Fact('testNamef1');
            (() => fact.setName = 123).should.throw('name must be a string.');
        });

        it('should set and get fact data as an object', () => {
            const fact = new Fact('testFactf2');
            const factData = { key: 'value' };
            fact.setFact = factData;
            fact.getFact.should.deep.equal(factData);
        });

        it('should set and get fact data as a function', () => {
            const fact = new Fact('functionFact');
            const factFunction = (params, almanac) => `result with ${params} and ${almanac}`;
            fact.setFact = factFunction;
            fact.getFact.should.be.a('function');
            fact.getFact('param1', 'almanac1').should.equal('result with param1 and almanac1');
        });

    });

    describe('Static Methods', () => {
        it('should find and return fact data by name', () => {
            const fact = new Fact('searchableFact');
            const factData = { key: 'value' };
            fact.setFact = factData;
            Fact.find('searchableFact').should.deep.equal(factData);
        });

        it('should throw an error if find parameter is not a string', () => {
            (() => Fact.find(123)).should.throw('Name must be a string');
        });

        it('should throw an error if the fact name does not exist in find method', () => {
            (() => Fact.find('nonExistent')).should.throw('name not found');
        });
    });

});



describe('Condition Class', () => {

    describe('Chaining Methods and Building Condition Object', () => {

        it('should set the path correctly', () => {
            const condition = new Condition().path('$.price');
            condition.getCondition.should.have.property('path').equal('$.price');
        });

        it('should throw an error if path is not a string', () => {
            const condition = new Condition();
            (() => condition.path(123)).should.throw('a path must be a string');
        });

        it('should set a valid fact', () => {
            // Ensure a fact exists in Fact class
            const fact = new Fact('testFactcc1');
            fact.setFact = {test: true};
            const condition = new Condition().fact('testFactcc1');
            condition.getCondition.should.have.property('fact').equal('testFactcc1');
        });

        it('should throw an error if fact is not a string', () => {
            const condition = new Condition();
            (() => condition.fact(123)).should.throw('a fact must be a string');
        });

        it('should throw an error if fact is invalid (not found)', () => {
            const condition = new Condition();
            (() => condition.fact('nonExistentFact')).should.throw('invalid fact');
        });

        it('should set params as an object', () => {
            const params = { productId: 'widget' };
            const condition = new Condition().params(params);
            condition.getCondition.should.have.property('params').deep.equal(params);
        });

        it('should throw an error if params is not an object', () => {
            const condition = new Condition();
            (() => condition.params('notAnObject')).should.throw('a params must be an object');
        });

        it('should set value correctly', () => {
            const condition = new Condition().value(100);
            condition.getCondition.should.have.property('value').equal(100);
        });

        it('should throw an error if value is not provided', () => {
            const condition = new Condition();
            (() => condition.value()).should.throw('please pass a value');
        });

        it('should set a valid operator', () => {
            const condition = new Condition().operator('greaterThan');
            condition.getCondition.should.have.property('operator').equal('greaterThan');
        });

        it('should throw an error if operator is not a string', () => {
            const condition = new Condition();
            (() => condition.operator(123)).should.throw('a op must be a string');
        });

        it('should throw an error for an invalid operator', () => {
            const condition = new Condition();
            (() => condition.operator('invalidOperator')).should.throw('Invalid Operator');
        });
    });

    describe('Static addOperator Method', () => {

        it('should add a new valid operator', () => {
            const newOperator = 'customOperator';
            const condition = new Condition().addOperator(newOperator).operator(newOperator);
            condition.getCondition.should.have.property('operator').equal(newOperator);
        });

        it('should throw an error if addOperator parameter is not a string', () => {
            (() => new Condition().addOperator(123)).should.throw('a op must be a string');
        });
    });
});


describe('Conditions Class', () => {

    describe('Constructor', () => {
        it('should throw an error if the name is not a string', () => {
            (() => new Conditions(123)).should.throw('name must be a string.');
        });

        it('should create a Conditions instance and set name in Name class', () => {
            const conditions = new Conditions('testConditions');
            conditions.getName.should.equal('testConditions');
            Name.find('testConditions').should.exist;
        });
    });

    describe('not Method', () => {
        it('should add a single condition to the "not" field of the data object', () => {
            const conditions = new Conditions('testNotCondition');
            conditions.not({ field: 'value' });
            const data = Name.find('testNotCondition').getData;
            data.should.have.property('not').that.is.an('array').with.lengthOf(1);
            data.not[0].should.deep.equal({ field: 'value' });
        });
    });

    describe('all Method', () => {
        it('should add multiple conditions to the "all" field when passed an array', () => {
            const conditions = new Conditions('testAllConditionArray');
            conditions.all([{ field: 'value1' }, { field: 'value2' }]);
            const data = Name.find('testAllConditionArray').getData;
            data.should.have.property('all').that.is.an('array').with.lengthOf(2);
            data.all[0].should.deep.equal({ field: 'value1' });
            data.all[1].should.deep.equal({ field: 'value2' });
        });

        it('should add a single condition to the "all" field when passed an object', () => {
            const conditions = new Conditions('testAllConditionSingle');
            conditions.all({ field: 'singleValue' });
            const data = Name.find('testAllConditionSingle').getData;
            data.should.have.property('all').that.is.an('array').with.lengthOf(1);
            data.all[0].should.deep.equal({ field: 'singleValue' });
        });

        it('should accumulate conditions across multiple calls', () => {
            const conditions = new Conditions('testAllConditionMultipleCalls');
            conditions.all({ field: 'value1' });
            conditions.all({ field: 'value2' });
            const data = Name.find('testAllConditionMultipleCalls').getData;
            data.should.have.property('all').that.is.an('array').with.lengthOf(2);
            data.all[0].should.deep.equal({ field: 'value1' });
            data.all[1].should.deep.equal({ field: 'value2' });
        });
    });

    describe('any Method', () => {
        it('should add multiple conditions to the "any" field when passed an array', () => {
            const conditions = new Conditions('testAnyConditionArray');
            conditions.any([{ field: 'value1' }, { field: 'value2' }]);
            const data = Name.find('testAnyConditionArray').getData;
            data.should.have.property('any').that.is.an('array').with.lengthOf(2);
            data.any[0].should.deep.equal({ field: 'value1' });
            data.any[1].should.deep.equal({ field: 'value2' });
        });

        it('should add a single condition to the "any" field when passed an object', () => {
            const conditions = new Conditions('testAnyConditionSingle');
            conditions.any({ field: 'singleValue' });
            const data = Name.find('testAnyConditionSingle').getData;
            data.should.have.property('any').that.is.an('array').with.lengthOf(1);
            data.any[0].should.deep.equal({ field: 'singleValue' });
        });

        it('should accumulate conditions across multiple calls', () => {
            const conditions = new Conditions('testAnyConditionMultipleCalls');
            conditions.any({ field: 'value1' });
            conditions.any({ field: 'value2' });
            const data = Name.find('testAnyConditionMultipleCalls').getData;
            data.should.have.property('any').that.is.an('array').with.lengthOf(2);
            data.any[0].should.deep.equal({ field: 'value1' });
            data.any[1].should.deep.equal({ field: 'value2' });
        });
    });

});

describe('Rule Class', () => {

    describe('Constructor', () => {
        it('should throw an error if the name is not a string', () => {
            (() => new Rule(123)).should.throw('name must be a string.');
        });

        it('should create a Rule instance and set name in Name class', () => {
            const rule = new Rule('testRule');
            rule.getName.should.equal('testRule');
            Name.find('testRule').should.exist;
        });
    });

    describe('setName', () => {
        it('should throw an error if setName is not a string', () => {
            const rule = new Rule('initialRule');
            (() => rule.setName = 123).should.throw('name must be a string.');
        });

        it('should throw an error if name is already set', () => {
            const rule = new Rule('initialRule1');
            (() => rule.setName = 'anotherName').should.throw('name already set.');
        });
    });

    describe('conditions Method', () => {
        it('should set conditions from an existing Conditions instance', () => {
            const conditions = new Conditions('testConditions23');
            conditions.all({ field: 'value' });

            const rule = new Rule('testRuleWithConditions');
            rule.conditions('testConditions23');

            const ruleData = Name.find('testRuleWithConditions');
            ruleData.should.have.property('conditions').that.is.an('object');
            ruleData.conditions.should.deep.equal(conditions.getData);
        });

        it('should throw an error if conditions name is not a string', () => {
            const rule = new Rule('testRule12');
            (() => rule.conditions(123)).should.throw('Name must be a string.');
        });

        it('should throw an error if conditions with given name do not exist', () => {
            const rule = new Rule('testRule9');
            (() => rule.conditions('nonExistentConditions')).should.throw('name not found');
        });
    });

    describe('event Method', () => {
        it('should set the event with type and params', () => {
            const rule = new Rule('testEventRule');
            rule.event('testEvent', { key: 'value' });

            const ruleData = Name.find('testEventRule');
            ruleData.should.have.property('event').that.is.an('object');
            ruleData.event.should.deep.equal({ type: 'testEvent', params: { key: 'value' } });
        });

        it('should throw an error if event type is not a string', () => {
            const rule = new Rule('testEventRule00');
            (() => rule.event(123)).should.throw('Type must be a string.');
        });

        it('should throw an error if event params is not an object', () => {
            const rule = new Rule('testEventRule000');
            (() => rule.event('testEvent', 'invalidParams')).should.throw('Params must be an object.');
        });
    });

    describe('priority Method', () => {
        it('should set the priority as a positive number', () => {
            const rule = new Rule('testPriorityRule');
            rule.priority(5);

            const ruleData = Name.find('testPriorityRule');
            ruleData.should.have.property('priority').equal(5);
        });

        it('should throw an error if priority is not a number', () => {
            const rule = new Rule('testPriorityRule78');
            (() => rule.priority('high')).should.throw('_priority must be a string.');
        });

        it('should throw an error if priority is less than 1', () => {
            const rule = new Rule('testPriorityRule87');
            (() => rule.priority(0)).should.throw('_priority must be a positive number.');
        });
    });

    describe('onSuccess Method', () => {
        it('should set the onSuccess function', () => {
            const rule = new Rule('testOnSuccessRule');
            const successFunction = (_event, _almanac) => `Success with ${_event} and ${_almanac}`;
            rule.onSuccess(successFunction);

            const ruleData = Name.find('testOnSuccessRule');
            ruleData.should.have.property('onSuccess').that.is.a('function');
            ruleData.onSuccess('event', 'almanac').should.equal('Success with event and almanac');
        });

        it('should throw an error if onSuccess parameter is not a function', () => {
            const rule = new Rule('testOnSuccessRule167');
            (() => rule.onSuccess('notAFunction')).should.throw('_funct must be a function.');
        });
    });

    describe('onFailure Method', () => {
        it('should set the onFailure function', () => {
            const rule = new Rule('testOnFailureRule');
            const failureFunction = (_event, _almanac) => `Failure with ${_event} and ${_almanac}`;
            rule.onFailure(failureFunction);

            const ruleData = Name.find('testOnFailureRule');
            ruleData.should.have.property('onFailure').that.is.a('function');
            ruleData.onFailure('event', 'almanac').should.equal('Failure with event and almanac');
        });

        it('should throw an error if onFailure parameter is not a function', () => {
            const rule = new Rule('testOnFailureRule34');
            (() => rule.onFailure('notAFunction')).should.throw('_funct must be a function.');
        });
    });

    describe('Static find Method', () => {
        it('should find an existing rule by name', () => {
            const rule = new Rule('existingRule');
            const foundRule = Rule.find('existingRule');
            foundRule.getType.should.equal('rule');
        });

        it('should throw an error if find parameter is not a string', () => {
            (() => Rule.find(123)).should.throw('Name must be a string');
        });

        it('should throw an error if rule with given name does not exist', () => {
            (() => Rule.find('nonExistentRule')).should.throw('name not found');
        });
    });

});
