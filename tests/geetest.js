const Captcha = require("../dist/index.js");
const Solver = new Captcha.Solver(process.argv[2]);

Solver.geetest("d7e36de8f91fae3768e8f4fadfa3bf1f", "2bc0c39f85b8c44acb70971f5581e38e", "https://marketplace.axieinfinity.com/profile/dashboard")
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
})