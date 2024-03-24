import * as Captcha from "../../dist/index.js";
import dotenv from "dotenv";
import fs from "fs";
import chai from "chai";

dotenv.config();

(async () => {
    const solver = new Captcha.Solver(process.env.TOKEN);

    const result = await solver.recaptchaV2("6Ld2sf4SAAAAAKSgzs0Q13IZhY02Pyo31S2jgOB5", "https://patrickhlauke.github.io/recaptcha/");


    console.log(result)
})()