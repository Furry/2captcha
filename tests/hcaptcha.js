const Captcha = require("../dist/index.js");
require('dotenv').config();
const APIKEY = process.env.APIKEY
const solver = new Captcha.Solver(APIKEY);

solver.hcaptcha("4c672d35-0701-42b2-88c3-78380b0db560", "https://discord.com")
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
})