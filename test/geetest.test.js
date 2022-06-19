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

describe("hCaptcha Test", () => {
    const solver = new Captcha.Solver(process.env.TOKEN);

    // ! This test doesn't work, unsure why.
    // it("Should return a solve for the hcaptcha", async () => {
    //     // Using https://www.geetest.com/en/demo for geetest

    //     // Grab a fresh challenge.
    //     const r = await fetch(`https://www.geetest.com/demo/gt/register-enSlide-official?t=${Date.now()}`)
    //         .then((r) => r.json());
        
    //     const captcha = await solver.geetest("050cffef4ae57b5d5e529fea9540b0d1", r.gt, "https://www.geetest.com/en/demo")
    //     console.log(captcha);
    // });
});