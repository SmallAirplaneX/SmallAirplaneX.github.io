// 应用主题到文档
export function applyTheme(theme: string) {
  const root = document.documentElement;

  // 设置主题属性
  if (theme == "light") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", theme);
  }
}

// 保存主题到本地存储
export function saveTheme(theme: string) {
  localStorage.setItem("theme", theme);
}

// 从本地存储加载主题
export function loadTheme(): string {
  return localStorage.getItem("theme") || "light";
}
