// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface ImportMetaEnv {
  // 标题
  readonly VITE_APP_TITLE: string;
  // API地址
  readonly VITE_APP_BASE_API: string;
  // ESI地址
  readonly VITE_APP_ESI_API: string;
  // DB名字
  readonly VITE_APP_DB_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
