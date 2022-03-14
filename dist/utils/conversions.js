export function toQueryString(obj) {
    if (Object.keys(obj).length === 0) {
        return "";
    }
    else {
        return "?" + Object.keys(obj)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
            .join("&");
    }
}
