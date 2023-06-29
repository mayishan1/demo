import { createRouter, createWebHashHistory } from "vue-router";

import Prod from "./pages/prod/index.vue";

const routes = [{ path: "/", component: Prod }];

const router = createRouter({
  history: createWebHashHistory("/"),
  routes,
});

export default router;
