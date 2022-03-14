/// <reference types="node" resolution-mode="require"/>
import { Solver } from "./solver.js";
import { EventEmitter } from "events";
import { Locale } from "../utils/locale.js";
export declare class PingbackClient extends EventEmitter {
    private _solver;
    constructor(token: string, locale?: Locale);
    /**
     * Get the solver instance used by this pingback instance.
     */
    get solver(): Solver;
}
//# sourceMappingURL=pingback.d.ts.map