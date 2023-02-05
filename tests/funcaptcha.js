const Captcha = require("../dist/index.js");
require('dotenv').config();
const APIKEY = process.env.APIKEY
const solver = new Captcha.Solver(APIKEY);

solver.funCaptcha({
    pageurl: "https://funcaptcha.com/tile-game-lite-mode/fc/api/nojs/?pkey=804380F4-6844-FFA1-ED4E-5877CA1F1EA4&lang=en",
    publickey: "804380F4-6844-FFA1-ED4E-5877CA1F1EA4"
})
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
})