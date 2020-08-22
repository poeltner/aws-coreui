import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import detector from "i18next-browser-languagedetector";
import backend from "i18next-xhr-backend";

var detectionOptions = {
  // order and from where user language should be detected
  order: ["navigator", "cookie", "localStorage", "querystring", "htmlTag"],

  // keys or params to lookup language from
  lookupQuerystring: "lng",
  lookupCookie: "i18next",
  lookupLocalStorage: "i18nextLng",

  // cache user language on
  caches: ["localStorage", "cookie"],
  excludeCacheFor: ["cimode"], // languages to not persist (cookie, localStorage)

  // optional expire and domain for set cookie
  // cookieMinutes: 10,
  // cookieDomain: 'myDomain',

  // optional htmlTag with lang attribute, the default is:
  htmlTag: document.documentElement
};

i18n
  .use(detector)
  .use(backend)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // lng: "en",
    detection: detectionOptions,
    fallbackLng: "en", // use en if detected lng is not available

    ns: ["validation", "common", "glossary"],

    debug: false,
    keySeparator: false, // we do not use keys in form messages.welcome
    backend: {
      // load from i18next-gitbook repo
      loadPath: "/locales/{{lng}}/{{ns}}.json",
      crossDomain: true
    },

    interpolation: {
      escapeValue: false // react already safes from xss
    },

    // react-i18next options
    react: {
      wait: true,
      useSuspense: false
    }
  });

export default i18n;
