import * as Captcha from "../../dist/index.js";
import dotenv from "dotenv";
import fs from "fs";
import chai from "chai";

dotenv.config();

(async () => {
    const solver = new Captcha.Solver(process.env.TOKEN);

    const imageBase64 = fs.readFileSync("./test/resources/doughnut.png", "base64");
    const result = await solver.drawAround(imageBase64, {
        comment: "Draw a circle around what does not fit in."
    });

    console.log(result)
})()