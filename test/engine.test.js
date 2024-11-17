/* globals describe it afterEach beforeEach*/
'use strict';
import {should} from 'chai';
should();
import RuleEngine from '../src/ruleengine.js';
import sinon from 'sinon';
import { Engine, Rule, Fact } from 'json-rules-engine';
import Name from '../src/name.js';
import Condition from '../src/condition.js';


describe('RuleEngine Class', () => {
    let engineStub;
    let addFactStub;
    let addRuleStub;
    let runStub;

    beforeEach(() => {
        // Stub Engine's methods to avoid actual processing during testing
        engineStub = sinon.createStubInstance(Engine);
        addFactStub = engineStub.addFact;
        addRuleStub = engineStub.addRule;
        runStub = engineStub.run;

        // Stub Name.findByType to control test data
        sinon.stub(Name, 'findByType').returns({
            fact: [
                { name: 'fact1', data: { key: 'value1' } },
                { name: 'fact2', data: { key: 'value2' } }
            ],
            rule: [
                {
                    name: 'rule1',
                    data: { key: 'value1' },
                    conditions: { all: [{ fact: 'fact1', operator: 'equal', value: 'value1' }] },
                    event: { type: 'rule1-event' },
                    priority: 1,
                    onSuccess: () => {},
                    onFaliure: () => {}
                },
                {
                    name: 'rule2',
                    data: { key: 'value2' },
                    conditions: { all: [{ fact: 'fact2', operator: 'equal', value: 'value2' }] },
                    event: { type: 'rule2-event' },
                    priority: 2,
                    onSuccess: () => {},
                    onFaliure: () => {}
                }
            ]
        });

        // Mock the Engine instance within RuleEngine
        sinon.stub(Engine.prototype, 'addFact').callsFake(addFactStub);
        sinon.stub(Engine.prototype, 'addRule').callsFake(addRuleStub);
        sinon.stub(Engine.prototype, 'run').callsFake(runStub);
    });

    afterEach(() => {
        // Restore all stubs after each test
        sinon.restore();
    });

    describe('Constructor and Initialization', () => {
        it('should initialize the engine and add facts', () => {
            const ruleEngine = new RuleEngine();
            addFactStub.callCount.should.equal(2); // Two facts are added

            addFactStub.getCall(0).args[0].should.be.instanceOf(Fact);
            addFactStub.getCall(0).args[0].should.have.property('id').that.equals('fact1');
            addFactStub.getCall(0).args[0].should.have.property('value').that.deep.equals({ key: 'value1' });

            addFactStub.getCall(1).args[0].should.be.instanceOf(Fact);
            addFactStub.getCall(1).args[0].should.have.property('id').that.equals('fact2');
            addFactStub.getCall(1).args[0].should.have.property('value').that.deep.equals({ key: 'value2' });

            ruleEngine.should.have.property('artifacts');
            ruleEngine.artifacts.should.have.property('facts').with.lengthOf(2);
            ruleEngine.artifacts.facts[0].should.deep.equal({ fact1: { key: 'value1' } });
            ruleEngine.artifacts.facts[1].should.deep.equal({ fact2: { key: 'value2' } });
        });

        it('should initialize the engine and add rules', () => {
            const ruleEngine = new RuleEngine();
            addRuleStub.callCount.should.equal(2); // Two rules are added

            addRuleStub.getCall(0).args[0].should.be.instanceOf(Rule);
            addRuleStub.getCall(0).args[0].conditions.all[0].fact.should.equal('fact1');
            addRuleStub.getCall(0).args[0].ruleEvent.should.have.property('type').that.equals('rule1-event');
            addRuleStub.getCall(0).args[0].should.have.property('priority').that.equals(1);

            addRuleStub.getCall(1).args[0].should.be.instanceOf(Rule);
            addRuleStub.getCall(1).args[0].conditions.all[0].fact.should.equal('fact2');
            addRuleStub.getCall(1).args[0].ruleEvent.should.have.property('type').that.equals('rule2-event');
            addRuleStub.getCall(1).args[0].should.have.property('priority').that.equals(2);
            ruleEngine.artifacts.should.have.property('rules').with.lengthOf(2);
            ruleEngine.artifacts.rules[0].rule1.data.key.should.equal('value1');
            ruleEngine.artifacts.rules[1].rule2.data.key.should.equal('value2');
        });
    });

    describe('run Method', () => {
        it('should call engine.run and return a promise', async () => {
            runStub.resolves('runResult');
            const ruleEngine = new RuleEngine();

            const result = await ruleEngine.run();
            console.log(result);
            runStub.calledOnce.should.be.true;
            result.should.equal('runResult');
        });
    });
});


