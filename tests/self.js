import * as Captcha from "../dist/index.js";
import denv from "dotenv";

import * as fs from "fs";
import * as path from "path";

denv.config();

(async () => {


    const solver = new Captcha.Solver(process.env.TOKEN);
    // const pingback = new Captcha.Pingback(process.env.TOKEN);

    
    const x = await solver.imageCaptcha(fs.readFileSync("resources/testImage.png").toString("base64"));
    console.log(x);
    // await pingback.listen();
})();