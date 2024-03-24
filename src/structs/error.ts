import { Locale } from "../utils/locale.js";

export class SolverError extends Error {
    constructor(message: string, public id?: number, public code?: string, locale?: Locale) {
        super(message);
        this.name = "Solver Error";
    }

    // public get message(): string {
    //     console.log("HIIIII")
    //     console.log(this.message)
    //     return this.message;
    // }
}

export class NetError extends Error {
    constructor(message: string, locale: Locale) {
        super(message.replace(
            /[0-9a-z]{32}/,
            Array(32).fill("*").join("")));
        this.name = "Network Error";
    }

    public get message(): string {
        return this.message;
    }
}