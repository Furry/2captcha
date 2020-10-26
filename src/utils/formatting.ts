export function appendQuery(base: string, properties: {[key: string]: string | number}): string {
    const keys = Object.keys(properties);
    if (keys.length == 0) return base;
    base += "?"
    keys.forEach((key, index) => {
        base += encodeURIComponent(key) + "=" + encodeURIComponent(properties[key])
        if (keys.length != index + 1) base += "&"
    })
    return base
}