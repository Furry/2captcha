# 2captcha-ts

## Description

A wrapper around the [2captcha](https://2captcha.com/?from=16653706) API. Support **reCAPTCHA V2**, **reCAPTCHA V3**, **hCaptcha**, Arkose Labs **FunCaptcha**, **image** captcha, **Geetest**, **Geetest V4**, **Yandex Smart Captcha**. 

[2captcha](https://2captcha.com/?from=16653706) is a service that solves many different types of captchas, this library serves as a wrapper around their API to bring easy, promise-based functionality to NodeJS. This libary specilizes in concurrent solves, and bulk-api usage.

### Features

- Promise based 2captcha solving
- Browser & NodeJS Support
- Uses node-fetch, a light weight http library
- Fluent typings & TS support
- Account Interaction
- Invalid Captcha reporting
- Proxy Support

## Supported captchas:

* [x] google-recaptcha (reCAPTCHA v2 / reCAPTCHA v3)
* [x] hCaptcha
* [x] Arkose Labs FunCaptcha
* [x] base64 image captchas
* [x] Geetest
* [x] Geetest v4
* [x] Yandex Smart Captcha
* [ ] Capy Puzzle
* [ ] Click Captcha
* [ ] Lemin Cropped Captcha
* [ ] Cloudflare Turnstile
* [ ] Amazon WAF Captcha
* [ ] ~~TikTok Captcha~~ (this captcha is [temporarily not supported by 2captcha](https://2captcha.com/2captcha-api#solving_tiktok?from=16653706))


<!-- ## Planned Features

- ~~Account Interaction~~
- ~~Base64 image support~~
- ~~Documentation Site~~
- Built-in Rate-Limit handling
- ~~Proxy support~~
- ~~Invalid-Captcha reporting support~~
- And many other things. -->

## Install

```sh
npm install 2captcha-ts
```
<!-- ```sh
yarn add 2captcha-ts
``` -->

## Usage


### reCAPTCHA:
```js
const Captcha = require("2captcha-ts")
// A new 'solver' instance with our API key
const solver = new Captcha.Solver("<Your 2captcha api key>")

/* Example reCAPTCHA Website */
solver.recaptcha({
  pageurl: 'https://2captcha.com/demo/recaptcha-v2',
  googlekey: '6LfD3PIbAAAAAJs_eEHvoOl75_83eXSqpPSRFJ_u'
})
.then((res) => {
  console.log(res);
})
.catch((err) => {
  console.log(err);
})
```

### hCaptcha:
```js
const Captcha = require("2captcha-ts")
const solver = new Captcha.Solver("<Your 2captcha api key>")

solver.hcaptcha({
  pageurl: "https://2captcha.com/demo/hcaptcha?difficulty=moderate",
  sitekey: "b76cd927-d266-4cfb-a328-3b03ae07ded6"
})
.then((res) => {
  console.log(res);
})
.catch((err) => {
  console.log(err);
})
```

### Arkose Labs FunCaptcha:
```js
const Captcha = require("2captcha-ts")
const solver = new Captcha.Solver("<Your 2captcha api key>")

solver.funCaptcha({
  pageurl: "https://funcaptcha.com/tile-game-lite-mode/fc/api/nojs/?pkey=804380F4-6844-FFA1-ED4E-5877CA1F1EA4&lang=en",
  publickey: "804380F4-6844-FFA1-ED4E-5877CA1F1EA4"
})
.then((res) => {
  console.log(res);
})
.catch((err) => {
  console.log(err);
})
```

### Image captcha:
```js
const Captcha = require("2captcha-ts")
const fs = require("fs")
const solver = new Captcha.Solver("<Your 2captcha api key>")

// Read from a file as base64 text
const imageBase64 = fs.readFileSync("./tests/media/imageCaptcha_6e584.png", "base64")

solver.imageCaptcha(imageBase64, { numeric: 4, min_len: 5, max_len: 5 })
.then((res) => {
  // Logs the image text
  console.log(res);
})
.catch((err) => {
  console.log(err);
})
```


### GeeTest Captcha:
```js
const Captcha = require("2captcha-ts")
const solver = new Captcha.Solver("<Your 2captcha api key>")

// Read more about `challenge` https://2captcha.com/2captcha-api#solving_geetest
solver.geetest({ 
  pageurl: 'https://2captcha.com/demo/geetest',
  gt: '81388ea1fc187e0c335c0a8907ff2625',
  challenge: '<you need to get a new challenge value each time>'
})
.then((res) => {
  console.log(res);
})
.catch((err) => {
  console.log(err);
})
```

### GeeTest V4 Captcha:
```js
const Captcha = require("2captcha-ts")
const solver = new Captcha.Solver("<Your 2captcha api key>")

solver.geetestV4({
  pageurl: 'https://2captcha.com/demo/geetest-v4',
  captcha_id: 'e392e1d7fd421dc63325744d5a2b9c73'
})
.then((res) => {
  console.log(res);
})
.catch((err) => {
  console.log(err);
})
```

### Yandex Smart Captcha:
```js
const Captcha = require("2captcha-ts")
const solver = new Captcha.Solver("<Your 2captcha api key>")

solver.yandexSmart({ 
  pageurl: "https://captcha-api.yandex.ru/demo",
  sitekey: "FEXfAbHQsToo97VidNVk3j4dC74nGW1DgdxjtNB9"
 })
.then((res) => {
  console.log(res);
})
.catch((err) => {
  console.log(err);
})
```

### Proxy:
```js
const Captcha = require("2captcha-ts")
const solver = new Captcha.Solver("<Your 2captcha api key>")

solver.recaptcha({
  pageurl: 'https://2captcha.com/demo/recaptcha-v2',
  googlekey: '6LfD3PIbAAAAAJs_eEHvoOl75_83eXSqpPSRFJ_u',
  proxy: "login:password@21.214.43.26", // The (Username : Password @ Address) of our chosen proxy
  proxytype: "HTTP" // The 'Type' of proxy, http, https, socks, ect.
})
.then((res) => {
  console.log(res)
})
.catch((err) => {
  console.error(err.message)
})
```

<!-- ## Commit Guidelines

The latest version of the code base will always be under the '**next**' branch!

- All pull requiests must provide a valid reason for the change or implementation
- All **CORE CHANGES** require an issue with reasoning made before a PR will even be addressed.
- All PR's must follow the general structure of the code base
- If you have questions, feel free to make an issue and i'll get to it right away!

<hr>
 <div style="text-align: center">
<a href="https://www.buymeacoffee.com/ether" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>
</div> -->

---

## Useful articles
* [How to bypass Geetest v4 CAPTCHA](https://2captcha.com/blog/geetest-v4-support?from=16653706)
* [Automatic ReCAPTCHA V3 resolution - a tutorial for developers and customers](https://2captcha.com/blog/recaptcha-v3-automatic-resolution?from=16653706)
* Finding Sitekey <a href="./docs/hcaptcha.md">hCaptcha</a>

---

This project is a fork of this [package](https://www.npmjs.com/package/2captcha). In this version, new types of captchas have been added and the method of passing captcha parameters has been changed ({ using an object }) and etc.
