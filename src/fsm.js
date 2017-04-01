const debug = require('debug')('maquina-js')

const MaquinaError = (message) => {
  const e = new Error('MaquinaError');
  e.message = message;
  return e;
}

function isValidIdentifier(id) { return /[a-zA-Z_$]/.test(id) } // TODO: check for reserved words etc.

function transitionExists(t, machineTransitions) {
  if (machineTransitions[t.trigger]) {
    if (machineTransitions[t.trigger].some((element) => element.source === t.source)) {
      debug(`error: trigger ${t.trigger} already exists for state ${t.source}`)
      return true
    }
  }
  return false
}

const StateMachine = function (states, transitions = {}, initialState = null) {
  this.transitions = {};
  this.states = [];

  this.initialize = (initialState) => {
    if (this.state) {
      debug(`error: state machine is already initialized (current state: ${this.state})`);
      return false;
    }
    else {
      if (this.states.indexOf(initialState) === -1) {
        throw MaquinaError('invalid initial state');
      }
      this.state = initialState;
    }
    return true;
  }


  // validations
  this.isValidTransition = (t) => {
    return typeof t === 'object'
      && this.states.indexOf(t.source) > -1
      && this.states.indexOf(t.target) > -1
      && isValidIdentifier(t.trigger)
      && !transitionExists(t, this.transitions)
      && (!t.before || typeof t.before === 'function')
      && (!t.after || typeof t.after === 'function');
  }

  this.isValidState = (s) => {
    return this.states.indexOf(s) === -1
      && typeof s === 'string'
  }

  // getters

  this.getState = () => this.state;

  // add and remove methods
  this.addTransition = (t) => {
    if (!this.isValidTransition(t)) {
      debug('error: can not add invalid transition', t);
      return false;
    }

    if (!this.transitions[t.trigger]) {
      this.transitions[t.trigger] = [];
    }
    this.transitions[t.trigger].push(t); // TODO: remove trigger prop
    debug(`adding transition ${t.trigger} to ${t.source}`);
    this[t.trigger] = () => {
      const transitionsArray = this.transitions[t.trigger];
      const transitionToRun = transitionsArray.find((element) => element.source === this.state);

      if (!transitionToRun) {
        debug(`error: invalid trigger for ${this.state}: ${t.trigger}`);
        return false;
      }

      if (transitionToRun.before) {
        const beforeResult = transitionToRun.before();
        if (typeof beforeResult !== 'boolean') {
          debug('error: Invalid before hook output: expected boolean, got:', typeof beforeResult);
          throw MaquinaError(`invalid before hook for trigger: ${t.trigger}`);
        }
        if (beforeResult === false) {
          debug(`before hook failed for trigger ${t.trigger}`);
          return false;
        }
      }
      debug(`executing trigger: ${t.trigger}`);

      debug(`${this.state} -> ${transitionToRun.target}`);
      this.state = transitionToRun.target;

      if (transitionToRun.after) {
        transitionToRun.after();
      }
      return true;
    }
  }

  this.addState = (s) => {
    if (!this.isValidState(s)) {
      debug('error: invalid state', s);
      return false;
    }
    this.states.push(s);
    return true;
  }

  this.removeState = (s) => {
    const stateIndex = this.states.findIndex((x) => x === s);
    if (stateIndex === -1) {
      throw MaquinaError(`state ${s} not found for removal`);
    }

    // remove transitions to and from this state

    const triggers = Object.keys(this.transitions);

    triggers.forEach((t) => {
      this.transitions[t].forEach((transition) => {
        if (transition.source === s || transition.target === s) {
          this.removeTransition(t, transition.source);
        }
      })
    })

    // remove state
    debug('removing state', s);
    this.states.splice(stateIndex, 1);
    return true;
  }

  this.removeTransition = (trigger, source) => {

    // full trigger removal
    if (!source) {
      debug(`removing all transitions for trigger ${trigger}`);
      delete this.transitions[trigger];
      this[trigger] = undefined;
      return;
    }

    // state trigger removal
    debug(`removing transition ${trigger} from ${source}`);

    const transitionsArray = this.transitions[trigger];
    const transitionIndex = transitionsArray.findIndex((element) => element.source === source)

    if (transitionIndex > -1) {
      this.transitions[trigger].splice(transitionIndex, 1);
    }
  }

  // setup states and transitions
  let i;
  for (i = 0; i < states.length; i++) {
    this.addState(states[i]);
  }

  for (i = 0; i < transitions.length; i++) {
    this.addTransition(transitions[i]);
  }

  if (initialState && this.states.indexOf(initialState) === -1) {
    throw MaquinaError('invalid initial state');
  }

  // set initial state
  if (initialState) {
    this.initialize(initialState);
  }

  return this;
};

module.exports = StateMachine;
