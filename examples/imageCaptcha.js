const fs = require('fs')
const TwoCaptcha = require("../dist/index.js");
require('dotenv').config();
const APIKEY = process.env.APIKEY
const solver = new TwoCaptcha.Solver(APIKEY);

const imageBase64 = fs.readFileSync("./media/imageCaptcha_6e584.png", "base64")

solver.imageCaptcha({
    body: imageBase64,
    numeric: 4,
    min_len: 5,
    max_len: 5,
    lang: 'en',
    textinstructions: 'Type text on the image'
})
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
})
