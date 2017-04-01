# Maquina.js, a javascript Finite State Machine (FSM)


[![Build Status](https://travis-ci.org/josestbernard/maquina-js.svg?branch=master)](https://travis-ci.org/josestbernard/maquina-js)

>A finite-state machine (FSM) is a mathematical model of computation. It is an abstract machine that can be in exactly one of a finite number of states at any given time. The FSM can change from one state to another in response to some external inputs; the change from one state to another is called a transition. A FSM is defined by a list of its states, its initial state, and the conditions for each transition. -- <cite>Wikipedia</cite>

![FSM](https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/DFAexample.svg/500px-DFAexample.svg.png)

## installation

```bash
npm install --save maquina-js
```
## basic usage
```javascript
const StateMachine = require('maquina-js');
const states = ['solid', 'liquid', 'gas', 'plasma'];

  const transitions = [
    { trigger: 'melt', source: 'solid', target: 'liquid' },
    { trigger: 'freeze', source: 'liquid', target: 'solid' },
    { trigger: 'evaporate', source: 'liquid', target: 'gas' },
  ];

  machine = new StateMachine(states, transitions, 'solid');

  machine.getState(); // -> solid
  machine.melt();
  machine.getState(); // -> liquid

```

## adding and removing transitions

After creating your FSM you are still able to add more transitions.

```javascript
machine.addTransition({ trigger: 'sublimate', source: 'solid', target: 'gas' });
machine.removeTransition('sublimate');
```

Since it is allowed to have the same transition name for different states, sometimes
you will want to specify the state from which you want to remove the transition

```javasciprt
machine.removeTransition('sublimate', 'solid');
```

## adding and removing states

```javascript
machine.addStatete('StateX');
machine.removeState('StateX');
```

Every time a state is removed from the machine, all tranitions to and from that state are automatically removed.

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

machine.addTransition( { trigger: 'sublimate', source: 'solid', target: 'gas', before: beforeTransition, after: afterTransition } );
```

Inspired by [transitions](https://github.com/tyarkoni/transitions)


