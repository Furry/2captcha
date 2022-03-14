"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PingbackClient = void 0;
const solver_js_1 = require("./solver.js");
const events_1 = require("events");
class PingbackClient extends events_1.EventEmitter {
    constructor(token) {
        super();
        this._solver = new solver_js_1.Solver(token);
    }
    /**
     * Get the solver instance used by this pingback instance.
     */
    get solver() {
        return this._solver;
    }
}
exports.PingbackClient = PingbackClient;
