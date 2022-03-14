import NodeFetch from "node-fetch";

// Thanks to Alex
export default (typeof window === "undefined" ? NodeFetch : fetch);
export let isNode = (typeof window === "undefined") ? true : false;