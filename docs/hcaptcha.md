<center><h1>hCaptcha</h1></center>
<center><h2><a href="../readme.md">< - Back To Home<h2></a></center>


<center><h2>What is HCaptcha and how does it work?</h2></center>
<h3>hCaptcha is a primarally image-based bot prevention. It comes in two models, Publisher and Enterprise. hCaptcha Publisher being the free-to-use model. hCaptcha Enterprise employs machine-learning based threat detection, allowing select fingerprints and analyitics bypass the captcha all togther through gathered telemetry on the user. When using 2Captcha, both of these are treated virtually the same, 2Captha's solutions solve the captcha regardless, ignoring the optional fingerprint method.</h3>
<br><br>
<center><h2>How to find an hCaptcha sitekey</h2></center>

<center>
<h3>
A major site that uses hCaptcha is Discord, so for this example that's what we'll use. The two required parameters for using the 2captcha service for hCaptcha is a SiteKey & the domain the hCaptcha widget/iframe shows up on. Due to how hCaptcha works, the iFrame only is accessable if hCaptcha Enterprise determines you to be of moderate risk, so you may have to try a few times to get it.

<br>

Enter some random data, and press continue.
<center><img src="https://i.imgur.com/SfjLuob.png"></center>

<br>

With a little bit of luck, you should see the hCaptcha widget.
<center><img src="https://i.imgur.com/5WGmwD2.png"></center>

<br>

From there, you'll be able to open up dev-tools. (With Chromium, Ctrl + Shift + I), and be able to find a line similar to the one highlighted in this image.
<center><img src="https://i.imgur.com/dz6zpsD.png"></center>

The URL there contains the sitekey within the Query Parameter portions of the URL.
https://newassets.hcaptcha.com/captcha/v1/f6912ef/static/hcaptcha-checkbox.html#id=0iqupfjeet7&host=discord.com&sentry=true&reportapi=https%3A%2F%2Faccounts.hcaptcha.com&recaptchacompat=true&custom=false&hl=en&tplinks=on&sitekey=4c672d35-0701-42b2-88c3-78380b0db560&theme=dark

Here we can see it says <b>sitekey=4c672d35-0701-42b2-88c3-78380b0db560</b>, and thats the site key! The host is also specified, <b>host=discord.com</b>. Using both of these parameters, we're able to construct some code to automatically complete this captcha.
</h3>
</center>

```js
const Captcha = require("2captcha");
const solver = new Captcha.Solver("<Your 2Captcha API Key>");

// Sitekey & Domain
solver.hCaptcha("4c672d35-0701-42b2-88c3-78380b0db560", "discord.com")
.then((res) = {
    console.log(res);
})
```