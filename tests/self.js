import * as Captcha from "../dist/index.js";
import denv from "dotenv";
denv.config();

(async () => {
    // const solver = new Captcha.Solver(process.env.TOKEN);
    const pingback = new Captcha.Pingback(process.env.TOKEN);

    await pingback.listen();
})();