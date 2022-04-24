import * as Captcha from "../dist/index.js";
import denv from "dotenv";

import * as fs from "fs";
import * as path from "path";

denv.config();

(async () => {


    const solver = new Captcha.Solver(process.env.TOKEN);
    // const pingback = new Captcha.Pingback(process.env.TOKEN);
    const p = path.join(path.dirname(import.meta.url), "resources/testImage.png").substring(6);
    const base64Image = fs.readFileSync(p).toString("base64");

    const x = await Promise.all([
        solver.imageCaptcha(base64Image),
        solver.imageCaptcha(base64Image),
        solver.imageCaptcha(base64Image),
        solver.imageCaptcha(base64Image),
        solver.imageCaptcha(base64Image)
    ]);

    console.log(x);
})();