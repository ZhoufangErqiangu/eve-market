import { version } from "@liuhlightning/vite-plugins";
import vue from "@vitejs/plugin-vue";
import { defineConfig, type ConfigEnv } from "vite";

// https://vitejs.dev/config/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default defineConfig((_: ConfigEnv) => ({
  base: "/",
  plugins: [vue(), version()],
  clearScreen: false,
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          base: ["dayjs"],
          vue: ["vue", "vue-router", "pinia"],
          element: ["element-plus", "@element-plus/icons-vue"],
          echarts: ["echarts"],
        },
      },
    },
  },
}));
