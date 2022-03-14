import { GenericObject } from "../types.js";

export function toQueryString(obj: GenericObject): string {
    if (Object.keys(obj).length === 0) {
        return "";
    } else {
        return "?" + Object.keys(obj)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent((obj as any)[key])}`)
            .join("&");
    }
}