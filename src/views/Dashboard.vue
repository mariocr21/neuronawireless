<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";

import AppShell from "@/components/AppShell.vue";
import WidgetRenderer from "@/components/dashboard/WidgetRenderer.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import KpiCard from "@/components/ui/KpiCard.vue";
import SectionCard from "@/components/ui/SectionCard.vue";
import { useDashboardStore } from "@/stores/dashboard";
import { useRealtimeStore } from "@/stores/realtime";

const dashboardStore = useDashboardStore();
const realtimeStore = useRealtimeStore();
const liveStamp = ref("");

const widgetCount = computed(() => dashboardStore.sortedWidgets.length);
const activeCount = computed(() => dashboardStore.sortedWidgets.filter((item) => item.isActive).length);
const primaryWidgets = computed(() => dashboardStore.sortedWidgets.slice(0, 2));
const secondaryWidgets = computed(() => dashboardStore.sortedWidgets.slice(2));

const refresh = async () => {
  await dashboardStore.fetchDashboard();
  liveStamp.value = new Date().toISOString();
};

onMounted(async () => {
  await refresh();
  realtimeStore.startPolling("dashboard", refresh, 45000);
});

onUnmounted(() => {
  realtimeStore.stopPolling("dashboard");
});
</script>

<template>
  <AppShell>
    <div class="space-y-6">
      <section class="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <SectionCard class="overflow-hidden">
          <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div class="max-w-2xl">
              <div class="text-xs uppercase tracking-[0.35em] text-brand-green">Centro operativo</div>
              <h2 class="mt-3 text-3xl font-semibold sm:text-4xl">Un dashboard configurable para operar y vender inteligencia agricola.</h2>
              <p class="mt-4 text-brand-mist">
                Esta nueva experiencia mantiene el poder del dashboard actual, lo vuelve mas claro para usuarios ejecutivos y lo deja listo para operacion continua.
              </p>
            </div>
            <router-link
              :to="{ name: 'dashboard-manage' }"
              class="inline-flex items-center justify-center rounded-full bg-brand-green px-5 py-3 text-sm font-semibold text-brand-ink transition hover:bg-brand-spring"
            >
              Administrar widgets
            </router-link>
          </div>
        </SectionCard>

        <div class="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
          <KpiCard label="Widgets activos" :value="String(activeCount)" hint="Listos para renderizar" />
          <KpiCard label="Widgets totales" :value="String(widgetCount)" hint="Maximo actual: 5" tone="blue" />
          <KpiCard label="Sincronizacion" :value="realtimeStore.connected ? 'Activa' : 'Fuera de linea'" :hint="realtimeStore.statusLabel" tone="gold" />
        </div>
      </section>

      <div v-if="dashboardStore.loading" class="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-brand-mist">
        Cargando dashboard principal...
      </div>
      <EmptyState
        v-else-if="dashboardStore.error"
        title="No pudimos cargar el dashboard"
        :description="dashboardStore.error"
      >
        <template #actions>
          <button class="rounded-full bg-brand-green px-5 py-3 text-sm font-semibold text-brand-ink" type="button" @click="refresh">
            Reintentar
          </button>
        </template>
      </EmptyState>
      <EmptyState
        v-else-if="!widgetCount"
        title="Aun no hay widgets configurados"
        description="Configura el dashboard principal para comenzar a visualizar datos de estaciones, clima y sensores."
      >
        <template #actions>
          <router-link :to="{ name: 'dashboard-manage' }" class="rounded-full bg-brand-green px-5 py-3 text-sm font-semibold text-brand-ink">
            Configurar dashboard
          </router-link>
        </template>
      </EmptyState>
      <template v-else>
        <section class="grid gap-4 xl:grid-cols-2">
          <WidgetRenderer v-for="widget in primaryWidgets" :key="widget.id" :widget="widget" :live-stamp="liveStamp" />
        </section>

        <section class="grid gap-4 xl:grid-cols-3">
          <WidgetRenderer v-for="widget in secondaryWidgets" :key="widget.id" :widget="widget" :live-stamp="liveStamp" />
        </section>
      </template>
    </div>
  </AppShell>
</template>
