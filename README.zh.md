[English](README.md) | <b>[中国语文科](README.zh.md)</b> | [Русский](README.ru.md)

# 2captcha API的JavaScript模块

## 资料描述
提供[2captcha](https://2captcha.com/)服务的API的包装器.
 這個 npm 包包括對以下驗證碼類型的支持：reCAPTCHA V2, reCAPTCHA V3, hCaptcha, Arkose Labs FunCaptcha, image captcha, Coordinates (Click Captcha), Geetest, Geetest V4, Yandex Smart Captcha, Lemin captcha, Amazon WAF, Cloudflare Turnstile, Capy Puzzle, DataDome CAPTCHA, CyberSiARA, MTCaptcha.

[2captcha](https://2captcha.com/)是一項服務，可讓您解決許多不同類型的驗證碼。這個 npm 包包裝了[2captcha](https://2captcha.com/)API 來為 NodeJS 提供簡單的基於`promise`的功能。

## 支持的驗證碼
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
- ✅ Bounding Box Method

## 安装/安装

```sh
npm install @2captcha/captcha-solver
```
```sh
yarn add @2captcha/captcha-solver
```

## 使用示例


### reCAPTCHA:
```js
const Captcha = require("@2captcha/captcha-solver")
// 具有 2CAPTCHA API 密鑰值的新“求解器”實例。
const solver = new Captcha.Solver("<Your 2captcha api key>")

// reCAPTCHA 解決方案，在包含 reCAPTCHA V2 的演示頁面上
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
const Captcha = require("@2captcha/captcha-solver")
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
const Captcha = require("@2captcha/captcha-solver")
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
const Captcha = require("@2captcha/captcha-solver")
const fs = require("fs")
const solver = new Captcha.Solver("<Your 2captcha api key>")

// 獲取base64格式的文件內容
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
const Captcha = require("@2captcha/captcha-solver")
const solver = new Captcha.Solver("<Your 2captcha api key>")

// `challenge` 值是動態的
// 关于参数`challenge`的更多信息写在第https://2captcha.com/p/geetest页
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
const Captcha = require("@2captcha/captcha-solver")
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
const Captcha = require("@2captcha/captcha-solver")
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
const Captcha = require("@2captcha/captcha-solver")
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
const Captcha = require("@2captcha/captcha-solver")
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
const Captcha = require("@2captcha/captcha-solver")
const solver = new Captcha.Solver("<Your 2captcha api key>")

// INFO: 'Context'值是动态的，每次都需要从captcha页面获取新的`context`值。
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
const Captcha = require("@2captcha/captcha-solver")
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
const Captcha = require("@2captcha/captcha-solver")
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
const Captcha = require("@2captcha/captcha-solver")
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
const Captcha = require("@2captcha/captcha-solver")
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

### Coordinates (Click Captcha):
```js
const Captcha = require("@2captcha/captcha-solver")
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
```js
const Captcha = require("@2captcha/captcha-solver")
const solver = new Captcha.Solver("<Your 2captcha api key>")

solver.boundingBox({ 
  image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAR4AAACwCAIAAAB...",
  textinstructions: "Circle all the cars in the image.",
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
const Captcha = require("@2captcha/captcha-solver")
const solver = new Captcha.Solver("<Your 2captcha api key>")

solver.recaptcha({
  pageurl: 'https://2captcha.com/demo/recaptcha-v2',
  googlekey: '6LfD3PIbAAAAAJs_eEHvoOl75_83eXSqpPSRFJ_u',
  proxy: "login:password@1.2.3.4:8888", // 您正在使用的代理服务器的参数
  proxytype: "HTTP" // 使用的代理服务器类型: `HTTP`, `HTTPS`, `SOCKS4`, `SOCKS5`.
})
.then((res) => {
  console.log(res)
})
.catch((err) => {
  console.error(err.message)
})
```

## 有用的文章
* [如何解决Geetest v4 captcha](https://2captcha.com/zh/blog/geetest-v4-support)
* [自动reCAPTCHA V3解决方案-开发人员和客户的说明](https://2captcha.com/zh/blog/recaptcha-v3-automatic-resolution)
* <a href="./docs/hcaptcha.md">搜索hCaptcha的`sitekey`值</a>