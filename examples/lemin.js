const TwoCaptcha = require("../dist/index.js");
require('dotenv').config();
const APIKEY = process.env.APIKEY
const solver = new TwoCaptcha.Solver(APIKEY);

solver.lemin({
  pageurl:'https://2captcha.com/demo/lemin', 
  captcha_id: 'CROPPED_3dfdd5c_d1872b526b794d83ba3b365eb15a200b',
  div_id: 'lemin-cropped-captcha',
  api_server: 'api.leminnow.com'
})
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
})