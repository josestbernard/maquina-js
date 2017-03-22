const StateMachine = function(states, transitions, initialState = null) {
	this.state = initialState;
	this.states = states;

	this.transitions =transitions;

	this.transitions.forEach((t) => {
		// Create transitions closures
		this[t.trigger] = () => {
			console.log('executing trigger:', t.trigger);
			if(t.source !== this.state ) {
				console.error(`invalid transition: ${this.state} -> ${t.target}`);
				return false;
			}
			console.log(`${this.state} -> ${t.target}`);
			this.state = t.target;
			return true;
		}
	});

	this.initialize = (initialState) => {
		if(this.state) {
			console.error('Machine is already initialized to:', this.state);
			return false;
		}

		if(this.states.includes(initialState)) {
			this.state=initialState;
		}
		else {
			console.error(`error initializing state maching, state:${initialState} is not part of ${this.states}`);
			return false;
		}
		return true;
	}

	this.getState = () => this.state;

	return this;
};

module.exports = StateMachine;
