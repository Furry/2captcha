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
export class PingbackClient {
    constructor(token, serverToken, locale = "en") {
        this.listeners = {};
        this._serverToken = serverToken;
        this._solver = new Solver(token, locale);
        this._rest = new Rest(this, 8080);
    }
    /**
     * Get the solver instance used by this pingback instance.
     */
    get solver() {
        return this._solver;
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
    listen() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._rest.listen();
        });
    }
}
