import { createRouter, createWebHashHistory } from "vue-router";
import { basicRoutes } from "@/router/routers";

const router = createRouter({
  history: createWebHashHistory("/"),
  routes: basicRoutes,
});

export async function setupRouter(app: any) {
  app.use(router);
}
