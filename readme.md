<center>
    <h1>
        2captcha
    </h1>


<a href="https://discord.gg/tamVs2Ujrf">
    <img src="https://discordapp.com/api/guilds/769020183540400128/widget.png?style=banner2" alt="Discord Banner 2"/>
</a>

![Discord Shield](https://img.shields.io/github/commit-activity/m/furry/2captcha)
![Size](https://img.shields.io/bundlephobia/min/2captcha)
![Downloads](https://img.shields.io/npm/dw/2captcha)

</center>

<center>A wrapper around the 2captcha API</center>

<hr>

## Motive

2captcha is a service that solves many different types of captchas, this library serves as a wrapper around their API to bring easy, promise-based functionality to NodeJS. This libary specilizes in concurrent solves, and bulk-api usage.

## Features

- Promise based 2captcha solving
- Browser & NodeJS Support
- Uses node-fetch, a light weight http library
- Fluent typings & TS support
- Account Interaction
- Invalid Captcha reporting
- Proxy Support

Currently supports:

- google-recaptcha (v2 / v3),
- hcaptcha,
- FunCaptcha,
- base64 image captchas

## Planned Features

- ~~Account Interaction~~
- ~~Base64 image support~~
- ~~Documentation Site~~
- Built-in Rate-Limit handling
- ~~Proxy support~~
- ~~Invalid-Captcha reporting support~~
- And many other things.

## Install

```sh
npm install 2captcha
```
```sh
yarn add 2captcha
```

## Usage


Recaptcha,
```js
const Captcha = require("2captcha")

// A new 'solver' instance with our API key
const solver = new Captcha.Solver("<Your 2captcha api key>")

/* Example ReCaptcha Website */
solver.recaptcha("6Ld2sf4SAAAAAKSgzs0Q13IZhY02Pyo31S2jgOB5", "https://patrickhlauke.github.io/recaptcha/")

.then((res) => {
    console.log(res)
})
.catch((err) => {
    console.error(err.message)
})
```

Image,
```js
const Captcha = require("2captcha")
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

Proxy,
```js
const Captcha = require("2captcha")

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

## Commit Guidelines

The latest version of the code base will always be under the '**next**' branch!

- All pull requiests must provide a valid reason for the change or implementation
- All **CORE CHANGES** require an issue with reasoning made before a PR will even be addressed.
- All PR's must follow the general structure of the code base
- If you have questions, feel free to make an issue and i'll get to it right away!

<hr>
<div style="text-align: center">
<a href="https://www.buymeacoffee.com/ether" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>
</div>
