var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Solver } from "./solver.js";
import { Rest } from "./rest.js";
import { genFunctionBindings } from "../utils/bindings.js";
import fetch from "../utils/platform.js";
export class PingbackClient {
    constructor(token, serverToken, pingbackAddress, locale = "en") {
        this._bindings = {};
        this.listeners = {};
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
    addDomain() {
        return __awaiter(this, void 0, void 0, function* () {
            // const domains = await this._solver.getPingbackDomains();
            let x = yield this.solver.addPingbackDomain(this._pingbackAddress);
            console.log(x);
        });
    }
    listen(port) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._rest.listen(port);
            // Verify that the server is running by making a request to the pingback server.
            const r = yield fetch(this._pingbackAddress + "/2captcha.txt").then((res) => res.text());
            if (r != this._serverToken) {
                throw new Error("Sever token could not be read on loopback.");
            }
            else {
                console.log("Success!");
            }
            console.log("Adding Pingback Domain..");
            yield this.addDomain();
        });
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
        extra = Object.assign(Object.assign({}, extra), { pingback: this._pingbackAddress });
        for (let i = 0; i < count; i++) {
            callable([...args, extra]);
        }
    }
}
