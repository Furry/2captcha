const Captcha = require("../");

test("Verifies the Locale Configurations.", () => {
    // Uses the 2captcha API & Logging. (Also Default)
    const solver_en = new Captcha.Solver("token", "en");
    const pingback_en = new Captcha.Pingback("token", "en");

    // Uses the RuCaptcha API & Logging.
    const solver_ru = new Captcha.Solver("token", "ru");
    const pingback_ru = new Captcha.Pingback("token", "ru");
})