import eslint from "@eslint/js";
import eslintPluginVue from "eslint-plugin-vue";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config({
  extends: [
    eslint.configs.recommended,
    tseslint.configs.recommended,
    ...eslintPluginVue.configs["flat/recommended"],
  ],
  files: ["**/*.{ts,vue}"],
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    globals: globals.browser,
    parserOptions: {
      parser: tseslint.parser,
    },
  },
  // 0 off 1 warn 2 error
  rules: {
    "@typescript-eslint/ban-ts-comment": 0,
    "vue/first-attribute-linebreak": 0,
    "vue/html-indent": 0,
    "vue/html-closing-bracket-newline": 0,
    "vue/max-attributes-per-line": 0,
    quotes: [2, "double"],
    semi: [2, "always"],
    "no-console": 0,
  },
  ignores: ["node_modules/*", "dist/*", "build"],
});
