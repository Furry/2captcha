import { Solver } from "./solver.js";
import { EventEmitter } from "events";
export class PingbackClient extends EventEmitter {
    constructor(token, locale = "en") {
        super();
        this._solver = new Solver(token, locale);
    }
    /**
     * Get the solver instance used by this pingback instance.
     */
    get solver() {
        return this._solver;
    }
}
