# Javascript Finite State Machine (FSM)

Inspired by [transitions](https://github.com/tyarkoni/transitions)

## basic usage
```javascript
const StateMachine = require('maquina-js');
const states = ['solid', 'liquid', 'gas'];

  const transitions = [
    { trigger: 'melt', source: 'solid', target: 'liquid' },
    { trigger: 'boil', source: 'liquid', target: 'gas' },
    { trigger: 'condensate', source: 'gas', target: 'liquid' },
  ];

  machine = new StateMachine(states, transitions, 'solid');

  machine.getState(); // -> solid
  machine.melt();
  machine.getState(); // -> liquid

```

## adding and removing transitions

```javascript
machine.addTransition({ trigger: 'condensate', source: 'gas', target: 'liquid'});
machine.removeTransition('condensate');
```

## before and after hooks

```javascript

function beforeTransition() {
  // pre-transition code
  return true; // or false for preventing the transition from being executed
}

function afterTransition() {
  // post-transition code
  return true;
}

machine.addTransition( { trigger: 'condensate', source: 'gas', target: 'liquid', before: beforeTransition, after: afterTransition } );
```

