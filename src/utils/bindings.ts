// Imma be honest chief I have no clue how to organize this code base.
// I'm just trying to get this working.

import { Solver } from "../structs/solver.js";
import { CaptchaType } from "../types.js";
export type BindingMap = { [key: string]: CallableFunction };

export function genFunctionBindings(solver: Solver): BindingMap {
    return {
        "textCaptcha": solver.imageCaptcha,
        "imageCaptcha": solver.imageCaptcha,
    }
}