import * as Captcha from "../dist/index.js";
import dotenv from "dotenv";
import fs from "fs";
import chai from "chai";

const { expect } = chai;

dotenv.config();

describe("hCaptcha Test", () => {
    const solver = new Captcha.Solver(process.env.TOKEN);
    it("Should return a solve for the hcaptcha", async () => {
        // Using https://vastus.github.io/login for HCaptcha
        const captcha = await solver.hcaptcha("e1715201-770b-4f61-87da-523133844aec", "https://vastus.github.io/login");
        expect(captcha.data.length).to.greaterThan(256);
    });

    it("Should error for invalid key", async () => {
        try {
            await solver.hcaptcha("Invalid Key","https://vastus.github.io/login");
        } catch (e) {
            expect(e.message).to.equal("ERROR_WRONG_GOOGLEKEY");
        }
    });
});