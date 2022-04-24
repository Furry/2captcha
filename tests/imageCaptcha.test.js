const Captcha = require("../");
require("dotenv").config();

test("Test imageCaptcha function.", async () => {
    const solver = new Captcha.Solver(process.env.TOKEN);
    const solution = "263S2V";

    return Promise.all([
        solver.imageCaptcha("./resources/testImage.png"),
    ]).then((captchas) => {
        expect(captchas.map(x => x.data)).toEqual(expect.arrayContaining([solution]));
    })
})