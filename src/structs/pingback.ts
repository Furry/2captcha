import { Solver } from "./solver.js";
import { EventEmitter } from "events";

import L, { Locale } from "../utils/locale.js";

export class PingbackClient extends EventEmitter {
    private _solver: Solver;

    constructor(token: string, locale: Locale = "en") {
        super();

        this._solver = new Solver(token, locale);
    }

    /**
     * Get the solver instance used by this pingback instance.
     */
    public get solver(): Solver {
        return this._solver;
    }
}