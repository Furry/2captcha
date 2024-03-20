import * as Captcha from "../../dist/index.js";
import dotenv from "dotenv";
import fs from "fs";
import chai from "chai";

const { expect } = chai;

dotenv.config();

(async () => {
    const solver = new Captcha.Solver(process.env.TOKEN);

    const b64audio = fs.readFileSync("./test/resources/audio.mp3", "base64");
    
    const result = await solver.audioCaptcha(b64audio, "en");

    console.log(result)
    process.exit();
})();