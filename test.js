const test = require('ava');
const StateMachine = require('./fsm')


let machine;


test.beforeEach('initialize', t => {
	// This runs before all tests
  const states = ["solid", "liquid", "gas"];

  const transitions = [
  	{ trigger: 'melt', source: 'solid', target: 'liquid' },
    { trigger: 'boil', source: 'liquid', target: 'gas' },
    { trigger: 'condensate', source: 'gas', target: 'water' },
  ]

  machine = new StateMachine(states, transitions, 'water');
});

test.afterEach('destroy', t => {
  machine = null;
})

test('valid trasition', t => {
  machine.melt();
  console.log('current state:', machine.getState());
	t.pass();
});

test('bar', async t => {
	const bar = Promise.resolve('bar');

	t.is(await bar, 'bar');
});
