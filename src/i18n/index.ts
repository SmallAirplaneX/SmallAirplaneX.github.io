import { createI18n } from "vue-i18n";
import zhCN from "@/locales/zh-CN.json";
import enUS from "@/locales/en-US.json";

// 定义消息类型
type MessageSchema = typeof zhCN;

// 创建 i18n 实例
const i18n = createI18n<[MessageSchema], "zh-CN" | "en-US">({
  legacy: false, // 使用 Composition API
  locale: "zh-CN", // 默认语言
  fallbackLocale: "en-US", // 回退语言
  messages: {
    "zh-CN": zhCN,
    "en-US": enUS,
  },
});

export function setupI18n(app: any) {
  app.use(i18n);
}

export default i18n;
