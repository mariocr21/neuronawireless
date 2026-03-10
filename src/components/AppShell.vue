<script setup>
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useAuthStore } from "@/stores/auth";
import { useNotificationsStore } from "@/stores/notifications";
import { useRealtimeStore } from "@/stores/realtime";

const authStore = useAuthStore();
const notificationsStore = useNotificationsStore();
const realtimeStore = useRealtimeStore();
const route = useRoute();
const router = useRouter();

const navigation = computed(() => [
  { name: "dashboard", label: "Dashboard", icon: "grid" },
  { name: "dashboard-manage", label: "Widgets", icon: "sliders" },
  { name: "stations", label: "Estaciones", icon: "tower" },
  { name: "graphics", label: "Graficas", icon: "chart" },
  { name: "alerts", label: "Alertas", icon: "bell" },
]);

const pageTitle = computed(() => route.meta?.title || "Neurona Wireless");

const logout = async () => {
  await authStore.logout();
  notificationsStore.reset();
  realtimeStore.stopAll();
  router.push({ name: "login" });
};

onMounted(() => {
  if (authStore.isAuthenticated && !notificationsStore.items.length) {
    notificationsStore.fetchNotifications().catch(() => {});
  }
});
</script>

<template>
  <div class="min-h-screen bg-app-shell text-white">
    <div class="pointer-events-none fixed inset-0 opacity-70">
      <div class="absolute inset-0 bg-grid-pattern"></div>
      <div class="absolute -left-32 top-10 h-80 w-80 rounded-full bg-brand-green/12 blur-3xl"></div>
      <div class="absolute right-0 top-0 h-[28rem] w-[28rem] rounded-full bg-brand-sky/10 blur-3xl"></div>
      <div class="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-brand-gold/10 blur-3xl"></div>
    </div>

    <div class="relative mx-auto flex min-h-screen max-w-[1600px]">
      <aside class="hidden w-72 shrink-0 border-r border-white/8 bg-black/30 px-5 py-6 backdrop-blur-xl lg:flex lg:flex-col">
        <div class="mb-10 flex items-center gap-3">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-green text-brand-ink shadow-soft-glow">
            NW
          </div>
          <div>
            <div class="text-xs uppercase tracking-[0.35em] text-brand-mist">Mexico Agri Intelligence</div>
            <div class="text-lg font-semibold">Neurona Wireless</div>
          </div>
        </div>

        <nav class="space-y-2">
          <router-link
            v-for="item in navigation"
            :key="item.name"
            :to="{ name: item.name }"
            class="group flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition"
            :class="route.name === item.name ? 'bg-white/10 text-white shadow-card ring-1 ring-white/10' : 'text-brand-mist hover:bg-white/5 hover:text-white'"
          >
            <span>{{ item.label }}</span>
            <span class="text-xs uppercase tracking-[0.3em] text-brand-green/70 group-hover:text-brand-green">01</span>
          </router-link>
        </nav>

        <div class="mt-auto rounded-3xl border border-white/10 bg-white/5 p-4">
          <div class="mb-3 flex items-center justify-between">
            <span class="text-xs uppercase tracking-[0.35em] text-brand-mist">Sincronizacion</span>
            <span class="h-2.5 w-2.5 rounded-full" :class="realtimeStore.connected ? 'bg-brand-green shadow-soft-glow' : 'bg-brand-danger'"></span>
          </div>
          <div class="text-sm font-medium">{{ realtimeStore.statusLabel }}</div>
          <div class="mt-2 text-sm text-brand-mist">Notificaciones sin leer: {{ notificationsStore.unread }}</div>
        </div>
      </aside>

      <div class="flex min-h-screen min-w-0 flex-1 flex-col">
        <header class="sticky top-0 z-20 border-b border-white/8 bg-black/25 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div class="text-xs uppercase tracking-[0.35em] text-brand-mist">Operacion premium</div>
              <h1 class="mt-1 text-2xl font-semibold sm:text-3xl">{{ pageTitle }}</h1>
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <router-link
                :to="{ name: 'stations' }"
                class="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-brand-mist transition hover:border-brand-green/50 hover:text-white"
              >
                {{ authStore.user?.name || authStore.user?.email || "Usuario activo" }}
              </router-link>
              <div class="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-brand-mist">
                {{ notificationsStore.unread }} pendientes
              </div>
              <button
                class="rounded-full bg-brand-green px-4 py-2 text-sm font-semibold text-brand-ink transition hover:bg-brand-spring"
                type="button"
                @click="logout"
              >
                Cerrar sesion
              </button>
            </div>
          </div>
        </header>

        <main class="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>
