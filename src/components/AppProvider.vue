<template>
  <div class="app-provider">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { onMounted, provide, ref } from "vue";
import { useI18n } from "vue-i18n";
import {
  getTheme,
  applyTheme,
  saveTheme,
  loadTheme,
  themes,
  type Theme,
} from "@/theme";

const { locale, t } = useI18n();

// 提供主题状态
const currentTheme = ref<Theme>(getTheme(loadTheme()));
provide("currentTheme", currentTheme);

// 提供切换主题的方法
const switchTheme = (themeId: string) => {
  const theme = getTheme(themeId);
  currentTheme.value = theme;
  saveTheme(themeId);
  applyTheme(theme);
};
provide("switchTheme", switchTheme);

// 提供可用主题列表
provide("themes", themes);

// 提供语言切换方法
const switchLanguage = (lang: string) => {
  locale.value = lang;
  localStorage.setItem("language", lang);
};
provide("switchLanguage", switchLanguage);

// 提供当前语言
provide("currentLanguage", locale);

// 初始化应用设置
onMounted(() => {
  // 初始化语言设置
  const savedLanguage = localStorage.getItem("language");
  if (savedLanguage) {
    locale.value = savedLanguage;
  }

  // 初始化主题
  const savedThemeId = loadTheme();
  currentTheme.value = getTheme(savedThemeId);
  applyTheme(currentTheme.value);
});
</script>

<style scoped>
.app-provider {
  height: 100%;
  width: 100%;
}
</style>
