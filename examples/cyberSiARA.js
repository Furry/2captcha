const TwoCaptcha = require("../dist/index.js");
require('dotenv').config();
const APIKEY = process.env.APIKEY
const solver = new TwoCaptcha.Solver(APIKEY);

solver.cyberSiARA({
    pageurl: "https://www.cybersiara.com/book-a-demo",
    master_url_id: "OXR2LVNvCuXykkZbB8KZIfh162sNT8S2",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36"
})
.then((res) => {
console.log(res);
})
.catch((err) => {
console.log(err);
})