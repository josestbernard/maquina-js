const test = require('ava');
const StateMachine = require('../lib/fsm')


let machine;


test.beforeEach('initialize', t => {
	// This runs before all tests
  const states = ['solid', 'liquid', 'gas'];

  const transitions = [
  	{ trigger: 'melt', source: 'solid', target: 'liquid' },
    { trigger: 'boil', source: 'liquid', target: 'gas' },
    { trigger: 'condensate', source: 'gas', target: 'liquid' },
  ];

  machine = new StateMachine(states, transitions, 'solid');
});

test.afterEach('destroy', t => {
  machine = null;
})

test('valid trasition', t => {
  machine.melt();
  const currentState = machine.getState();
	t.is(currentState, 'liquid');
});

test('invalid trasition', t => {
  machine.boil();
  const currentState = machine.getState();
  t.is(currentState, 'solid');
});
