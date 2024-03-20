import * as Captcha from "../dist/index.js";
import dotenv from "dotenv";
import fs from "fs";
import chai from "chai";

const { expect } = chai;

dotenv.config();

describe("Audio transcription", async () => {
    it("Should return the transcription of the audio file 'pink is my favorite color'", async () => {
        const solver = new Captcha.Solver(process.env.TOKEN);

        // Read the audio file as a base64 string from "./resources/audio.mp3"
        const b64audio = fs.readFileSync("./test/resources/audio.mp3", "base64");
        const bufferAudio = Buffer.from(b64audio, "base64");

        const result = await solver.audioCaptcha(bufferAudio, "en");
        expect(result.data).to.equal("pink is my favorite color");
    })
});