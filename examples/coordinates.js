const fs = require('fs')
const TwoCaptcha = require("../dist/index.js");
require('dotenv').config();
const APIKEY = process.env.APIKEY
const solver = new TwoCaptcha.Solver(APIKEY);


const imageBase64 = fs.readFileSync("./media/hCaptchaImage.jpg", "base64")

solver.coordinates({
    body: imageBase64,
    textinstructions: 'Select all photos containing the boat'
})
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
})
