const promiseMap = {};

promiseMap["test1"] = new Promise(() => {});

promiseMap["test1"].then((data) => {
    console.log(`Completed! Data: ${data}`);
});

setTimeout(() => {
    promiseMap["test1"].resolve("Hello, world uwu");
}, 5000);