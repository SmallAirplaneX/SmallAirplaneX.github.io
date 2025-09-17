// 主题配置接口
export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    border: string;
  };
}

// 预定义主题
export const themes: Theme[] = [
  {
    id: "light",
    name: "浅色主题",
    colors: {
      primary: "--color-primary",
      secondary: "--color-secondary",
      background: "--color-background",
      surface: "--color-surface",
      text: "--color-text",
      border: "--color-border",
    },
  },
  {
    id: "dark",
    name: "深色主题",
    colors: {
      primary: "--color-primary",
      secondary: "--color-secondary",
      background: "--color-background",
      surface: "--color-surface",
      text: "--color-text",
      border: "--color-border",
    },
  },
];

// 获取主题
export function getTheme(themeId: string): Theme {
  return themes.find((theme) => theme.id === themeId) || themes[0]!;
}

// 应用主题到文档
export function applyTheme(theme: Theme) {
  const root = document.documentElement;

  // 设置主题类名
  if (theme.id === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

// 保存主题到本地存储
export function saveTheme(themeId: string) {
  localStorage.setItem("theme", themeId);
}

// 从本地存储加载主题
export function loadTheme(): string {
  return localStorage.getItem("theme") || "light";
}
