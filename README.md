<p align="center">
  <img src="https://user-images.githubusercontent.com/38065632/280106746-36b3ccc1-b720-458d-9887-88d87b7dd66e.jpg">
</p>

![](https://img.shields.io/npm/dt/2captcha-ts?color=00bd79)
![](https://img.shields.io/npm/v/2captcha-ts)
![](https://img.shields.io/npm/l/2captcha-ts)
![](https://img.shields.io/github/last-commit/dzmitry-duboyski/2captcha-ts)

# JavaScript captcha solver module for 2Captcha API

The easiest way to quickly integrate the [2Captcha](https://2captcha.com/) captcha-solving service into your code and automate the solving of any type of captcha.

- [JavaScript captcha solver module for 2Captcha API](#javascript-captcha-solver-module-for-2captcha-api)
  - [Installation](#installation)
  - [Configuration](#configuration)
    - [TwoCaptcha instance options](#twocaptcha-instance-options)
  - [Solve captcha](#solve-captcha)
    - [Image captchas](#image-captcha)
    - [reCAPTCHA v2](#recaptcha-v2)
    - [reCAPTCHA v3](#recaptcha-v3)
    - [hCaptcha](#hcaptcha)
    - [FunCaptcha](#funcaptcha)
    - [GeeTest](#geetest-captcha)
    - [GeeTest V4](#geetest-v4-captcha)
    - [Yandex Smart Captcha](#yandex-smart-captcha)
    - [Lemin Cropped Captcha](#lemin-cropped-captcha)
    - [Cloudflare Turnstile](#cloudflare-turnstile)
    - [Amazon WAF](#amazon-waf)
    - [Capy](#capy)
    - [ClickCaptcha](#clickcaptcha)
    - [DataDome CAPTCHA](#datadome-captcha)
    - [CyberSiARA](#cybersiara)
    - [MTCaptcha](#mtcaptcha)
    - [Friendly Captcha](#friendly-captcha)
    - [Bounding Box Method](#bounding-box-method)
  - [Other methods](#other-methods)
    - [goodReport](#goodreport)
    - [badReport](#badreport)
    - [balance](#balance)
  - [Proxies](#proxies)
  - [Examples](#examples)
  - [Useful articles](#useful-articles)

## Installation
This package can be installed with NPM:

```sh
npm install @2captcha/captcha-solver
```
or Yarn:
```sh
yarn add @2captcha/captcha-solver
```

## Configuration

TwoCaptcha instance can be created like this:

```js
const TwoCaptcha = require("@2captcha/captcha-solver")
const solver = new TwoCaptcha.Solver("<Your 2captcha api key>")
```

Also, there are a few options that can be configured:

```javascript
const apiKey = 'YOUR_API_KEY'
const pollingInterval = 10

const solver = new TwoCaptcha.Solver(apiKey, pollingInterval)
```
### TwoCaptcha instance options

| Option           | Default value  | Description                                                                                  |
| ---------------- | -------------- | -------------------------------------------------------------------------------------------- |
| apiKey           | -              | Your API key                                                                                 |
| pollingInterval  | 5000           | Interval in milliseconds between requests to the `res.php` API endpoint. Setting values less than 5 seconds is not recommended |

## Solve captcha

When you submit any image-based captcha use can provide additional options to help 2captcha workers to solve it properly.

### Captcha options

| Option        | Default Value | Description                                                                                        |
| ------------- | ------------- | -------------------------------------------------------------------------------------------------- |
| numeric       | 0             | Defines if the captcha contains numeric or other symbols [see more info in the API docs][post options] |
| min_len       | 0             | minimal answer length                                                                              |
| max_len       | 0             | maximum answer length                                                                              |
| phrase        | 0             | defines if the answer contains multiple words or not                                               |
| regsense      | 0             | defines if the answer is case sensitive                                                            |
| calc          | 0             | defines captcha requires calculation                                                               |
| lang          | -             | defines the captcha language; see the [list of supported languages]                                |
| textinstructions| -           | hint or task text shown to workers with the captcha                                                |

Below you can find basic examples for every captcha type, check out the code below.

### Image captcha

<sup>[API method description.](https://2captcha.com/2captcha-api#solving_normal_captcha)</sup>

To bypass a normal captcha (distorted text on an image) use the following method. This method can also be used to recognize any text in an image.

```js
// Read from a file as base64 text
const imageBase64 = fs.readFileSync("./examples/media/imageCaptcha_6e584.png", "base64")

solver.imageCaptcha({
    body: imageBase64,
    numeric: 4,
    min_len: 5,
    max_len: 5
})
.then((res) => {
  // Logs the image text
  console.log(res);
})
.catch((err) => {
  console.log(err);
})
```

### reCAPTCHA V2

<sup>[API method description.](https://2captcha.com/2captcha-api#solving_recaptchav2_new)</sup>

Use the following method to solve reCAPTCHA V2 and obtain a token to bypass the protection.

```js
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

### reCAPTCHA V3

<sup>[API method description.](https://2captcha.com/2captcha-api#solving_recaptchav3)</sup>

This method provides a reCAPTCHA V3 solver and returns a token.

```js
solver.recaptcha({
    pageurl: 'https://2captcha.com/demo/recaptcha-v3',
    googlekey: '6Lcyqq8oAAAAAJE7eVJ3aZp_hnJcI6LgGdYD8lge',
    version: "v3",
    min_score: "0.4",
    action: 'demo_action'
})
.then((res) => {
  console.log(res);
})
.catch((err) => {
  console.log(err);
})
```


### hCaptcha

<sup>[API method description.](https://2captcha.com/2captcha-api#solving_hcaptcha)</sup>

Use this method to solve the hCaptcha challenge. Returns a token to bypass the captcha.

```js
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

### FunCaptcha

<sup>[API method description.](https://2captcha.com/2captcha-api#solving_funcaptcha_new)</sup>

FunCaptcha (Arkoselabs) solving method. Returns a token.

```js
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

### GeeTest Captcha

<sup>[API method description.](https://2captcha.com/2captcha-api#solving_geetest)</sup>

Method to solve GeeTest puzzle captcha. Returns a set of tokens as JSON.

```js
// Read more about `challenge` on the page https://2captcha.com/p/geetest
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

### GeeTest V4 Captcha

<sup>[API method description.](https://2captcha.com/2captcha-api#geetest-v4)</sup>

Use this method to solve GeeTest v4. Returns the response in JSON.

```js
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

### Yandex Smart Captcha

Use this method to solve Yandex Smart Captcha and obtain a token to bypass the protection.

```js
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

### Lemin Cropped Captcha

<sup>[API method description.](https://2captcha.com/2captcha-api#lemin)</sup>

Use this method to solve Lemin and obtain a token to bypass the protection.

```js
solver.lemin({
  pageurl:'https://2captcha.com/demo/lemin', 
  captcha_id: 'CROPPED_3dfdd5c_d1872b526b794d83ba3b365eb15a200b',
  div_id: 'lemin-cropped-captcha',
  api_server: 'api.leminnow.com'
})
.then((res) => {
  console.log(res);
})
.catch((err) => {
  console.log(err);
})
```

### Cloudflare Turnstile

<sup>[API method description.](https://2captcha.com/2captcha-api#turnstile)</sup>

Use this method to solve Cloudflare Turnstile. Returns JSON with the token.

Turnstile captcha has two types, one of them is Cloudflare Turnstile Challenge page. For Turnstile Challenge page cases, we have a [demo](https://github.com/2captcha/cloudflare-demo). Try this [demo](https://github.com/2captcha/cloudflare-demo) if you need to solve Cloudflare Turnstile Challenge page captcha.

```js
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

### Amazon WAF

<sup>[API method description.](https://2captcha.com/2captcha-api#amazon-waf)</sup>

Use this method to solve Amazon WAF Captcha also known as AWS WAF Captcha is a part of Intelligent threat mitigation for Amazon AWS. Returns JSON with the token.

```js
//INFO: The `context` value is dynamic, it is necessary to take the actual value from the page each time.
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

### Capy

<sup>[API method description.](https://2captcha.com/2captcha-api#solving_capy)</sup>

Token-based method to bypass Capy puzzle captcha.

```js
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

<sup>[API method description.](https://2captcha.com/2captcha-api#datadome)</sup>

Use this method to solve DataDome and obtain a token to bypass the protection. 

> [!IMPORTANT]  
> To solve the DataDome captcha, you must use a proxy. It is recommended to use [residential proxies][Buy residential proxies].

```js
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

<sup>[API method description.](https://2captcha.com/2captcha-api#cybersiara)</sup>

Use this method to solve CyberSiARA and obtain a token to bypass the protection.

```js
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

<sup>[API method description.](https://2captcha.com/2captcha-api#mtcaptcha)</sup>

Use this method to solve MTCaptcha and obtain a token to bypass the protection.

```js
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

<sup>[API method description.](https://2captcha.com/2captcha-api#friendly-captcha)</sup>

Use this method to solve Friendly Captcha and obtain a token to bypass the protection.

> [!IMPORTANT]  
> To successfully use the received token, the captcha widget must not be loaded on the page. To do this, you need to abort request to `/friendlycaptcha/...module.min.js` on the page. When the captcha widget is already loaded on the page, there is a high probability that the received token will not work.

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

### ClickCaptcha

<sup>[API method description.](https://2captcha.com/2captcha-api#coordinates)</sup>

The ClickCaptcha method returns the coordinates of points on the captcha image. It can be used if you need to click on particular points in the image.

```js
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

<sup>[API method description.](https://2captcha.com/2captcha-api#bounding_box)</sup>


Use Bounding Box Method when you need to select objects on the image. To do this, you need to pass the markup instructions and image for markup. The instructions can be sent as text or as an image encoded in `base64` format. 
> [!IMPORTANT]  
> You must to send instruction `imginstructions` or `textinstructions`.

```js
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

## Other methods

### goodReport

<sup>[API method description.](https://2captcha.com/2captcha-api#reporting-answers)</sup>

Use this method to report good captcha answer.

```js
solver.goodReport('7031846604')
```

### badReport 

<sup>[API method description.](https://2captcha.com/2captcha-api#reporting-answers)</sup>

Use this method to report bad captcha answer.

```js
solver.badReport('7031854546')
```

### balance 

<sup>[API method description.](https://2captcha.com/2captcha-api#additional-methods)</sup>

Use this method to get your account's balance.

```js
solver.balance()
.then((res) => {
    console.log(res)
})
```

## Proxies

You can pass your proxy as an additional argument for methods: recaptcha, funcaptcha, geetest, geetest v4, hcaptcha, keycaptcha, capy puzzle, lemin, turnstile, amazon waf, DataDome, CyberSiARA, MTCaptcha, Friendly Captcha and etc. The proxy will be forwarded to the API to solve the captcha.

We have our own proxies that we can offer you. [Buy residential proxies] for avoid restrictions and blocks. [Quick start].

Solving reCAPTCHA V2 using proxy:
```js
solver.recaptcha({
    pageurl: 'https://2captcha.com/demo/recaptcha-v2',
    googlekey: '6LfD3PIbAAAAAJs_eEHvoOl75_83eXSqpPSRFJ_u',
    proxy: 'HTTPS',
    proxytype: 'login:password@123.123.123.123:3128'
})
```
## Examples

Examples of solving all supported captcha types are located in the [examples] directory.

## Useful articles
* [How to bypass captcha using JavaScript](https://2captcha.com/blog/how-to-use-javascript-to-bypass-captcha#how-to-solve-and-bypass-a-captcha-with-javascript-using-npm-package-2captchacaptcha-solver)
* [Bypassing Cloudflare Challenge with Puppeteer and 2Captcha](https://2captcha.com/blog/bypassing-cloudflare-challenge-with-puppeteer-and-2captcha)
* [How to bypass Geetest v4 CAPTCHA](https://2captcha.com/blog/geetest-v4-support)
* [Automatic reCAPTCHA V3 resolution - a tutorial for developers and customers](https://2captcha.com/blog/recaptcha-v3-automatic-resolution)
* [Custom Slider Captcha Demo](https://github.com/2captcha/custom-slider-demo)
* [Cloudflare Challenge page bypass code example](https://github.com/2captcha/cloudflare-demo)

<!-- Shared links -->
[post options]: https://2captcha.com/2captcha-api#normal_post
[list of supported languages]: https://2captcha.com/2captcha-api#language
[Buy residential proxies]: https://2captcha.com/proxy/residential-proxies
[Quick start]: https://2captcha.com/proxy?openAddTrafficModal=true
[examples]: ./examples