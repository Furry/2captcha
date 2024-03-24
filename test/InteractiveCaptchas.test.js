import * as Captcha from "../dist/index.js";
import dotenv from "dotenv";
import fs from "fs";
import chai from "chai";

const { expect } = chai;

describe("Recaptcha Test", () => {
    const solver = new Captcha.Solver(process.env.TOKEN);
    it("Should return a solve for the recaptcha", async () => {

        // Using https://patrickhlauke.github.io/recaptcha/ for v2
        const result = await solver.recaptchaV2("6Ld2sf4SAAAAAKSgzs0Q13IZhY02Pyo31S2jgOB5", "https://patrickhlauke.github.io/recaptcha/");

        expect(result.solution.gRecaptchaResponse).to.greaterThan(256);
    });

    it("Should error for invalid key", async () => {
        try {
            await solver.recaptchaV2("Invalid Key", "https://patrickhlauke.github.io/recaptcha/");
        } catch (e) {
            expect(e.code).to.equal("ERROR_RECAPTCHA_INVALID_SITEKEY");
        }
    });

    it("Should error for invalid url", async () => {
        try {
            await solver.recaptchaV2("6Ld2sf4SAAAAAKSgzs0Q13IZhY02Pyo31S2jgOB5", "https://example.com/");
        } catch (e) {
            expect(e.message).to.equal("ERROR_CAPTCHA_UNSOLVABLE");
        }
    })
})