/// <reference types="node" />
import { Solver } from "./solver.js";
import { EventEmitter } from "events";
export declare class PingbackClient extends EventEmitter {
    private _solver;
    constructor(token: string);
    /**
     * Get the solver instance used by this pingback instance.
     */
    get solver(): Solver;
}
//# sourceMappingURL=pingback.d.ts.map