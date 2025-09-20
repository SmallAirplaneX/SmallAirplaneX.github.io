import { createApp } from "vue";
import "./styles/style.css";
import App from "@/App.vue";
import { setupRouter } from "@/router"; //引入路由启动器
import { setupPinia } from "@/store"; //引入状态管理启动器
import { setupI18n } from "@/i18n"; //引入国际化启动器

async function setupApp() {
  const app = createApp(App);

  setupPinia(app);
  setupI18n(app); // 初始化国际化

  await setupRouter(app); //传入app，等待路由启动完成

  app.mount("#app"); //挂载在节点app上
}

setupApp(); //启动app
