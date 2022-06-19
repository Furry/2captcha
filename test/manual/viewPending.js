import * as Captcha from "../../dist/index.js";
import dotenv from "dotenv";
import fs from "fs";
import chai from "chai";

const { expect } = chai;

dotenv.config();

(async () => {
    const solver = new Captcha.Solver(process.env.TOKEN);

    setInterval(() => {
        console.log(solver.getPending());
    }, 500);

    // import the image from "../resources/testImage.png"
    const b64Image = fs.readFileSync("./test/resources/testImage.png", "base64");

    const cache = [];
    // for loop with 5 elements
    for (let i = 0; i < 5; i++) {
        cache.push(
            solver.imageCaptcha(b64Image)
        );
    }

    await Promise.all(cache);
    process.exit();
})();