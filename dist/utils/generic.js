"use strict";
/*
    A file fill of generic utility functions.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.objectToURI = exports.castBool = void 0;
/**
 * Changes 0 and 1 falsy/truthy values into a boolean.
 * @private
 * @param input boolean or number
 */
function castBool(input) {
    if (input == false)
        return 0;
    if (input == true)
        return 1;
    if (input != 0 && input != 1)
        return 0;
    else
        return input;
}
exports.castBool = castBool;
/**
 * Constructs uri parameters from an object
 * @private
 * @param input The input object
 */
function objectToURI(input) {
    let res = "?";
    const keys = Object.keys(input);
    keys.forEach((key, index) => {
        res += encodeURIComponent(key) + "=" + encodeURIComponent(input[key]);
        if (index + 1 != keys.length)
            res += "&";
    });
    return res;
}
exports.objectToURI = objectToURI;
/**
 * Returns a promise that resolves after x ms
 * @private
 * @param ms time to sleep for
 */
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
exports.sleep = sleep;
