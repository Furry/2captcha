import { Solver } from "./solver.js";
import { EventEmitter } from "events";

import L, { Locale } from "../utils/locale.js";
import { Rest } from "./rest.js";
import { CaptchaType, CaptchaTypes, GenericObject, ImageCaptchaExtras } from "../types.js";
import { genFunctionBindings } from "../utils/bindings.js";
import fetch from "../utils/platform.js";

export type PingbackEvents =
    "solve" |
    "error" |
    "info";

export class PingbackClient {
    private _solver: Solver;
    private _rest: Rest
    private _serverToken: string;
    private _pingbackAddress: string;
    private _bindings: ReturnType<typeof genFunctionBindings> = {} as any;

    private listeners: { [key: string]: CallableFunction[] } = {};

    constructor(token: string, serverToken: string, pingbackAddress: string, locale: Locale = "en") {
        this._serverToken = serverToken;
        this._solver = new Solver(token, locale);
        this._rest = new Rest(this);
        this._bindings = genFunctionBindings(this._solver);
        this._pingbackAddress = pingbackAddress;
    }

    /**
     * Get the solver instance used by this pingback instance.
     */
    public get solver(): Solver {
        return this._solver;
    }

    public get serverToken(): string {
        return this._serverToken;
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
    
    public emit(event: PingbackEvents, body: GenericObject) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(listener => listener(body));
        }
    }

    ////////////////////////
    // Pingback Functions //
    ////////////////////////
    private async addDomain() {
        // const domains = await this._solver.getPingbackDomains();
        // let x = await this.solver.addPingbackDomain(this._pingbackAddress);
        // console.log(x)
    }

    public async listen(port: number) {
        await this._rest.listen(port);
        // Verify that the server is running by making a request to the pingback server.
        const r = await fetch(this._pingbackAddress + "/2captcha.txt").then((res) => res.text());

        if (r != this._serverToken) {
            throw new Error("Sever token could not be read on loopback.");
        } else {
            console.log("Success!")
        }

        console.log("Adding Pingback Domain..")
        await this.addDomain();

    }

    // End Overloads
    public requestSolve<Key extends keyof CaptchaTypes>(which: Key, count: number, ...args: CaptchaTypes[])  {
        const callable: CallableFunction = this._bindings[which];
        let extra = {} as GenericObject;
        if (!callable) {
            throw new Error(`Invalid captcha type: ${which}`);
        }

        // Check to see if the last element of the args is an object.
        if (args[args.length - 1] instanceof Object) {
            extra = args[args.length - 1] as any;
            args.pop();
        };

        // Get the last argument of args.
        extra = {
            ...extra,
            pingback: this._pingbackAddress
        }

        for (let i = 0; i < count; i++) {
            callable([...args, extra]);
        }
    }
}