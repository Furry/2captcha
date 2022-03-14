import * as http from "http";
import * as https from "https";
import { Pingback } from "../index.js";
import { Readable, Writable } from "stream";
import { fromQueryString } from "../utils/conversions.js";

export class Rest {
    // A Restful API to facilitate pingback requests.
    private _pingback: Pingback;
    private _pingbackKey: string;

    constructor(pingback: Pingback) {
        // Check to make  sure we're on Node.
        if (typeof process === "undefined") {
            throw new Error("The Rest & Pingback API is only available on Node.js.");
        }

        this._pingback = pingback;
        this._pingbackKey = "oisdnfoiawjdoiawjda";
    }

    public async handleRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
        return new Promise((resolve) => {
            if (req.url === "/2captcha.txt") {
                res.writeHead(200);
                res.end(this._pingbackKey);
            } else if (req.url === "/pingback") {
                // Retrieve the query parameters.
                const q = fromQueryString(req.url.split("?")[1]);
                this._pingback.emit("solve", q);
            } else {
                res.writeHead(404);
                res.end();
            }

            return resolve();
        })
    }

    public listen(port: number): Promise<void> {
        return new Promise(async (resolve, reject) => {
            // Listen for incoming requests.
            http.createServer((req, res) => {
                this.handleRequest(req, res);
            }).listen(port,  () => {
                return resolve();
            });
        })
    }
}