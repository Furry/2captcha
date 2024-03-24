import * as Captcha from "../dist/index.js";
import dotenv from "dotenv";
import fs from "fs";
import chai from "chai";

const { expect } = chai;

describe("Image Captchas", () => {
    const solver = new Captcha.Solver(process.env.TOKEN);
    
    it("Yields correct characters", async () => {
        const textBase64 = fs.readFileSync("./test/resources/testText.png", "base64");
        
        const results = await Promise.all([
            solver.imageCaptcha(textBase64, { case: false }),
            solver.imageCaptcha(textBase64, { case: false})
        ]);

        expect(
            results.filter(x => x.solution.text.toUpperCase() == "263S2V").length
        ).to.be.greaterThan(0);
    })

    it("Parses audio", async () => {
        const audioBase64 = fs.readFileSync("./test/resources/hellothere.mp3", "base64");
        const result = await solver.audioTask(audioBase64, "en");

        expect(result.solution.token).to.equal("hello there");
    })

    it("Places a boundingbox", async () => {
        const imageBase64 = fs.readFileSync("./test/resources/doughnut.png", "base64");
        const result = await solver.boundingBox(imageBase64, {
            comment: "Draw a box around what does not fit in."
        });

        expect(result.solution.bounding_boxes).to.be.an("array");
    })

    it("Draws around an object", async () => {
        const imageBase64 = fs.readFileSync("./test/resources/doughnut.png", "base64");
        const result = await solver.drawAround(imageBase64, {
            comment: "Draw a circle around what does not fit in."
        });

        expect(result.solution.canvas).to.be.an("array");
    })

    it("Selects all chairs", async () => {
        const imageBase64 = fs.readFileSync("./test/resources/chairs.png", "base64");
        const result = await solver.gridCaptcha(imageBase64, {
            comment: "Select all chairs in this image."
        });

        expect(result.solution.click).to.be.an("array");
    })

    it("Rotates an image", async () => {
        const imageBase64 = fs.readFileSync("./test/resources/windmill.jpg", "base64");
        const result = await solver.rotateCaptcha(imageBase64, {
            angle: 90,
            comment: "Rotate this object to the correct place."
        });

        expect(result.solution.rotate).to.be.a("number");
    })
})