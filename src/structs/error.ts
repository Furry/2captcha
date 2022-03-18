import { Locale } from "../utils/locale.js";

export class SolverError extends Error {
    constructor(message: string, locale: Locale) {
        super(message);
        this.name = "Error";
    }

    public get message(): string {
        return this.message;
    }

    public static from(err: string, locale: Locale) {
        return new SolverError(err, locale);
    }
}