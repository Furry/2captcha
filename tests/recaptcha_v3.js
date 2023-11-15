const Captcha = require("../dist/index.js");
require('dotenv').config();
const APIKEY = process.env.APIKEY
const solver = new Captcha.Solver(APIKEY);

solver.recaptcha({
    pageurl: 'https://2captcha.com/demo/recaptcha-v3',
    googlekey: '6Lcyqq8oAAAAAJE7eVJ3aZp_hnJcI6LgGdYD8lge',
    version: "v3",
    min_score: "0.4",
    action: 'demo_action'
})
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
})