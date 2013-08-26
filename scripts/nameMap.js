opera.isReady(function() {
  var NAME_MAP = window["NAME_MAP"] = {
//  "ab": "Abkhazian", // not supported in Google Translate
    "af": "Afrikaans - Afrikaans",
    "sq": "Albanian - Shqip",
    "ar": "Arabic - اللغة العربية",
    "hy": "Armenian - Հայերեն",
    "az": "Azerbaijani - Azərbaycanca",
    "eu": "Basque - Euskara",
    "be": "Belarusian - Беларуская",
    "bn": "Bengali - বাংলা",
//  "bs": "Bosnian - Bosanski", // not supported in guessLanguage.js
    "bg": "Bulgarian - български език",
//  "br": "Breton - Ar Brezhoneg", // not supported in Google Translate
    "ca": "Catalan - Català",
    "ceb": "Cebuano - Sinugboanon",
    "zh-CN": "Chinese (Simplified) - 简体字",
    "zh-TW": "Chinese (Traditional) -  正體字",
    "hr": "Croatian - Hrvatski",
    "cs": "Czech - Čeština",
    "da": "Danish - Dansk",
    "nl": "Dutch - Nederlands",
    "en": "English",
    "eo": "Esperanto - Esperanto",
    "et": "Estonian - Eesti",
//  "fo": "Faroese", // not supported in Google Translate
    "tl": "Filipino - Tagalog",
    "fi": "Finnish - Suomi",
    "fr": "French - Français",
//  "fy": "Frisian", // not supported in Google Translate
    "gl": "Galician - Galego",
    "ka": "Georgian - ქართული",
    "de": "German - Deutsch",
    "el": "Greek - Ελληνικά",
    "gu": "Gujarati - ગુજરાતી",
//  "hat": "Haitian Creole", // not supported in guessLanguage.js
//  "ha": "Hausa", // not supported in Google Translate
//  "haw": "Hawaiian", // not supported in Google Translate
    "he": "Hebrew - עברית",
//  "hmn": "Hmong", // not supported in guessLanguage.js
    "hu": "Hungarian - Magyar",
    "is": "Icelandic - Íslenska",
    "id": "Indonesian - Bahasa Indonesia",
//  "ga": "Irish", // not supported in guessLanguage.js
    "it": "Italian - Italiano",
    "ja": "Japanese - 日本語",
//  "jv": "Javanese", // not supported in guessLanguage.js
//  "kn": "Kannada", // not supported in guessLanguage.js
//  "kk": "Kazakh", // not supported in Google Translate
    "km": "Khmer - ភាសាខ្មែរ",
//  "tlh": "Klingon", // not supported in Google Translate
    "ko": "Korean - 조선말",
//  "ku": "Kurdish", // not supported in Google Translate
//  "ky": "Kyrgyz", // not supported in Google Translate
//  "lo": "Lao", // not supported in guessLanguage.js
    "la": "Latin - Latina",
    "lv": "Latvian - Latviešu",
    "lt": "Lithuanian - Lietuvių",
    "mk": "Macedonian - Mакедонски",
//  "mg": "Malagasy", // not supported in Google Translate
    "ms": "Malay - Bahasa Melayu",
//  "ml": "Malayalam", // not supported in Google Translate
//  "mt": "Maltese", // not supported in guessLanguage.js
    "mr": "Marathi - मराठी",
//  "mn": "Mongolian", // not supported in Google Translate
//  "nd": "Ndebele", // not supported in Google Translate
//  "ne": "Nepali", // not supported in Google Translate
    "no": "Norwegian - Norsk",
//  "ps": "Pashto", // not supported in Google Translate
    "fa": "Persian - فارسی",
    "pl": "Polish - Polski",
    "pt-PT": "Portuguese - Português",
    "pt-BR": "Portuguese (Brazil) - Português (Brazil)",
//  "pa": "Punjabi", // not supported in Google Translate
    "ro": "Romanian - Română",
    "ru": "Russian - Русский",
//  "gd": "Scots Gaelic", // not supported in Google Translate
//  "sa": "Sanskrit", // not supported in Google Translate
//  "nso": "Sepedi", // not supported in Google Translate
    "sr": "Serbian - Српски",
//  "tn": "Setswana", // not supported in Google Translate
    "sk": "Slovak - Slovenčina",
    "sl": "Slovenian - Slovenščina",
//  "so": "Somali", // not supported in Google Translate
    "es": "Spanish - Español",
    "sw": "Swahili - Kiswahili",
    "sv": "Swedish - Svensk",
    "ta": "Tamil - தமிழ்",
    "te": "Telugu - తెలుగు",
    "th": "Thai - ภาษาไทย",
//  "bo": "Tibetan", // not supported by Google Translate
//  "ts": "Tsonga", // not supported in Google Translate
    "tr": "Turkish - Türkçe",
//  "tw": "Twi", // not supported in Google Translate
    "uk": "Ukrainian - Українська",
    "ur": "Urdu - ہندوستانی",
//  "uz": "Uzbek", // not supported in Google Translate
    "vi": "Vietnamese - Tiếng Việt",
//  "ve": "Venda", // not supported in Google Translate
    "cy": "Welsh - Cymraeg"//,
//  "xh": "Xhosa", // not supported in Google Translate
//  "yi": "Yiddish", // not supported by guessLanguage.js
//  "zu": "Zulu" // not supported in Google Translate
  };
});
