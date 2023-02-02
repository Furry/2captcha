import { supportedProviders } from "../constants/constants";

const defautlProvider = supportedProviders.twoCaptcha.name

export default function getProviderData( provider = defautlProvider ) {
  
  const currentProvider = provider
  let currentProviderData

  switch(currentProvider){
    case '2captcha':
      currentProviderData = supportedProviders.twoCaptcha
      break;
    case 'ruCaptcha':
      currentProviderData = supportedProviders.ruCaptcha
      break;
    default:
      currentProviderData = supportedProviders.twoCaptcha
  }

  return currentProviderData
}