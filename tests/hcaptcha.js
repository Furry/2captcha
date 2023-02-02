const Captcha = require("../dist/index.js");
const solver = new Captcha.Solver(process.argv[2]);

solver.hcaptcha("4c672d35-0701-42b2-88c3-78380b0db560", "https://discord.com")
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
})