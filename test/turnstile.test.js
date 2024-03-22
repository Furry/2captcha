import * as Captcha from "../dist/index.js";
import dotenv from "dotenv";
import fs from "fs";
import chai from "chai";

const { expect } = chai;

dotenv.config();

// describe("Image Captcha Test", () => {
//     it("Should return a captcha with the characters '263S2V'", async () => {
//         const solver = new Captcha.Solver(process.env.TOKEN);

//         const result = await solver.turnstile("0x4AAAAAAAC3DHQFLr1GavRN");

//         console.log(result)
//     });
// })

(async () => {
    const solver = new Captcha.Solver(process.env.TOKEN);

    const result = await solver.turnstile("0x4AAAAAAAC3DHQFLr1GavRN");

    console.log(result)
})()