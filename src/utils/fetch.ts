import nodeFetch from 'node-fetch';

export = typeof window === 'undefined' ? nodeFetch : window.fetch.bind(window)