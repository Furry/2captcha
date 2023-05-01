[English](README.md) | [Spanish](README.es.md) | [中国语文科](README.zh.md) | <b>[Русский](README.ru.md)</b>
<p align="center">
  <img src="https://user-images.githubusercontent.com/38065632/217352869-1f156919-1ab9-4ea2-9bbb-f4a8dcf2a9e1.jpg">
</p>

![](https://img.shields.io/npm/v/2captcha-ts)
![](https://img.shields.io/npm/l/2captcha-ts)
![](https://img.shields.io/github/last-commit/dzmitry-duboyski/2captcha-ts)


## Описание
Оболочка вокруг API сервиса [2captcha](https://2captcha.com/?from=16653706). Эта оболочка поддерживает решение следующих типов капч: reCAPTCHA V2, reCAPTCHA V3, hCaptcha, Arkose Labs FunCaptcha, image captcha, Сoordinates (Click Captcha), Geetest, Geetest V4, Yandex Smart Captcha, Lemin captcha, Amazon WAF, Cloudflare Turnstile, Capy Puzzle.

[2captcha](https://2captcha.com/?from=16653706) это сервис, который решает множество различных типов капч. Эта библиотека служит оболочкой для их API, чтобы предоставить NodeJS простую функциональность, основанную на `promise`.

## Поддерживаемые типы капч:
- ✅ google-recaptcha (reCAPTCHA v2 / reCAPTCHA v3)
- ✅ hCaptcha
- ✅ Arkose Labs FunCaptcha
- ✅ Image captchas. (`base64` format)
- ✅ Geetest
- ✅ Geetest v4
- ✅ Yandex Smart Captcha
- ✅ Lemin Cropped Captcha
- ✅ Cloudflare Turnstile
- ✅ Amazon WAF Captcha
- ✅ Capy Puzzle
- ✅ Сoordinates (Click Captcha).

## Установка

```sh
npm install 2captcha-ts
```
```sh
yarn add 2captcha-ts
```

## Примеры использования


### reCAPTCHA:
```js
const Captcha = require("2captcha-ts")
// Новый экземпляр "solver" со значением вашего ключа 2captcha API
const solver = new Captcha.Solver("<Your 2captcha api key>")

// Решение reCAPTCHA, на демо странице содержащей reCAPTCHA V2
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

// Получаем содержимое файла в формате base64
const imageBase64 = fs.readFileSync("./tests/media/imageCaptcha_6e584.png", "base64")

solver.imageCaptcha({
    body: imageBase64,
    numeric: 4,
    min_len: 5,
    max_len: 5
})
.then((res) => {
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

// Значение `challenge` является динамическим
// Читайте подробнее о `challenge` на странице https://2captcha.com/p/geetest
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

### Lemin captcha:
```js
const Captcha = require("2captcha-ts")
const solver = new Captcha.Solver("<Your 2captcha api key>")

solver.lemin({
  pageurl:'https://dashboard.leminnow.com/auth/login', 
  captcha_id: 'CROPPED_099216d_34698cb7b8574265925f493cbcb3df4d',
  div_id: 'lemin-cropped-captcha',
  api_server: 'https://api.leminnow.com/captcha/v1/cropped'
})
.then((res) => {
  console.log(res);
})
.catch((err) => {
  console.log(err);
})
```

### Cloudflare Turnstile:
```js
const Captcha = require("2captcha-ts")
const solver = new Captcha.Solver("<Your 2captcha api key>")

solver.cloudflareTurnstile({
    pageurl: "https://app.nodecraft.com/login",
    sitekey: "0x4AAAAAAAAkg0s3VIOD10y4"    
})
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
})
```

### Amazon WAF Captcha (AWS WAF):
```js
const Captcha = require("2captcha-ts")
const solver = new Captcha.Solver("<Your 2captcha api key>")

// INFO: Значение `context` является динамическим, необходимо каждый раз брать фактическое значение со страницы с капчей.
solver.amazonWaf({
  pageurl: "https://non-existent-example.execute-api.us-east-1.amazonaws.com/latest",
  sitekey: "AQIDAHjcYu/GjX+QlghicBgQ/7bFaQZ+m5FKCMDnO+vTbNg96AHMDLodoefdvyOnsHMRt...",
  context: "9BUgmlm48F92WUoqv97a49ZuEJJ50TCk9MVr3C7WMtQ0X6flVbufM4n8mjFLmbLVAPgaQ...",
  iv: "CgAHbCe2GgAAAAAj",
})
.then((res) => {
  console.log(res);
})
.catch((err) => {
  console.log(err);
})
```

### Capy Puzzle
```js
const Captcha = require("2captcha-ts")
const solver = new Captcha.Solver("<Your 2captcha api key>")

solver.capyPuzzle({
    pageurl: "https://www.capy.me/account/register/",
    captchakey: "PUZZLE_Cme4hZLjuZRMYC3uh14C52D3uNms5w"
})
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
})
```

### Сoordinates (Click Captcha):
```js
const Captcha = require("2captcha-ts")
const solver = new Captcha.Solver("<Your 2captcha api key>")
const imageBase64 = fs.readFileSync("./tests/media/hCaptchaImage.jpg", "base64")

solver.coordinates({
    body: imageBase64,
    textinstructions: 'Select all photos containing the boat'
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
  proxy: "login:password@21.214.43.26", // Параметры используемого вами прокси сервера
  proxytype: "HTTP" // Тип используемого прокси: `HTTP`, `HTTPS`, `SOCKS4`, `SOCKS5`.
})
.then((res) => {
  console.log(res)
})
.catch((err) => {
  console.error(err.message)
})
```

## Полезные статьи
* [Как решать капчу Geetest v4](https://2captcha.com/ru/blog/geetest-v4-obkhod?from=16653706)
* [Автоматическое решение reCAPTCHA V3 - инструкция для разработчиков и заказчиков](https://2captcha.com/ru/blog/avtomaticheskoe-reshenie-recaptcha-v3?from=16653706)
* <a href="./docs/hcaptcha.md">Поиск значения `sitekey` для hCaptcha</a>

## Примеры использования с исходным кодом и описанием
* [Решение капчи GeeTest используя Puppeteer](https://github.com/dzmitry-duboyski/GeeTest-demo)
* [Решение капчи reCAPTCHA используя Puppeteer](https://github.com/dzmitry-duboyski/solving-recaptcha-using-puppeteer)
---

Этот проект является форком [этого пакета](https://www.npmjs.com/package/2captcha). В эту версию пакета, добавлена поддержка новых типов капч и изменен способ передачи параметров капчи. Параметры капчи теперь передаются в виде объекта ({параметр: значение}). А также другие косметические изменения.  Подробнее о сделанных изменениях можно прочитать [тут](https://github.com/dzmitry-duboyski/2captcha-ts/releases).