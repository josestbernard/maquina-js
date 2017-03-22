const Log = require('log')
const log = new Log();

const StateMachine = function(states, transitions = [], initialState = null) {
	this.state = initialState;  // TODO: validate it's part of states[]
	this.states = states;  // TODO: validate structure and uniqueness
	this.transitions = [];

	this.initialize = (initialState) => {
		if(this.state) {
			log.error(`state machine is already initialized (current state: ${this.state})`);
			return false;
		}

		if(this.states.includes(initialState)) {
			this.state=initialState;
		}
		else {
			log.error(`error initializing state machine: state: ${initialState} is not part of ${this.states}`);
			return false;
		}
		return true;
	}

	this.getState = () => this.state;

	this.addTransition = (t) => {
		this.transitions.push(t); // TODO: validate structure and uniqueness
		this[t.trigger] = () => {
			if (t.before && typeof t.before === 'function') {
				if (!t.before()) {
					log.error(`before hook failed for trigger ${t.trigger}`);
					return false;
				}
			}
			log.info(`executing trigger: ${t.trigger}`);
			if(t.source !== this.state ) {
				log.error(`invalid transition: ${this.state} -> ${t.target}`);
				return false;
			}
			log.info(`${this.state} -> ${t.target}`);
			this.state = t.target;

			if (t.after && typeof t.after === 'function') {
				t.after();
			}
			return true;
		}
	}

	this.removeTransition = (trigger) => {
		const transitionIndex = this.transitions.findIndex((t) => t.trigger === trigger);
		this.transitions.slice(transitionIndex, 1);
	}

	for(let i = 0 ; i < transitions.length; i++) { // TODO: check typeof transitions
		this.addTransition(transitions[i]);
	}


	return this;
};

module.exports = StateMachine;
