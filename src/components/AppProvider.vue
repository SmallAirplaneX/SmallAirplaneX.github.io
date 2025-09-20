<template>
  <div class="app-provider">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { onMounted, provide, ref } from "vue";
import { useI18n } from "vue-i18n";
import { applyTheme, saveTheme, loadTheme } from "@/theme";

const { locale } = useI18n();

// 提供主题状态
const themes = ["light", "dark"];
provide("themes", themes);

// 提供切换主题的方法
const setTheme = (theme: string) => {
  applyTheme(theme);
  saveTheme(theme);
};
provide("setTheme", setTheme);

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
  applyTheme(loadTheme());
});
</script>

<style scoped>
.app-provider {
  height: 100%;
  width: 100%;
}
</style>
