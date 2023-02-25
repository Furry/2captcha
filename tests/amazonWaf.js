const Captcha = require("../dist/index.js");
require('dotenv').config();
const APIKEY = process.env.APIKEY
const solver = new Captcha.Solver(APIKEY);

//INFO: The `context` value is dynamic, it is necessary to take the actual value from the page each time.
solver.amazonWaf({
    pageurl: "https://non-existent-example.execute-api.us-east-1.amazonaws.com/latest",
    sitekey: "AQIDAHjcYu/GjX+QlghicBgQ/7bFaQZ+m5FKCMDnO+vTbNg96AHMDLodoefdvyOnsHMRtEKQAAAAfjB8BgkqhkiG9w0BBwagbzBtAgEAMGgGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMUX+ZqwwuANRnZujSAgEQgDvHSxUQmVBuyUtumoW2n4ccTG7xQN1r3X/zz41qmQaYv9SSSvQrjIoDXKaUQ23tVb4ii8+uljuRdz/HPA==",
    context: "9BUgmlm48F92WUoqv97a49ZuEJJ50TCk9MVr3C7WMtQ0X6flVbufM4n8mjFLmbLVAPgaQ1Jydeaja94iAS49ljb+sUNLoukWedAQZKrlY4RdbOOzvcFqmD/ZepQFS9N5w15Exr4VwnVq+HIxTsDJwRviElWCdzKDebN/mk8/eX2n7qJi5G3Riq0tdQw9+C4diFZU5E97RSeahejOAAJTDqduqW6uLw9NsjJBkDRBlRjxjn5CaMMo5pYOxYbGrM8Un1JH5DMOLeXbq1xWbC17YSEoM1cRFfTgOoc+VpCe36Ai9Kc=",
    iv: "CgAHbCe2GgAAAAAj",
})
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
})