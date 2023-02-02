# 2captcha-js

![Size](https://img.shields.io/bundlephobia/min/2captcha)
![Downloads](https://img.shields.io/npm/dw/2captcha-js)

A wrapper around the 2captcha API.

## Info
<h3>
<ul>
    <li>Finding Sitekeys
        <ul>
            <li><a href="./docs/hcaptcha.md">hCaptcha</a></li>
        </ul>
    </li>
</ul>
</h3>

<hr>

## Motive

2captcha is a service that solves many different types of captchas, this library serves as a wrapper around their API to bring easy, promise-based functionality to NodeJS. This libary specilizes in concurrent solves, and bulk-api usage. This project is a fork of this [package](https://www.npmjs.com/package/2captcha).

## Features

- Promise based 2captcha solving
- Browser & NodeJS Support
- Uses node-fetch, a light weight http library
- Fluent typings & TS support
- Account Interaction
- Invalid Captcha reporting
- Proxy Support

Supported captchas:

* [x] google-recaptcha (reCAPTCHA v2 / reCAPTCHA v3),
* [x] hCaptcha,
* [x] FunCaptcha,
* [x] base64 image captchas
* [x] Geetest
* [ ] Geetest v4
* [x] Yandex Smart Captcha
* [ ] Capy Puzzle
* [ ] Lemin Cropped Captcha
* [ ] Cloudflare Turnstile
* [ ] Amazon WAF Captcha
* [ ] ~~TikTok Captcha~~ (this captcha is temporarily not supported by 2captcha)


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
npm install 2captcha-js
```
<!-- ```sh
yarn add 2captcha-js
``` -->

## Usage


### reCAPTCHA:
```js
const Captcha = require("2captcha-js")

// A new 'solver' instance with our API key
const solver = new Captcha.Solver("<Your 2captcha api key>")

/* Example reCAPTCHA Website */
solver.recaptcha("6Ld2sf4SAAAAAKSgzs0Q13IZhY02Pyo31S2jgOB5", "https://patrickhlauke.github.io/recaptcha/")

.then((res) => {
    console.log(res)
})
.catch((err) => {
    console.error(err.message)
})
```

### Image captcha:
```js
const Captcha = require("2captcha-js")
const fs = require("fs")

const solver = new Captcha.Solver("<Your 2captcha api key>")

// Read from a file as base64 text
solver.imageCaptcha(fs.readFileSync("./captcha.png", "base64"))
.then((res) => {
    // Logs the image text
    console.log(res)
})
.catch((err) => {
    console.error(err.message)
})
```

### Proxy:
```js
const Captcha = require("2captcha-js")

const solver = new Captcha.Solver("<Your 2captcha api key>")


solver.recaptcha("6Ld2sf4SAAAAAKSgzs0Q13IZhY02Pyo31S2jgOB5", "https://patrickhlauke.github.io/recaptcha/", {
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

### GeeTest:
```js
const Captcha = require("2captcha-js")

const solver = new Captcha.Solver("<Your 2captcha api key>")


solver.geetest("d7e36de8f91fae3768e8f4fadfa3bf1f", "2bc0c39f85b8c44acb70971f5581e38e", "https://marketplace.axieinfinity.com/profile/dashboard")
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
})
```

### Yandex Smart Captcha:
```js
const Captcha = require("2captcha-js")

const solver = new Captcha.Solver("<Your 2captcha api key>")

// Warning: method argument is an object
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
