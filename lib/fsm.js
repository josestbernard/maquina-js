const Log = require('log')
const log = new Log();

const MaquinaError = (message) => {
	const e = new Error('MaquinaError');
	e.message = message;
	return e;
}

function isValidIdentifier(id) { return /[a-zA-Z_$]/.test(id) } // TODO: check for reserved words etc.

const StateMachine = function (states, transitions = [], initialState = null) {
	this.state = initialState;  // TODO: validate it's part of states[]
	this.transitions = [];
	this.states = [];

	this.initialize = (initialState) => {
		if (this.state) {
			log.error(`state machine is already initialized (current state: ${this.state})`);
			return false;
		}
		else {
			if (!this.states.includes(initialState)) {
				throw MaquinaError('invalid initial state');
			}
			this.state = initialState;
		}
		return true;
	}

	this.isValidTransition = (t) => {
		return typeof t === 'object'
			&& this.states.includes(t.source)
			&& this.states.includes(t.target)
			&& this[t.trigger] === undefined
			&& isValidIdentifier(t.trigger)
			&& (!t.before || typeof t.before === 'function')
			&& (!t.after || typeof t.after === 'function');
	}

	this.isValidState = (s) => {
		return !this.states.includes(s)
			&& typeof s === 'string'
	}

	this.getState = () => this.state;

	this.addTransition = (t) => {
		if (!this.isValidTransition(t)) {
			log.error('can not add invalid transition', t);
			return false;
		}
		this.transitions.push(t);
		this[t.trigger] = () => {
			if (t.before) {
				const o = t.before();
				if (typeof o !== 'boolean') {
					log.error('Invalid before hook output: expected boolean, got:', typeof o);
					throw MaquinaError(`invalid before hook for trigger: ${t.trigger}`);
				}
				if (!t.before()) {
					log.debug(`before hook failed for trigger ${t.trigger}`);
					return false;
				}
			}
			log.info(`executing trigger: ${t.trigger}`);

			if (t.source !== this.state) {
				log.error(`invalid trigger for ${this.state}: ${t.trigger}`);
				return false;
			}

			log.info(`${this.state} -> ${t.target}`);
			this.state = t.target;

			if (t.after) {
				t.after();
			}
			return true;
		}
	}

	this.addState = (s) => {
		if (!this.isValidState(s)) {
			log.error('invalid state', s);
			return false;
		}
		this.states.push(s);
		return true;
	}

	this.removeState = (s) => {
		const stateIndex = this.states.findIndex((x) => x === s);

		if (stateIndex > -1) {
			this.states.slice(stateIndex, 1);
			return true;
		}

		const transitionsToPrune = this.transitions.filter(
			(t) => t.source === s || t.target === s
		);

		transitionsToPrune.forEach((t) => removeTransition(t.trigger));

	}

	this.removeTransition = (trigger) => {
		const transitionIndex = this.transitions.findIndex((t) => t.trigger === trigger);
		if (transitionIndex > -1) {
			this[trigger] = undefined;
			this.transitions.slice(transitionIndex, 1);
		}
	}

	// initialize states and transitions
	let i;
	for (i = 0; i < states.length; i++) {
		this.addState(states[i]);
	}

	for (i = 0; i < transitions.length; i++) {
		this.addTransition(transitions[i]);
	}

	if (initialState && !this.states.includes(initialState)) {
		throw MaquinaError('invalid initial state');
	}

	this.state = initialState;

	return this;
};

module.exports = StateMachine;
