import { Solver } from "./solver.js";
import { Locale } from "../utils/locale.js";
import { CaptchaTypes, GenericObject } from "../types.js";
export declare type PingbackEvents = "solve" | "error" | "info";
export declare class PingbackClient {
    private _solver;
    private _rest;
    private _serverToken;
    private _pingbackAddress;
    private _bindings;
    private listeners;
    constructor(token: string, serverToken: string, pingbackAddress: string, locale?: Locale);
    /**
     * Get the solver instance used by this pingback instance.
     */
    get solver(): Solver;
    on(event: PingbackEvents, listener: (...args: any[]) => void): this;
    emit(event: PingbackEvents, body: GenericObject): void;
    private addDomain;
    listen(port: number): Promise<void>;
    requestSolve<Key extends keyof CaptchaTypes>(which: Key, count: number, ...args: CaptchaTypes[]): void;
}
//# sourceMappingURL=pingback.d.ts.map