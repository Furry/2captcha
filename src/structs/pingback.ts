import { Solver } from "./solver.js";
import { EventEmitter } from "events";

import L, { Locale } from "../utils/locale.js";
import { Rest } from "./rest.js";
import { GenericObject } from "../types.js";

export type PingbackEvents =
    "solve" |
    "error";

export class PingbackClient {
    private _solver: Solver;
    private _rest: Rest
    private _serverToken: string;

    private listeners: { [key: string]: CallableFunction[] } = {};

    constructor(token: string, serverToken: string, locale: Locale = "en") {
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

    ///////////////////////
    // EMITTER FUNCTIONS //
    ///////////////////////
    public on(event: PingbackEvents, listener: (...args: any[]) => void): this {
        if (this.listeners[event]) {
            this.listeners[event].push(listener);
        } else {
            this.listeners[event] = [listener];
        }

        return this;
    }

    public async listen() {
        await this._rest.listen();
    }
}