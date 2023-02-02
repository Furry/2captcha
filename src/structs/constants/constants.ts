const twoCaptchaName = '2captcha'
const twoCaptchaIn = 'https://2captcha.com/in.php'
const twoCaptchaRes =  'https://2captcha.com/res.php'

const ruCaptchaName = 'ruCaptcha'
const ruCaptchaIn = 'https://rucaptcha.com/in.php'
const ruCaptchaRes =  'https://rucaptcha.com/res.php'

// TODO: add the ability to specify softid in the constructor of the `Captcha` class
const softId: number = 3898

const supportedProviders = {
  twoCaptcha: {
    name: twoCaptchaName,
    in: twoCaptchaIn,
    res: twoCaptchaRes
  },
  ruCaptcha: {
    name: ruCaptchaName,
    in: ruCaptchaIn,
    res: ruCaptchaRes
  }
}

export { supportedProviders, softId }