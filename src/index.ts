// Handle Re-Exports of the library

import { SolverError } from "./structs/error.js";

export { Solver } from "./structs/solver.js";
export { PingbackClient as Pingback } from "./structs/pingback.js";

// import fs from "fs";
// import * as dotenv from "dotenv";
// import { Solver } from "./structs/solver.js";
// dotenv.config();
// (async () => {
//     const solver = new Solver(process.env.TOKEN as string);

//     const imageBase64 = fs.readFileSync("./test/resources/car.png", "base64");
//     const result = await solver.boundingBox(imageBase64, {
//         comment: "Draw a box around the car in this image.",
//         columns: 3,
//         rows: 3
//     });
//     console.log(result)
// })()