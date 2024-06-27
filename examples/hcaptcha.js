const TwoCaptcha = require("../dist/index.js");
require('dotenv').config();
const APIKEY = process.env.APIKEY
const solver = new TwoCaptcha.Solver(APIKEY);

solver.hcaptcha({
    pageurl: "https://2captcha.com/demo/hcaptcha",
    sitekey: "b76cd927-d266-4cfb-a328-3b03ae07ded6"
})
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
})