import { createRouter, createWebHistory } from "vue-router";

import { useAuthStore } from "@/stores/auth";

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login.vue"),
    meta: { guestOnly: true, title: "Acceso" },
  },
  {
    path: "/",
    redirect: { name: "dashboard" },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("@/views/Dashboard.vue"),
    meta: { requiresAuth: true, title: "Dashboard Principal" },
  },
  {
    path: "/dashboard/manage",
    name: "dashboard-manage",
    component: () => import("@/views/DashboardManage.vue"),
    meta: { requiresAuth: true, title: "Administrador de Widgets" },
  },
  {
    path: "/stations",
    name: "stations",
    component: () => import("@/views/Stations.vue"),
    meta: { requiresAuth: true, title: "Estaciones de Monitoreo" },
  },
  {
    path: "/graphics",
    name: "graphics",
    component: () => import("@/views/Graphics.vue"),
    meta: { requiresAuth: true, title: "Analisis Grafico" },
  },
  {
    path: "/alerts",
    name: "alerts",
    component: () => import("@/views/Alerts.vue"),
    meta: { requiresAuth: true, title: "Centro de Alertas" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  if (!authStore.ready) {
    await authStore.bootstrap();
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: "login" };
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return { name: "dashboard" };
  }

  return true;
});

export default router;
