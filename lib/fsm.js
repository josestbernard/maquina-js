'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var Log = require('log');
var log = new Log();

var MaquinaError = function MaquinaError(message) {
	var e = new Error('MaquinaError');
	e.message = message;
	return e;
};

function isValidIdentifier(id) {
	return (/[a-zA-Z_$]/.test(id)
	);
} // TODO: check for reserved words etc.

var StateMachine = function StateMachine(states) {
	var _this = this;

	var transitions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
	var initialState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

	this.state = initialState; // TODO: validate it's part of states[]
	this.transitions = [];
	this.states = [];

	this.initialize = function (initialState) {
		if (_this.state) {
			log.error('state machine is already initialized (current state: ' + _this.state + ')');
			return false;
		} else {
			if (!_this.states.includes(initialState)) {
				throw MaquinaError('invalid initial state');
			}
			_this.state = initialState;
		}
		return true;
	};

	this.isValidTransition = function (t) {
		return (typeof t === 'undefined' ? 'undefined' : _typeof(t)) === 'object' && _this.states.includes(t.source) && _this.states.includes(t.target) && _this[t.trigger] === undefined && isValidIdentifier(t.trigger) && (!t.before || typeof t.before === 'function') && (!t.after || typeof t.after === 'function');
	};

	this.isValidState = function (s) {
		return !_this.states.includes(s) && typeof s === 'string';
	};

	this.getState = function () {
		return _this.state;
	};

	this.addTransition = function (t) {
		if (!_this.isValidTransition(t)) {
			log.error('can not add invalid transition', t);
			return false;
		}
		_this.transitions.push(t);
		_this[t.trigger] = function () {
			if (t.before) {
				var o = t.before();
				if (typeof o !== 'boolean') {
					log.error('Invalid before hook output: expected boolean, got:', typeof o === 'undefined' ? 'undefined' : _typeof(o));
					throw MaquinaError('invalid before hook for trigger: ' + t.trigger);
				}
				if (!t.before()) {
					log.debug('before hook failed for trigger ' + t.trigger);
					return false;
				}
			}
			log.info('executing trigger: ' + t.trigger);

			if (t.source !== _this.state) {
				log.error('invalid trigger for ' + _this.state + ': ' + t.trigger);
				return false;
			}

			log.info(_this.state + ' -> ' + t.target);
			_this.state = t.target;

			if (t.after) {
				t.after();
			}
			return true;
		};
	};

	this.addState = function (s) {
		if (!_this.isValidState(s)) {
			log.error('invalid state', s);
			return false;
		}
		_this.states.push(s);
		return true;
	};

	this.removeState = function (s) {
		var stateIndex = _this.states.findIndex(function (x) {
			return x === s;
		});

		if (stateIndex > -1) {
			_this.states.slice(stateIndex, 1);
			return true;
		}

		var transitionsToPrune = _this.transitions.filter(function (t) {
			return t.source === s || t.target === s;
		});

		transitionsToPrune.forEach(function (t) {
			return removeTransition(t.trigger);
		});
	};

	this.removeTransition = function (trigger) {
		var transitionIndex = _this.transitions.findIndex(function (t) {
			return t.trigger === trigger;
		});
		if (transitionIndex > -1) {
			_this[trigger] = undefined;
			_this.transitions.slice(transitionIndex, 1);
		}
	};

	// initialize states and transitions
	var i = void 0;
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