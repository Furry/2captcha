import * as Captcha from "../dist/index.js";
import denv from "dotenv";

import * as fs from "fs";
import * as path from "path";
import * as ngrok from "ngrok";

denv.config();

ngrok.connect({
    "addr": 8080,
}).then(async (url) => {
    // Create the pingback server.
    console.log(url)
    const pingback = new Captcha.Pingback(process.env.TOKEN, process.env.PINGBACK, url);

    // Start the server.
    await pingback.listen()

    // const p = path.join(path.dirname(import.meta.url), "resources/testImage.png").substring(6);
    // const base64Image = fs.readFileSync(p).toString("base64");

    // pingback.solve("textCaptcha", 5, base64Image);

    // Log each solved captcha.
    pingback.on("solve", (captcha) => {
        console.log(captcha);
    });

    pingback.on("error", (err) => {
        console.log(err);
    });
});