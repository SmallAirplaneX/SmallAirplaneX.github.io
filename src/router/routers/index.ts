//在此处配置路由条目并导出
export const basicRoutes = [
  {
    name: "home",
    path: "/",
    component: () => import("@/layouts/DefaultLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("@/page/HomePage.vue"),
      },
    ],
  },
  {
    name: "about",
    path: "/about",
    component: () => import("@/layouts/DefaultLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("@/page/AboutPage.vue"),
      },
    ],
  },
  {
    name: "node",
    path: "/node",
    component: () => import("@/layouts/DefaultLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("@/page/NodePage.vue"),
      },
    ],
  },
  {
    name: "colordemo",
    path: "/color",
    component: () => import("@com/ColorDemo.vue"),
  },
  // 404 页面重定向
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];
