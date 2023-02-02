const Captcha = require("../dist/index.js");
require('dotenv').config();
const APIKEY = process.env.APIKEY
const Solver = new Captcha.Solver(APIKEY);


Solver.yandexSmart({ pageurl: "https://captcha-api.yandex.ru/demo", sitekey: "FEXfAbHQsToo97VidNVk3j4dC74nGW1DgdxjtNB9" })
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
})