import { Locales, type IntlayerConfig } from "intlayer";
import { syncJSON } from "@intlayer/sync-json-plugin";

const config: IntlayerConfig = {
  internationalization: {
    locales: [Locales.ENGLISH, Locales.FRENCH, Locales.SPANISH ,Locales.BENGALI, Locales.ARABIC],
    defaultLocale: Locales.ENGLISH,
  },

 ai: {
     provider: "openrouter", 
    model: "meta-llama/llama-3.3-70b-instruct", 
    apiKey: process.env.OPENROUTER_API_KEY || "", 
  },

  plugins: [
    syncJSON({
      source: ({ key, locale }: { key: string; locale: string }) =>
        `./locales/${locale}/${key}.json`,
    }),
  ],
};

export default config;
