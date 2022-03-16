import * as Captcha from "../dist/index.js";
import denv from "dotenv";

import * as fs from "fs";
import * as path from "path";

// Dev
import * as ngrok from "ngrok";
import * as tunnel from "tunnel";

denv.config();

// ngrok.connect({
//     "addr": 8080,
// }).then(async (url) => {
//     // Create the pingback server.
//     console.log(process.env.PINGBACK)
//     const pingback = new Captcha.Pingback(process.env.TOKEN, process.env.PINGBACK, url);

//     // Allow the Pingback url
//     await pingback.solver.addPingbackDomain(url);
//     // Start the server.
//     await pingback.listen(8080)

//     const p = path.join(path.dirname(import.meta.url), "resources/testImage.png").substring(6);
//     const base64Image = fs.readFileSync(p).toString("base64");

//     // pingback.requestSolve("textCaptcha", 5, base64Image);

//     // // Log each solved captcha.
//     // pingback.on("solve", (captcha) => {
//     //     console.log(captcha);
//     // });

//     // pingback.on("error", (err) => {
//     //     console.log(err);
//     // });
// });

ngrok.connect({
    "proto": "tcp"
}).then(async (url) => {
    console.log(url);
    // const tunnelingAgent = tunnel.httpOverHttps(){
    //     proxy: 
    // }

})

// (async () => {
//     // console.log(url)
//     const pingback = new Captcha.Pingback(process.env.TOKEN, process.env.PINGBACK);

//     // Start the server.
//     await pingback.listen(8080)
// })();