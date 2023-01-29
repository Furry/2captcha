const Captcha = require("../dist/index.js");
require('dotenv').config();
const APIKEY = process.env.APIKEY
const Solver = new Captcha.Solver(APIKEY);

Solver.yandexSmart("FEXfAbHQsToo97VidNVk3j4dC74nGW1DgdxjtNB9", "https://captcha-api.yandex.ru/demo")
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
})