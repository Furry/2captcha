const promiseMap = {};
promiseMap["test1"] = {}

promiseMap["test1"].promise = new Promise((resolve) => {
  promiseMap["test1"].resolve = resolve
});

promiseMap["test1"].promise.then((data) => {
    console.log(`Completed! Data: ${data}`);
});

setTimeout(() => {
    promiseMap["test1"].resolve("Hello, world!");
}, 5000);