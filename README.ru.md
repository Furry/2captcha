[English](README.md) | [Spanish](README.es.md) | [中国语文科](README.zh.md) | <b>[Русский](README.ru.md)</b>
<p align="center">
  <img src="https://user-images.githubusercontent.com/38065632/280106746-36b3ccc1-b720-458d-9887-88d87b7dd66e.jpg">
</p>

![](https://img.shields.io/npm/v/2captcha-ts)
![](https://img.shields.io/npm/l/2captcha-ts)
![](https://img.shields.io/github/last-commit/dzmitry-duboyski/2captcha-ts)

# JavaScript модуль для 2Captcha API

## Описание
Оболочка вокруг API сервиса [2captcha](https://2captcha.com/). Эта оболочка поддерживает решение следующих типов капч: reCAPTCHA V2, reCAPTCHA V3, hCaptcha, Arkose Labs FunCaptcha, image captcha, Coordinates (Click Captcha), Geetest, Geetest V4, Yandex Smart Captcha, Lemin captcha, Amazon WAF, Cloudflare Turnstile, Capy Puzzle, DataDome CAPTCHA, CyberSiARA, MTCaptcha, Friendly Captcha.

Также добавлена поддержка метода `bounding_box`. Метод ограничивающей рамки позволяет размечать данные на изображении. Этот метод можно использовать для разметки наборов данных или выделения любых объектов на изображении в соответствии с заданными инструкциями. Подробнее об использовании *Bounding Box Method* читайте в [документации](https://2captcha.com/2captcha-api#bounding_box).

[2captcha](https://2captcha.com/) это сервис, который решает множество различных типов капч. Эта библиотека служит оболочкой для API 2captcha, чтобы предоставить NodeJS простую функциональность, основанную на `promise`.

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
- ✅ Coordinates (Click Captcha)
- ⬜ Audio Recogntion
- ✅ DataDome CAPTCHA
- ✅ CyberSiARA
- ✅ MTCaptcha
- ✅ Friendly Captcha
- ✅ Bounding Box Method


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

### DataDome CAPTCHA
```js
const Captcha = require("2captcha-ts")
const solver = new Captcha.Solver("<Your 2captcha api key>")


solver.dataDome({
    pageurl: "https://rendezvousparis.hermes.com/client/register",
    captcha_url: "https://geo.captcha-delivery.com/captcha/?initialCid=AHrlqAAAAAMAEuQtkf4k1c0ABZhYZA%3D%3D&hash=789361B674144528D0B7EE76B35826&cid=mY4z7GNmh7Nt1lAFwpbNHAOcWPhyPgjHD2K1Pm~Od1iEKYLUnK3t7N2ZGUj8OqDK65cnwJHtHwd~t902vlwpSBA5l4ZHbS1Qszv~jEuEUJNQ_jMAjar2Kj3kq20MRJYh&t=fe&referer=https%3A%2F%2Frendezvousparis.hermes.com%2Fclient%2Fregister&s=40119&e=67fef144ac1a54dbd7507776367d2f9d5e36ec3add17fa22f3cb881db8385838",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
    proxy: "login:password@1.2.3.4:8888", // The (Username : Password @ Address : Port) of our chosen proxy
    proxytype: "http" // The 'Type' of proxy, http, https, socks, ect.
})
.then((res) => {
console.log(res);
})
.catch((err) => {
console.log(err);
})
```

### CyberSiARA
```js
const Captcha = require("2captcha-ts")
const solver = new Captcha.Solver("<Your 2captcha api key>")


solver.cyberSiARA({
    pageurl: "https://www.cybersiara.com/book-a-demo",
    master_url_id: "OXR2LVNvCuXykkZbB8KZIfh162sNT8S2",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36"
})
.then((res) => {
console.log(res);
})
.catch((err) => {
console.log(err);
})
```

### MTCaptcha
```js
const Captcha = require("2captcha-ts")
const solver = new Captcha.Solver("<Your 2captcha api key>")


solver.mtCaptcha({
    pageurl: "https://service.mtcaptcha.com/mtcv1/demo/index.html",
    sitekey: "MTPublic-DemoKey9M"
})
.then((res) => {
console.log(res);
})
.catch((err) => {
console.log(err);
})
```

### Friendly Captcha

Используйте этот метод, чтобы решить Friendly Captcha и получить токен для обхода защиты.

> **Важно:**Для успешного использования полученного токена, на странице не должен быть загружен виджет капчи. Для этого вам нужно прервать запрос к `/friendcaptcha/...module.min.js` на странице. Когда виджет капчи уже загружен на страницу, велика вероятность, что полученный токен не сработает.

```js
solver.friendlyCaptcha({
    pageurl: "https://geizhals.de/?liftban=1&from=/455973138?fsean=5901747021356",
    sitekey: "FCMST5VUMCBOCGQ9"
})
.then((res) => {
console.log(res);
})
.catch((err) => {
console.log(err);
})
```

### Coordinates (Click Captcha):
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

### Bounding Box Method:
*Bounding Box Method* позволяет выбирать объекты, указанные на изображении. Для этого вам необходимо передать инструкции по разметке. Инструкции могут быть отправлены в виде текста или изображения, закодированного в формате `base64`. Обязательно необходимо передать хотя бы одну инструкцию `imginstructions` или `textinstructions`.

```js
const Captcha = require("2captcha-ts")
const solver = new Captcha.Solver("<Your 2captcha api key>")

solver.boundingBox({ 
  image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAR4AAACwCAIAAAB...",
  textinstructions: "Обведите все машины на изображении.",
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
  proxy: "login:password@1.2.3.4:8888", // Параметры используемого вами прокси сервера
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
* [Как решать капчу Geetest v4](https://2captcha.com/ru/blog/geetest-v4-obkhod)
* [Автоматическое решение reCAPTCHA V3 - инструкция для разработчиков и заказчиков](https://2captcha.com/ru/blog/avtomaticheskoe-reshenie-recaptcha-v3)
* <a href="./docs/hcaptcha.md">Поиск значения `sitekey` для hCaptcha</a>

## Примеры использования с исходным кодом и описанием
* [Решение капчи GeeTest используя Puppeteer](https://github.com/dzmitry-duboyski/GeeTest-demo)
* [Решение капчи reCAPTCHA используя Puppeteer](https://github.com/dzmitry-duboyski/solving-recaptcha-using-puppeteer)
* [Решение Yandex Smart Captcha используя Puppeteer](https://github.com/dzmitry-duboyski/solving-yandex-smart-captcha-using-puppeteer)
---

Этот проект является форком [этого пакета](https://www.npmjs.com/package/2captcha). В эту версию пакета, добавлена поддержка новых типов капч и изменен способ передачи параметров капчи. Параметры капчи теперь передаются в виде объекта ({параметр: значение}). А также другие косметические изменения.  Подробнее о сделанных изменениях можно прочитать [тут](https://github.com/dzmitry-duboyski/2captcha-ts/releases).