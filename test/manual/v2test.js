import * as Captcha from "../../dist/index.js";
import dotenv from "dotenv";
import fs from "fs";
import chai from "chai";

dotenv.config();

(async () => {
    const solver = new Captcha.Solver(process.env.TOKEN);

    try {
        await solver.recaptchaV2("Invalid Key", "https://patrickhlauke.github.io/recaptcha/");
    } catch (e) {
        console.log(e)
        // expect(e.message).to.equal("ERROR_WRONG_GOOGLEKEY");
    }

    // console.log(result)
})()