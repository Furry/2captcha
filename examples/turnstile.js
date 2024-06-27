const TwoCaptcha = require("../dist/index.js");
require('dotenv').config();
const APIKEY = process.env.APIKEY
const solver = new TwoCaptcha.Solver(APIKEY);

solver.cloudflareTurnstile({
    pageurl: "https://app.nodecraft.com/login",
    sitekey: "0x4AAAAAAAAkg0s3VIOD10y4"    
})
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
})