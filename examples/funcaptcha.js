const TwoCaptcha = require("../dist/index.js");
require('dotenv').config();
const APIKEY = process.env.APIKEY
const solver = new TwoCaptcha.Solver(APIKEY);

solver.funCaptcha({
    pageurl: "https://api.funcaptcha.com/fc/api/nojs/?pkey=69A21A01-CC7B-B9C6-0F9A-E7FA06677FFC",
    publickey: "69A21A01-CC7B-B9C6-0F9A-E7FA06677FFC",
    data: '{"blob": "foo"}'
})
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
})