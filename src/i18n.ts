import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

/**
 * Import generated JSON files from Intlayer.
 * Since your content key is "app", the file names are app.json.
 */
import en from "../locales/en/translation.json"; // English translations
import fr from "../locales/fr/translation.json"; // French translations
import es from "../locales/es/translation.json";
import bn from "../locales/bn/translation.json"; // Bengali translations
import ar from "../locales/ar/translation.json";    // Arabic

i18n
  // Detect user language automatically
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      es: { translation: es },
     bn: { translation: bn },
      ar: { translation: ar },
    },

    // Default language if detection fails
    fallbackLng: "en",

    // List of all supported languages in your project
    supportedLngs: ["en", "fr", "es", "bn", "ar"],

    detection: {
      // Order in which user language is looked up
      order: ["localStorage", "cookie", "navigator"],
      // Cache user language on these locations
      caches: ["localStorage", "cookie"],
    },

    interpolation: {
      // React already handles XSS protection
      escapeValue: false, 
    },
  });

export default i18n;
