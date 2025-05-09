import { createI18n } from "vue-i18n";
import en from "./en.json";
import zh from "./zh.json";

export const LANG_KEY = "lang";
export const DEFAULT_LANG = "zh-CN";

export const i18n = createI18n({
  locale:
    (document.documentElement.lang || localStorage.getItem(LANG_KEY)) ??
    DEFAULT_LANG,
  fallbackLocale: DEFAULT_LANG,
  messages: {
    "en-US": en,
    "zh-CN": zh,
  },
});

export default i18n;
