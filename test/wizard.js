const test = require('ava');
//const StateMachine = require('../lib/fsm')
const StateMachine = require('../lib/fsm')

let machine;

test.beforeEach('initialize', t => {
	// This runs before all tests
  const states = ['firstStep', 'secondStep', 'thirdStep', 'fourthStep'];

  const transitions = [
    { trigger: 'next', source: 'firstStep', target: 'secondStep' },
    { trigger: 'next', source: 'secondStep', target: 'thirdStep' },
    { trigger: 'next', source: 'thirdStep', target: 'fourthStep' },
    { trigger: 'previous', source: 'fourthStep', target: 'thirdStep' },
    { trigger: 'previous', source: 'thirdStep', target: 'secondStep' },
    { trigger: 'previous', source: 'secondStep', target: 'firstStep' },
];

  machine = new StateMachine(states, transitions);
});

test.afterEach('destroy', t => {
  machine = null;
})

test('full wizard', t => {
  let currentState;

  machine.initialize('firstStep');
  currentState = machine.getState();
	t.is(currentState, 'firstStep');

  machine.next();
  currentState = machine.getState();
	t.is(currentState, 'secondStep');

  machine.next();
  currentState = machine.getState();
	t.is(currentState, 'thirdStep');

  machine.next();
  currentState = machine.getState();
	t.is(currentState, 'fourthStep');

  machine.previous();
  currentState = machine.getState();
	t.is(currentState, 'thirdStep');

  machine.previous();
  currentState = machine.getState();
	t.is(currentState, 'secondStep');

  machine.previous();
  currentState = machine.getState();
	t.is(currentState, 'firstStep');
});