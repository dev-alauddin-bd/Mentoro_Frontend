import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

/**
 * Import generated JSON files from Intlayer.
 * Since your content key is "app", the file names are app.json.
 */
import en from "../locales/en/translation.json"; // English translations

import bn from "../locales/bn/translation.json"; // Bengali translations
import ar from "../locales/ar/translation.json";    // Arabic
import hi from "../locales/hi/translation.json"; // Hindi

import ja from "../locales/ja/translation.json"; // Japanese
import ko from "../locales/ko/translation.json"; // Korean

i18n
  // Detect user language automatically
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources: {
      en: { translation: en },

      bn: { translation: bn },
      ar: { translation: ar },
      hi: { translation: hi },

      ja: { translation: ja },
      ko: { translation: ko },

    },

    // Default language if detection fails
    fallbackLng: "en",

    // List of all supported languages in your project
    supportedLngs: ["en", "bn", "ar", "hi", "ja", "ko"],

    detection: {
      // Order in which user language is looked up
      order: ["localStorage", "cookie", "navigator"],
      // Cache user language on these locations
      caches: ["localStorage", "cookie"],
    },

    interpolation: {
      // React already handles XSS authenticationion
      escapeValue: false,
    },
  });

export default i18n;
