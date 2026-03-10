<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";

import AppShell from "@/components/AppShell.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import KpiCard from "@/components/ui/KpiCard.vue";
import SectionCard from "@/components/ui/SectionCard.vue";
import { useRealtimeStore } from "@/stores/realtime";
import { useStationsStore } from "@/stores/stations";
import { formatDateTime, formatMetric } from "@/utils/format";

const stationsStore = useStationsStore();
const realtimeStore = useRealtimeStore();
const query = ref("");
const status = ref("all");

const filteredStations = computed(() =>
  stationsStore.items.filter((station) => {
    const matchesQuery =
      !query.value ||
      station.name.toLowerCase().includes(query.value.toLowerCase()) ||
      station.cropName.toLowerCase().includes(query.value.toLowerCase());
    const matchesStatus = status.value === "all" || station.status === status.value;
    return matchesQuery && matchesStatus;
  }),
);

const refresh = () => stationsStore.fetchStations();

onMounted(async () => {
  await refresh();
  realtimeStore.startPolling("stations", refresh, 60000);
});

onUnmounted(() => {
  realtimeStore.stopPolling("stations");
});
</script>

<template>
  <AppShell>
    <div class="space-y-6">
      <section class="grid gap-4 md:grid-cols-4">
        <KpiCard label="Estaciones" :value="String(stationsStore.items.length)" hint="Total monitoreado" />
        <KpiCard label="Online" :value="String(stationsStore.totalOnline)" hint="Con datos recientes" tone="green" />
        <KpiCard label="Offline" :value="String(stationsStore.items.length - stationsStore.totalOnline)" hint="Revisar conectividad" tone="blue" />
        <KpiCard label="Ultima sync" :value="stationsStore.lastUpdatedAt ? 'Actualizada' : 'Pendiente'" :hint="stationsStore.lastUpdatedAt ? formatDateTime(stationsStore.lastUpdatedAt) : 'Sin carga'" tone="gold" />
      </section>

      <SectionCard>
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div class="text-xs uppercase tracking-[0.35em] text-brand-green">Operacion en vivo</div>
            <h2 class="mt-2 text-2xl font-semibold">Estaciones y sensores disponibles para monitoreo</h2>
          </div>
          <div class="grid gap-3 sm:grid-cols-[1fr_180px_auto]">
            <input v-model="query" class="field-shell" placeholder="Buscar por estacion o cultivo" />
            <select v-model="status" class="field-shell">
              <option value="all">Todos los estados</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
            <button class="rounded-full bg-brand-green px-5 py-3 text-sm font-semibold text-brand-ink" type="button" @click="refresh">Actualizar</button>
          </div>
        </div>
      </SectionCard>

      <div v-if="stationsStore.loading" class="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-brand-mist">
        Cargando estaciones...
      </div>
      <EmptyState
        v-else-if="stationsStore.error"
        title="No se pudieron cargar las estaciones"
        :description="stationsStore.error"
      />
      <EmptyState
        v-else-if="!filteredStations.length"
        title="No hay estaciones para este filtro"
        description="Ajusta el texto de busqueda o el estado para ver mas resultados."
      />
      <section v-else class="grid gap-4 xl:grid-cols-2">
        <SectionCard v-for="station in filteredStations" :key="station.id">
          <div class="flex flex-col gap-5">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div class="flex items-center gap-3">
                  <span class="h-3 w-3 rounded-full" :class="station.isOnline ? 'bg-brand-green shadow-soft-glow' : 'bg-brand-danger'"></span>
                  <h3 class="text-xl font-semibold">{{ station.name }}</h3>
                </div>
                <div class="mt-2 text-sm text-brand-mist">Cultivo activo: {{ station.cropName }}</div>
                <div class="mt-1 text-sm text-brand-mist">Ultima señal: {{ formatDateTime(station.lastOnline) }}</div>
              </div>
              <div class="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-brand-mist">
                {{ station.status }}
              </div>
            </div>

            <div class="grid gap-3 sm:grid-cols-3">
              <div class="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div class="text-xs uppercase tracking-[0.2em] text-brand-mist">Temperatura</div>
                <div class="mt-2 text-2xl font-semibold text-brand-green">{{ formatMetric(station.metrics.temperature.value, station.metrics.temperature.units || "C") }}</div>
              </div>
              <div class="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div class="text-xs uppercase tracking-[0.2em] text-brand-mist">Humedad</div>
                <div class="mt-2 text-2xl font-semibold text-brand-sky">{{ formatMetric(station.metrics.humidity.value, station.metrics.humidity.units || "%") }}</div>
              </div>
              <div class="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div class="text-xs uppercase tracking-[0.2em] text-brand-mist">Suelo</div>
                <div class="mt-2 text-2xl font-semibold text-brand-gold">{{ formatMetric(station.metrics.soilMoisture.value, station.metrics.soilMoisture.units || "%") }}</div>
              </div>
            </div>

            <div class="rounded-2xl border border-white/10 bg-black/15 p-4">
              <div class="mb-3 text-xs uppercase tracking-[0.2em] text-brand-mist">Sensores visibles</div>
              <div class="grid gap-3 sm:grid-cols-2">
                <div v-for="sensor in station.sensors" :key="sensor.id" class="rounded-2xl border border-white/10 bg-black/20 p-3">
                  <div class="text-sm font-medium">{{ sensor.name }}</div>
                  <div class="mt-1 text-sm text-brand-mist">Ultimo valor: {{ formatMetric(sensor.lastValue, sensor.units) }}</div>
                  <div class="mt-1 text-xs text-brand-mist">Registro: {{ formatDateTime(sensor.lastRegisteredAt) }}</div>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>
      </section>
    </div>
  </AppShell>
</template>
