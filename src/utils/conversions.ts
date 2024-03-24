import { GenericObject } from "../types.js";
import { isNode } from "./platform.js";
import { readFileSync, existsSync } from "fs";

export function toQueryString(obj: GenericObject): string {
    if (Object.keys(obj).length === 0) {
        return "";
    } else {
        return "?" + Object.keys(obj)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent((obj as any)[key])}`)
            .join("&");
    }
}

export function fromQueryString(query: string): GenericObject {
    if (query.length === 0) {
        return {};
    } else {
        return query.substring(1)
            .split("&")
            .map(pair => pair.split("="))
            .reduce((obj: any, [key, value]) => {
                obj[key] = decodeURIComponent(value);
                return obj;
            }, {});
    }
}


export function toBase64(object: any, type: "base64" | "base64url" = "base64"): string {
    if (!isNode) {
        // If the platform isn't NodeJS, we'll assume this is a b64 string already.
        return object;
    } else if (!!Buffer && Buffer.isBuffer(object)) {
        // We know it's a buffer, so convert to b64.
        return object.toString(type);
    } else if (existsSync(object)) {
        // Only option left is a file. Read it into a buffer, and convert to b64.
        // I'm reading it to a buffer first to make sure there's no encoding issues.
        return Buffer.from(readFileSync(object, "utf8"))
            .toString(type);
    } else {
        // Hopefully it's already base64
        return object;
    }

}