import * as Captcha from "../dist/index.js";
import dotenv from "dotenv";
import fs from "fs";
import chai from "chai";

const { expect } = chai;

dotenv.config();

describe("Image Captcha Test", () => {
    it("Should return a captcha with the characters '263S2V'", async () => {
        const solver = new Captcha.Solver(process.env.TOKEN);

        // Read the image as a base64 string from "./resources/testImage.png"
        const b64Image = fs.readFileSync("./test/resources/testImage.png", "base64");
        const bufferImage = Buffer.from(b64Image, "base64");

        const results = await Promise.all([
            // Attempt with both base64 and a buffer.
            solver.imageCaptcha(bufferImage),
            solver.imageCaptcha(b64Image),
        ]);

        expect(
            results.filter(x => x.data == "263S2V").length
        ).to.equal(2);
    });
})