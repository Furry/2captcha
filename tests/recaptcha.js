const Captcha = require("../dist/index.js");
const solver = new Captcha.Solver(process.argv[2]);

solver.recaptcha("6Ld2sf4SAAAAAKSgzs0Q13IZhY02Pyo31S2jgOB5", "https://patrickhlauke.github.io/recaptcha/")
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
})