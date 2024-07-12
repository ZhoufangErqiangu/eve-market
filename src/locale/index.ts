import { createI18n } from "vue-i18n";
import en from "./en.json";
import zh from "./zh.json";

export const defaultLang = "en-US";

export const i18n = createI18n({
  locale:
    (document.documentElement.lang || localStorage.getItem("lang")) ??
    defaultLang,
  messages: {
    "en-US": en,
    "zh-CN": zh,
  },
});

export function setLang(lang: string) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  if (!i18n.global.availableLocales.includes(lang)) {
    console.warn("unknown lang", lang);
    return;
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  i18n.global.locale = lang;
  document.documentElement.lang = lang;
  localStorage.setItem("lang", lang);
}

export default i18n;
