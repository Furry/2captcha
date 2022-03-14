const Captcha = require("../");
require("dotenv").config();

test("Get the balance of the account.", () => {
    const solver = new Captcha.Solver(process.env.TOKEN);

    return solver.balance().then(balance => {
        expect(balance).toBeGreaterThan(0);
    });
})