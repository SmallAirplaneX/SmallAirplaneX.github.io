// postcss.config.js
export default {
  plugins: {
    "postcss-nested": {},
    "postcss-custom-properties": {},
    "@csstools/postcss-oklab-function": {
      enableProgressiveCustomProperties: true, // 启用 RGB 和 P3 回退
    },
    "postcss-color-function": {},
    autoprefixer: {},
  },
};
