const Captcha = require("../dist/index.js");
require('dotenv').config();
const APIKEY = process.env.APIKEY
const solver = new Captcha.Solver(APIKEY);

solver.geetestV4({
    pageurl: 'https://2captcha.com/demo/geetest-v4',
    captcha_id: 'e392e1d7fd421dc63325744d5a2b9c73'
})
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
})