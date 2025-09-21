import { createRouter, createWebHistory } from "vue-router";
import { basicRoutes } from "@/router/routers";

const router = createRouter({
  history: createWebHistory(),
  routes: basicRoutes,
});

export async function setupRouter(app: any) {
  app.use(router);
}
