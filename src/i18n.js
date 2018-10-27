import i18n from "i18next";
import { reactI18nextModule } from "react-i18next";
import detector from "i18next-browser-languagedetector";
import backend from "i18next-xhr-backend";

i18n
  .use(detector)
  .use(backend)
  .use(reactI18nextModule) // passes i18n down to react-i18next
  .init({
    lng: "en",
    fallbackLng: "en", // use en if detected lng is not available

    ns: ['validation', 'common', 'glossary'],

    debug: true,
    keySeparator: false, // we do not use keys in form messages.welcome
    backend: {
        // load from i18next-gitbook repo
        loadPath: '/locales/{{lng}}/{{ns}}.json',
        crossDomain: true
    },
    
    interpolation: {
      escapeValue: false // react already safes from xss
    },
    
    // react-i18next options
    react: {
        wait: true
      }
  });
  
export default i18n;