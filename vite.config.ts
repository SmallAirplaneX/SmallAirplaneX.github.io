import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  css: {
    postcss: "./postcss.config.js", // 显式指定 PostCSS 配置文件
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // 主别名，指向 src 目录
      "@com": path.resolve(__dirname, "src/components"), // 组件目录别名
      "@components": path.resolve(__dirname, "src/components"), // 组件目录别名
    },
  },
});
