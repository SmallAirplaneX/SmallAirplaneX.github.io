import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // 主别名，指向 src 目录
      "@": path.resolve(__dirname, "src"),
      // 组件目录别名
      "@components": path.resolve(__dirname, "src/components"),
    },
  },
});
