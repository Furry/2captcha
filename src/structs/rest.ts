import * as http from "http";
import * as https from "https";
import { Pingback } from "../index.js";

export class Rest {
    // A Restful API to facilitate pingback requests.
    private _port: number;
    private _pingback: Pingback;

    constructor(pingback: Pingback, port: number) {
        // Check to make  sure we're on Node.
        if (typeof process === "undefined") {
            throw new Error("The Rest & Pingback API is only available on Node.js.");
        }

        this._pingback = pingback;
        this._port = port;
    }

    public async handleRequest(req: http.IncomingMessage, res: http.OutgoingMessage) {
        if (req.url === "/2captcha.txt") {
            // Handle pingback requests.
            return this._pingback;
        }
    }

    public listen(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            // Listen for incoming requests.
            http.createServer((req, res) => {
                this.handleRequest(req, res);
            }).listen(this._port,  () => {
                return resolve();
            });
        })
    }
}