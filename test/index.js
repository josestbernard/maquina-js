const test = require('ava');
const StateMachine = require('../lib/fsm')

let machine;

test.beforeEach('initialize', t => {
	// This runs before all tests
  const states = ['solid', 'liquid', 'gas'];

  const transitions = [
  	{ trigger: 'melt', source: 'solid', target: 'liquid' },
    { trigger: 'boil', source: 'liquid', target: 'gas' },
  ];

  machine = new StateMachine(states, transitions);
});

test.afterEach('destroy', t => {
  machine = null;
})

test('valid trasition', t => {
  machine.initialize('solid');
  machine.melt();
  const currentState = machine.getState();
	t.is(currentState, 'liquid');
});

test('invalid trasition', t => {
  machine.initialize('solid');
  machine.boil();
  const currentState = machine.getState();
  t.is(currentState, 'solid');
});

test('unexisting trasition', t => {
  machine.initialize('solid');
  try {
    machine.foo();
  } catch(e) {
    const currentState = machine.getState();
    t.is(currentState, 'solid');
  }
});

function beforeTransition() {
  return true;
}

function failBeforeTransition(a, b ,c) {
  return false;
}

test('with before hook', t => {
  machine.initialize('gas');
  machine.addTransition( { trigger: 'condensate', source: 'gas', target: 'liquid', before: beforeTransition } );
  machine.condensate();
  const currentState = machine.getState();
  t.is(currentState, 'liquid');
});

test('with failing before hook', t => {
  machine.initialize('gas');
  machine.addTransition( { trigger: 'condensate', source: 'gas', target: 'liquid', before: failBeforeTransition } );
  machine.condensate();
  const currentState = machine.getState();
  t.is(currentState, 'gas');
});

test('trigger remove', t => {
  machine.initialize('solid');
  machine.removeTransition('melt');
  t.is(machine.melt, undefined);
});