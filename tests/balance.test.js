import Captcha from "../";

require("dotenv").config();

test("Get the balance of the account.", () => {
    const solver = new Captcha.Solver(process.env.TOKEN);

    // God I hope it's greater than 0, don't want it to fail a test because of my broke ass.
    return solver.balance().then(balance => {
        expect(balance).toBeGreaterThan(0);
    });
})