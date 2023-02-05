const Captcha = require("../dist/index.js");
require('dotenv').config();
const APIKEY = process.env.APIKEY
const solver = new Captcha.Solver(APIKEY);

solver.recaptcha({
    pageurl: 'https://2captcha.com/demo/recaptcha-v2',
    googlekey: '6LfD3PIbAAAAAJs_eEHvoOl75_83eXSqpPSRFJ_u'
})
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
})