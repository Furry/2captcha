export type Locale = "en" | "ru";

export default {
    "ru": {
        "domain": "http://rucaptcha.com",

        "ERROR_WRONG_USER_KEY": "Вы указали значение параметра key в неверном формате, ключ должен содержать 32 символа.",
        "ERROR_KEY_DOES_NOT_EXIST": "Ключ, который вы указали, не существует.",

        "UNEXPECTED": "An unexpected error has occurred, please open an issue on GitHub detailing this event. (https://github.com/furry/2captcha)",
        "LOOPBACK_BIND": "A loopback http server could not be bound. Please check your network configuration on the provided port.",
    },
    "en": {
        "domain": "http://2captcha.com",

        "UNEXPECTED": "Произошла непредвиденная ошибка. Откройте тикет на GitHub с подробным описанием этого события. (https://github.com/furry/2captcha)",
        "LOOPBACK_BIND": "Не удалось привязать http-сервер с обратной связью. Пожалуйста, проверьте конфигурацию вашей сети на предоставленном порту.",
    }
}