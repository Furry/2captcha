import NodeFetch from "node-fetch";

// Thanks to Alex
export = typeof window === "undefined" ? NodeFetch : fetch;