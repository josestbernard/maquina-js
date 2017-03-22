const Log = require('log')
const log = new Log();

const StateMachine = function(states, transitions, initialState = null) {
	this.state = initialState;  // TODO: validate it's part of states[]
	this.states = states;  // TODO: validate structure and uniqueness

	this.transitions =transitions;  // TODO: validate structure and uniqueness

	this.transitions.forEach((t) => {
		// Create transitions closures
		this[t.trigger] = () => {
			log.info(`Executing trigger: ${t.trigger}`);
			if(t.source !== this.state ) {
				log.error(`invalid transition: ${this.state} -> ${t.target}`);
				return false;
			}
			log.info(`${this.state} -> ${t.target}`);
			this.state = t.target;
			return true;
		}
	});

	this.initialize = (initialState) => {
		if(this.state) {
			log.error(`Machine is already initialized to: ${this.state}`);
			return false;
		}

		if(this.states.includes(initialState)) {
			this.state=initialState;
		}
		else {
			log.error(`Error initializing state machine: state: ${initialState} is not part of ${this.states}`);
			return false;
		}
		return true;
	}

	this.getState = () => this.state;

	this.addTransition = (transition) => this.transitions.push(transition); // TODO: validate structure and uniqueness

	this.removeTransition = (trigger) => {
		const transitionIndex = this.transitions.findIndex((t) => t.trigger === trigger);
		this.transitions.slice(transitionIndex, 1);
	}

	return this;
};

module.exports = StateMachine;
