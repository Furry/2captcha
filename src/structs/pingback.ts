import { Solver } from "./solver.js";
import { EventEmitter } from "events";

import L, { Locale } from "../utils/locale.js";
import { Rest } from "./rest.js";
import { CaptchaType, GenericObject } from "../types.js";
import { genFunctionBindings } from "../utils/bindings.js";
export type PingbackEvents =
    "solve" |
    "error" |
    "info";

export class PingbackClient {
    private _solver: Solver;
    private _rest: Rest
    private _serverToken: string;
    private _bindings: ReturnType<typeof genFunctionBindings> = {} as any;

    private listeners: { [key: string]: CallableFunction[] } = {};

    constructor(token: string, serverToken: string, locale: Locale = "en") {
        this._serverToken = serverToken;
        this._solver = new Solver(token, locale);
        this._rest = new Rest(this, 8080);
        this._bindings = genFunctionBindings(this._solver);
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

    ////////////////////////
    // Pingback Functions //
    ////////////////////////
    public async listen() {
        await this._rest.listen();
    }
    
    public requestSolve(type: CaptchaType, count: number, ...args: any[])  {
        const callable: CallableFunction = this._bindings[type];
        if (!callable) {
            throw new Error(`Invalid captcha type: ${type}`);
        }

        const result = await callable(...args);
    }
}