import * as Captcha from "../../dist/index.js";
import dotenv from "dotenv";
import fs from "fs";
import chai from "chai";

dotenv.config();

(async () => {
    const solver = new Captcha.Solver(process.env.TOKEN);

    const result = await solver.textCaptcha("If tomorrow is Saturday, what day is today? (Case Sensitive)");
    console.log(result);
})()