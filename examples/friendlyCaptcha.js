const TwoCaptcha = require("../dist/index.js");
require('dotenv').config();
const APIKEY = process.env.APIKEY
const solver = new TwoCaptcha.Solver(APIKEY);

solver.friendlyCaptcha({
    pageurl: "https://geizhals.de/?liftban=1&from=/455973138?fsean=5901747021356",
    sitekey: "FCMST5VUMCBOCGQ9"
})
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);   
})