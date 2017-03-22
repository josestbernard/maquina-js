# Javascript Finite State Machine (FSM)

## simple usage example
```
const StateMachine = require('maquina');
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

under construction...