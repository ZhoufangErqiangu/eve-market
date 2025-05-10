import { version } from "@liuhlightning/vite-plugins";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
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
});
