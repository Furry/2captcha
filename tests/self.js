import * as Captcha from "../dist/index.js";
import denv from "dotenv";
denv.config();

(async () => {
    const solver = new Captcha.Solver(process.env.TOKEN);
    const balance = await solver.balance();
    console.log(`Balance: ${balance}`);
})();