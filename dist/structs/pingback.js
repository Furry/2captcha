import { Solver } from "./solver.js";
import { Rest } from "./rest.js";
import { genFunctionBindings } from "../utils/bindings.js";
import fetch from "../utils/platform.js";
export class PingbackClient {
    _solver;
    _rest;
    _serverToken;
    _pingbackAddress;
    _bindings = {};
    listeners = {};
    constructor(token, serverToken, pingbackAddress, locale = "en") {
        this._serverToken = serverToken;
        this._solver = new Solver(token, locale);
        this._rest = new Rest(this);
        this._bindings = genFunctionBindings(this._solver);
        this._pingbackAddress = pingbackAddress;
    }
    /**
     * Get the solver instance used by this pingback instance.
     */
    get solver() {
        return this._solver;
    }
    get serverToken() {
        return this._serverToken;
    }
    ///////////////////////
    // EMITTER FUNCTIONS //
    ///////////////////////
    on(event, listener) {
        if (this.listeners[event]) {
            this.listeners[event].push(listener);
        }
        else {
            this.listeners[event] = [listener];
        }
        return this;
    }
    emit(event, body) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(listener => listener(body));
        }
    }
    ////////////////////////
    // Pingback Functions //
    ////////////////////////
    async addDomain() {
        // const domains = await this._solver.getPingbackDomains();
        let x = await this.solver.addPingbackDomain(this._pingbackAddress);
        console.log(x);
    }
    async listen(port) {
        await this._rest.listen(port);
        // Verify that the server is running by making a request to the pingback server.
        const r = await fetch(this._pingbackAddress + "/2captcha.txt").then((res) => res.text());
        if (r != this._serverToken) {
            throw new Error("Sever token could not be read on loopback.");
        }
        else {
            console.log("Success!");
        }
        console.log("Adding Pingback Domain..");
        await this.addDomain();
    }
    // End Overloads
    requestSolve(which, count, ...args) {
        const callable = this._bindings[which];
        let extra = {};
        if (!callable) {
            throw new Error(`Invalid captcha type: ${which}`);
        }
        // Check to see if the last element of the args is an object.
        if (args[args.length - 1] instanceof Object) {
            extra = args[args.length - 1];
            args.pop();
        }
        ;
        // Get the last argument of args.
        extra = {
            ...extra,
            pingback: this._pingbackAddress
        };
        for (let i = 0; i < count; i++) {
            callable([...args, extra]);
        }
    }
}
