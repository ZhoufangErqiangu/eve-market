import { version } from "@liuhlightning/vite-plugins";
import vue from "@vitejs/plugin-vue";
import { defineConfig, type ConfigEnv } from "vite";

// https://vitejs.dev/config/
export default defineConfig((_: ConfigEnv) => ({
  plugins: [vue(), version()],
  clearScreen: false,
  build: {
    rollupOptions: {
      output: {
        sourcemap: true,
        manualChunks: {
          base: ["axios", "dayjs"],
          vue: ["vue", "vue-router", "pinia"],
          element: ["element-plus", "@element-plus/icons-vue"],
          echarts: ["echarts"],
        },
      },
    },
  },
}));
