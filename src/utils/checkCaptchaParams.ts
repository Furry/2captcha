// Captcha methods for which parameter checking is available
const supportedMethods = ["userrecaptcha", "hcaptcha", "geetest", "geetest_v4","yandex","funcaptcha","lemin","amazon_waf",
"turnstile", "base64", "capy","datadome", "cybersiara", "mt_captcha"]

// Names of required fields that must be contained in the parameters captcha
const recaptchaRequiredFields =   ['pageurl','googlekey']
const hcaptchaRequiredFields =    ['pageurl','sitekey']
const geetestRequiredFields =     ['pageurl','gt','challenge']
const geetestV4RequiredFields =   ['pageurl','captcha_id']
const yandexSmartRequiredFields = ['pageurl','sitekey']
const funCaptchaRequiredFields =  ['pageurl','publickey']
const leminRequiredFields =       ['pageurl','div_id','captcha_id']
const amazonWafRequiredFields =   ['pageurl','context','iv','sitekey']
const turnstileRequiredFields =   ['pageurl','sitekey']
// `base64RequiredFields` for Normal Captcha and Coordinates captcha
const base64RequiredFields =      ['body'] 
const capyPuzzleRequiredFields =  ['captchakey']
const dataDomeRequiredFields =    ['pageurl', 'captcha_url', 'userAgent', 'proxy', 'proxytype']
const сyberSiARARequiredFields =  ['pageurl', 'master_url_id', 'userAgent']
const mtСaptchaRequiredFields =  ['pageurl', 'sitekey']

/**
 * Getting required arguments for a captcha.
 * 
 * @param {string} method method for solving captcha.
 * @returns {Array} An array containing the required arguments for this captcha
 */
const getRequiredFildsArr = (method: string):Array<string> => {
  let requiredFieldsArr = ['pageurl']

  switch(method){
    case "userrecaptcha":
      requiredFieldsArr = recaptchaRequiredFields
      break;
    case "hcaptcha":
      requiredFieldsArr = hcaptchaRequiredFields
      break;
    case "geetest":
      requiredFieldsArr = geetestRequiredFields
      break;
    case "geetest_v4":
      requiredFieldsArr = geetestV4RequiredFields
      break;
    case "yandex":
      requiredFieldsArr = yandexSmartRequiredFields
      break;
    case "funcaptcha":
      requiredFieldsArr = funCaptchaRequiredFields
      break;
    case "lemin":
      requiredFieldsArr = leminRequiredFields
      break;
    case "amazon_waf":
      requiredFieldsArr = amazonWafRequiredFields
      break;
    case "turnstile":
      requiredFieldsArr = turnstileRequiredFields
      break;
    case "base64":
      requiredFieldsArr = base64RequiredFields
      break;
    case "capy":
      requiredFieldsArr = capyPuzzleRequiredFields
      break;
    case "datadome":
      requiredFieldsArr = dataDomeRequiredFields
      break;
    case "cybersiara":
      requiredFieldsArr = сyberSiARARequiredFields
      break;
    case "mt_captcha":
      requiredFieldsArr = mtСaptchaRequiredFields
      break;
  }
  return requiredFieldsArr
}

/**
 * @param { Object } params Captcha parameters that need to be checked.
 * @returns true | false | Error
 * @example
 * checkCaptchaParams(params, 'userrecaptcha')
 */
export default function checkCaptchaParams(params: Object, method: string) {
  let isCorrectCaptchaParams
  const isIncorrectCaptchaMethod = !supportedMethods.includes(method)

  if(isIncorrectCaptchaMethod) {
    isCorrectCaptchaParams = false
    throw new Error(`Error when check params captcha. \nNot found "${method}" method in the "supportedMethods" array. \nCheck if the method is written correctly `)
  }

  const requiredFields = getRequiredFildsArr(method)
  
  requiredFields.forEach(fieldName => {
    const isThisFieldNotAvailable = !params.hasOwnProperty(fieldName)

    if(isThisFieldNotAvailable) {
      isCorrectCaptchaParams = false
      throw new Error(`Error when check params captcha.\nNot found "${fieldName}" field in the Object. Field "${fieldName}" is required for "${method}" method. Please add field "${fieldName}" in object and try again.\nPlease correct your code for the "${method}" method according to the code examples on page https://www.npmjs.com/package/2captcha-ts`)
    } else {
      isCorrectCaptchaParams = true
    }
  })

  return isCorrectCaptchaParams
}