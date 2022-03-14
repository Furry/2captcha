import { Solver } from "./solver.js";
import { EventEmitter } from "events";

import L, { Locale } from "../utils/locale.js";
import { Rest } from "./rest.js";

export class PingbackClient extends EventEmitter {
    private _solver: Solver;
    private _rest: Rest
    private _serverToken: string;

    constructor(token: string, serverToken: string, locale: Locale = "en") {
        super();

        this._serverToken = serverToken;
        this._solver = new Solver(token, locale);
        this._rest = new Rest(this, 8080);
    }

    /**
     * Get the solver instance used by this pingback instance.
     */
    public get solver(): Solver {
        return this._solver;
    }
}