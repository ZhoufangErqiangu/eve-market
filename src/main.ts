import { ElLoading, ElMessage, ElNotification } from "element-plus";
import "element-plus/es/components/loading/style/css";
import "element-plus/es/components/message/style/css";
import "element-plus/es/components/notification/style/css";
import "element-plus/theme-chalk/base.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import i18n from "./locale";
import { router } from "./router";
import "./styles.css";

createApp(App)
  .use(createPinia())
  .use(router)
  .use(i18n)
  .use(ElLoading)
  .use(ElMessage)
  .use(ElNotification)
  .mount("#app");
