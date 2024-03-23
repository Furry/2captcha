import * as Captcha from "../dist/index.js";
import dotenv from "dotenv";
import fs from "fs";
import chai from "chai";
import fetch from "node-fetch";

const { expect } = chai;

dotenv.config();



function createUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0;
        var v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// (async () => {
//     const solver = new Captcha.Solver(process.env.TOKEN);

//     const data = await fetch("https://2captcha.com/demo/geetest").then((res) => res.json());

//     // Using geetest's official demo (https://geetest.com/en/demo)
//     const result = await solver.geetest(data.gt, data.challenge, "https://2captcha.com/demo/geetest")
//     console.log(result);
//     // const result = await solver.geetestv4("050cffef4ae57b5d5e529fea9540b0d1", "https://www.geetest.com/en/demo");
// })()

// describe("geetest", async () => {
//     const solver = new Captcha.Solver(process.env.TOKEN);

//     // Using geetest's official demo (https://geetest.com/en/demo)
//     const result = await solver.geetestv4("050cffef4ae57b5d5e529fea9540b0d1", "https://www.geetest.com/en/demo");

//     console.log(result);

//     // solver.geetest(createUUID(), )
// });