import * as Captcha from "../dist/index.js";
import dotenv from "dotenv";
import fs from "fs";
import chai from "chai";

const { expect } = chai;

dotenv.config();

describe("Multi Image Test", () => {
    const solver = new Captcha.Solver(process.env.TOKEN);
    it("Should solve multiple image captchas.", async () => {
        solver
    })
})