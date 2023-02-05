const fetch = require('node-fetch');
const Captcha = require("../dist/index.js");
require('dotenv').config();
const APIKEY = process.env.APIKEY
const solver = new Captcha.Solver(APIKEY);

;(async () => {
/**
 * Warning: Attention, the `challenge` value is not static but dynamic.
 * You need to find the queries that makes the captcha on the page to API.
 * Then you need to make request to this API and get new `challenge`.
 * 
 * For page https://rucaptcha.com/demo/geetest, api address is https://rucaptcha.com/api/v1/captcha-demo/gee-test/init-params?t=${t}
 * Also note that when make request to API, the request uses the dynamic parameter `t`
 * 
 * You can read more about sending GeeTest here https://2captcha.com/2captcha-api#solving_geetest, or here https://2captcha.com/p/geetest
 * In this example I solve GeeTest from page https://2captcha.com/demo/geetest
 * 
 */ 
   
  const t = new Date().getTime()
  // below i make a request to get a new `challenge`. 
  const response = await fetch(`https://2captcha.com/api/v1/captcha-demo/gee-test/init-params?t=${t}`)
  const data = await response.json()

  const params = { 
    pageurl: 'https://2captcha.com/demo/geetest',
    gt: data.gt,
    challenge: data.challenge
  }

  const res = await solver.geetest(params)
  try {
      console.log(res)
    } catch (error) {
      console.error(error);
    }
})()