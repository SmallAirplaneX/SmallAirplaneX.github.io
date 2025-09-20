// src/styles/generateColors.js
import { writeFileSync } from "fs";

// 主题定义
const themes = {
  light: {
    name: "light",
    primary: { hue: 260, chroma: 0.15, lightnessBase: 0.6 }, // 蓝色调
    secondary: { hue: 40, chroma: 0.18, lightnessBase: 0.65 }, // 橙色调
    neutral: { hue: 0, chroma: 0, lightnessBase: 0.9 }, // 灰色
    background: { hue: 0, chroma: 0, lightness: 0.98 },
    text: { hue: 0, chroma: 0, lightness: 0.1 },
  },
  dark: {
    name: "dark",
    primary: { hue: 260, chroma: 0.15, lightnessBase: 0.7 },
    secondary: { hue: 40, chroma: 0.18, lightnessBase: 0.75 },
    neutral: { hue: 0, chroma: 0, lightnessBase: 0.2 },
    background: { hue: 0, chroma: 0, lightness: 0.1 },
    text: { hue: 0, chroma: 0, lightness: 0.95 },
  },
  forest: {
    name: "forest",
    primary: { hue: 160, chroma: 0.12, lightnessBase: 0.55 }, // 绿色调
    secondary: { hue: 20, chroma: 0.15, lightnessBase: 0.6 }, // 棕色调
    neutral: { hue: 0, chroma: 0, lightnessBase: 0.85 },
    background: { hue: 160, chroma: 0.02, lightness: 0.95 },
    text: { hue: 0, chroma: 0, lightness: 0.15 },
  },
};

// 亮度变体
const shades = [100, 200, 300, 400, 500, 600, 700];
const lightnessSteps = [0.3, 0.2, 0.1, 0, -0.1, -0.2, -0.3];

// 生成 CSS 内容
let cssContent = ":root {\n";

// 为每个主题生成 CSS 变量
Object.values(themes).forEach((theme) => {
  const prefix = theme.name === "light" ? "" : `[data-theme="${theme.name}"]`;
  cssContent += `  /* ${theme.name} theme */\n`;
  cssContent += prefix ? `${prefix} {\n` : "";

  ["primary", "secondary", "neutral"].forEach((colorType) => {
    const { hue, chroma, lightnessBase } = theme[colorType];
    shades.forEach((shade, index) => {
      const lightness = lightnessBase + lightnessSteps[index];
      cssContent += `    --${colorType}-${shade}: oklch(${lightness} ${chroma} ${hue});\n`;
    });
  });

  const { background, text } = theme;
  cssContent += `    --background: oklch(${background.lightness} ${background.chroma} ${background.hue});\n`;
  cssContent += `    --text: oklch(${text.lightness} ${text.chroma} ${text.hue});\n`;

  cssContent += prefix ? "}\n" : "";
});

cssContent += "}\n";

writeFileSync("./src/styles/colors.css", cssContent, "utf8");
console.log("colors.css has been generated successfully!");
