import * as Captcha from "../dist/index.js";
import dotenv from "dotenv";
import fs from "fs";
import chai from "chai";
import { it } from "mocha";

const { expect } = chai;

describe("Recaptcha Test", () => {
    dotenv.config();
    const solver = new Captcha.Solver(process.env.TOKEN);
    it("Should return a solve for the recaptcha", async () => {
        // Using https://patrickhlauke.github.io/recaptcha/ for v2
        const result = await solver.recaptchaV2("6Ld2sf4SAAAAAKSgzs0Q13IZhY02Pyo31S2jgOB5", "https://patrickhlauke.github.io/recaptcha/");

        expect(result.solution.gRecaptchaResponse.length).to.be.greaterThan(64);
        expect(result.solution.token.length).to.be.greaterThan(64);
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
            expect(e.code).to.equal("ERROR_CAPTCHA_UNSOLVABLE");
        }
    })
})

describe("hCaptcha Test", () => {
    const solver = new Captcha.Solver(process.env.TOKEN);

    it("Should return a solve", async () => {
        const response = await solver.hcaptcha("e1715201-770b-4f61-87da-523133844aec", "https://vastus.github.io/login");
        expect(response.solution.token.length).to.be.greaterThan(64);
    })

    it("Should error for invalid key", async () => {
        try {
            await solver.hcaptcha("Invalid Key", "https://vastus.github.io/login");
        } catch (e) {
            expect(e.code).to.equal("ERROR_BAD_PARAMETERS");
        }
    })
})

describe("Lemin Test", async () => {
    dotenv.config();
    const solver = new Captcha.Solver(process.env.TOKEN);

    it("Should return a solve", async () => {
        // const response = await solver.leminPuzzle("https://2captcha.com/demo/lemin", "CROPPED_3dfdd5c_d1872b526b794d83ba3b365eb15a200b", "lemin-cropped-captcha");
        const response = await solver.leminPuzzle("https://2captcha.com/demo/lemin", "CROPPED_3dfdd5c_d1872b526b794d83ba3b365eb15a200b", "lemin-cropped-captcha")

        expect(response.solution.answer.length).to.be.greaterThan(64);
        expect(response.solution.challenge_id.length).to.be.greaterThan(10);
    })

    it("Should error for invalid key", async () => {
        try {
            await solver.leminPuzzle("https://2captcha.com/demo/lemin", "CROPPED_3dfdd5c_d1872b526b794d83ba3b365eb15a200bawdaawdad", "lemin-cropped-captcha", false);
        } catch (e) {
            expect(["ERROR_KEY_DOES_NOT_EXIST", "ERROR_CAPTCHA_UNSOLVABLE"]).to.include(e.code);
        }
    })
})

describe("KeyCaptcha Test", () => {
    dotenv.config();
    const solver = new Captcha.Solver(process.env.TOKEN)

    it("Should return a solve", async () => {
        const response = await solver.keycaptcha(false, {
            s_s_c_user_id: 184015,
            s_s_c_session_id: "9ff29e0176e78eb7ba59314f92dbac1b",
            s_s_c_web_server_sign: "964635241a3e5e76980f2572e5f63452",
            s_s_c_web_server_sign2: "3ca802a38ffc5831fa293ac2819b1204",
            websiteURL: "https://2captcha.com/demo/keycaptcha"
        })

        expect(response.solution.token.length).to.be.greaterThan(64);
    })
})

describe("MtCaptcha Test", () => {
    dotenv.config();
    const solver = new Captcha.Solver(process.env.TOKEN);

    it("Should return a solve", async () => {
        const response = await solver.mtCaptcha("https://2captcha.com/demo/mtcaptcha", "MTPublic-KzqLY1cKH");

        expect(response.solution.answer.length).to.be.greaterThan(64);
    })
})


