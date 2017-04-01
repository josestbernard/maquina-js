const test = require('ava');
//const StateMachine = require('../lib/fsm')
const StateMachine = require('../src/fsm')

let machine;

test.beforeEach('initialize', t => {
	// This runs before all tests
  const states = ['solid', 'liquid', 'gas', 'plasma'];

  const transitions = [
    { trigger: 'melt', source: 'solid', target: 'liquid' },
    { trigger: 'freeze', source: 'liquid', target: 'solid' },
    { trigger: 'evaporate', source: 'liquid', target: 'gas', before: beforeTransition },
    { trigger: 'sublimate', source: 'solid', target: 'gas', before: failBeforeTransition },
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
  machine.evaporate();
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

test ('adding transitions', t => {
  machine.initialize('gas')
  machine.addTransition({ trigger: 'ionize', source: 'gas', target: 'plasma' });
  machine.ionize();
  const currentState = machine.getState();
  t.is(currentState, 'plasma');
});

test ('adding duplicated trigger for source', t => {
  machine.initialize('gas')
  machine.addTransition({ trigger: 'ionize', source: 'gas', target: 'plasma' });
  machine.addTransition({ trigger: 'ionize', source: 'gas', target: 'liquid' });
  machine.ionize();
  const currentState = machine.getState();
  t.is(currentState, 'plasma');
});

test('with before hook', t => {
  machine.initialize('liquid');
  machine.evaporate();
  const currentState = machine.getState();
  t.is(currentState, 'gas');
});

test('with failing before hook', t => {
  machine.initialize('solid');
  machine.sublimate();
  const currentState = machine.getState();
  t.is(currentState, 'solid');
});

test('full trigger removal', t => {
  machine.initialize('solid');
  machine.removeTransition('melt');
  t.is(machine.melt, undefined);
});

test('state trigger removal', t => {
  machine.initialize('solid');
  machine.removeTransition('melt', 'solid');
  machine.melt();
  const currentState = machine.getState();
  t.is(currentState, 'solid');
});

test('state removal', t => {
  machine.initialize('liquid');
  console.log('before>>>', machine.states);
  machine.removeState('solid');
  console.log('after>>>', machine.states);

  machine.freeze();
  const currentState = machine.getState();
  t.is(currentState, 'liquid');
  t.is(machine.states.indexOf('solid'), -1);
}
);