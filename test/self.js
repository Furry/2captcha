import * as Captcha from "../dist/index.js";
import denv from "dotenv";

import * as fs from "fs";
import * as path from "path";

denv.config();

(async () => {
    const solver = new Captcha.Solver(process.env.TOKEN);
    // // const pingback = new Captcha.Pingback(process.env.TOKEN);
    // const p = path.join(path.dirname(import.meta.url), "resources/testImage.png").substring(6);
    // const base64Image = fs.readFileSync(p).toString("base64");
    // const buffer = Buffer.from(base64Image, "base64");


    // const x = await Promise.all([
    //     solver.imageCaptcha(base64Image),
    //     solver.imageCaptcha(buffer)
    // ]);

    // const y = await Promise.all([
    //     solver.recaptchaV2()
    // ])

    // console.log(x);
    const captcha = await solver.recaptchaV2("6Ld2sf4SAAAAAKSgzs0Q13IZhY02Pyo31S2jgOB5", "https://patrickhlauke.github.io/recaptcha/");

    console.log(captcha);
})();