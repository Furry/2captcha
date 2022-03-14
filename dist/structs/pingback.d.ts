import { Solver } from "./solver.js";
import { Locale } from "../utils/locale.js";
export declare type PingbackEvents = "solve" | "error";
export declare class PingbackClient {
    private _solver;
    private _rest;
    private _serverToken;
    private listeners;
    constructor(token: string, serverToken: string, locale?: Locale);
    /**
     * Get the solver instance used by this pingback instance.
     */
    get solver(): Solver;
    on(event: PingbackEvents, listener: (...args: any[]) => void): this;
    listen(): Promise<void>;
}
//# sourceMappingURL=pingback.d.ts.map