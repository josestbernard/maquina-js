# Javascript Finite State Machine (FSM)

Inspired by [transitions](https://github.com/tyarkoni/transitions)

## simple usage example
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