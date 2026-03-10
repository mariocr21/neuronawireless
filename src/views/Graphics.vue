<script setup>
import { computed, onMounted, ref } from "vue";
import VueApexCharts from "vue3-apexcharts";

import AppShell from "@/components/AppShell.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import KpiCard from "@/components/ui/KpiCard.vue";
import SectionCard from "@/components/ui/SectionCard.vue";
import { useGraphicsStore } from "@/stores/graphics";
import { formatMetric } from "@/utils/format";

const apexchart = VueApexCharts;
const graphicsStore = useGraphicsStore();
const selectedSensors = ref([]);

const today = new Date();
const lastWeek = new Date(today);
lastWeek.setDate(today.getDate() - 7);

const filters = ref({
  from: lastWeek.toISOString().slice(0, 10),
  to: today.toISOString().slice(0, 10),
});

const chartOptions = computed(() => ({
  chart: { background: "transparent", toolbar: { show: false }, foreColor: "#9fb4a8" },
  stroke: { curve: "smooth", width: 2.4 },
  dataLabels: { enabled: false },
  xaxis: { type: "datetime" },
  grid: { borderColor: "rgba(255,255,255,0.08)", strokeDashArray: 4 },
  tooltip: { theme: "dark" },
  legend: { position: "top", horizontalAlign: "left" },
}));

const chartSeries = computed(() =>
  graphicsStore.series.map((sensor) => ({
    name: sensor.name,
    data: sensor.points,
    color: sensor.color || undefined,
  })),
);

const summary = computed(() => {
  const items = graphicsStore.series;
  const avg = items.length ? items.reduce((acc, item) => acc + (item.stats.avg || 0), 0) / items.length : null;
  const max = items.length ? Math.max(...items.map((item) => item.stats.max || -Infinity)) : null;
  const min = items.length ? Math.min(...items.map((item) => item.stats.min || Infinity)) : null;
  return { avg, max, min };
});

const loadSeries = async () => {
  if (!selectedSensors.value.length) {
    return;
  }

  await graphicsStore.fetchSeries({
    sensors: selectedSensors.value,
    from: filters.value.from,
    to: filters.value.to,
  });
};

onMounted(() => {
  graphicsStore.fetchStations().catch(() => {});
});
</script>

<template>
  <AppShell>
    <div class="grid gap-6 xl:grid-cols-[360px_1fr]">
      <SectionCard>
        <div class="text-xs uppercase tracking-[0.35em] text-brand-green">Analisis</div>
        <h2 class="mt-2 text-2xl font-semibold">Graficas comparativas por sensor</h2>
        <div class="mt-5 space-y-4">
          <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <input v-model="filters.from" class="field-shell" type="date" />
            <input v-model="filters.to" class="field-shell" type="date" />
          </div>

          <div class="max-h-[28rem] space-y-3 overflow-y-auto pr-2">
            <article
              v-for="station in graphicsStore.availableStations"
              :key="station.id"
              class="rounded-2xl border border-white/10 bg-black/20 p-4"
            >
              <div class="mb-3 text-sm font-semibold">{{ station.name }}</div>
              <div class="space-y-2">
                <label v-for="sensor in station.sensors" :key="sensor.id" class="flex items-center gap-3 text-sm text-brand-mist">
                  <input v-model="selectedSensors" :value="sensor.id" type="checkbox" />
                  <span>{{ sensor.name }}</span>
                </label>
              </div>
            </article>
          </div>

          <button class="w-full rounded-full bg-brand-green px-5 py-3 text-sm font-semibold text-brand-ink" type="button" @click="loadSeries">
            Generar analisis
          </button>
        </div>
      </SectionCard>

      <div class="space-y-6">
        <section class="grid gap-4 md:grid-cols-3">
          <KpiCard label="Series" :value="String(graphicsStore.series.length)" hint="Sensores comparados" />
          <KpiCard label="Promedio" :value="formatMetric(summary.avg)" hint="Promedio agregado" tone="blue" />
          <KpiCard label="Rango maximo" :value="summary.max !== null && summary.min !== null ? `${formatMetric(summary.min)} - ${formatMetric(summary.max)}` : '--'" hint="Min / Max del periodo" tone="gold" />
        </section>

        <SectionCard>
          <div class="mb-5 flex items-center justify-between">
            <div>
              <div class="text-xs uppercase tracking-[0.35em] text-brand-green">Visualizacion</div>
              <h3 class="mt-2 text-xl font-semibold">Series temporales</h3>
            </div>
          </div>

          <div v-if="graphicsStore.loadingSeries" class="py-20 text-center text-brand-mist">Cargando graficas...</div>
          <EmptyState
            v-else-if="graphicsStore.error"
            title="No se pudieron cargar las graficas"
            :description="graphicsStore.error"
          />
          <EmptyState
            v-else-if="!graphicsStore.series.length"
            title="Selecciona sensores para analizar"
            description="Elige uno o varios sensores y un rango de fechas para construir la comparativa."
          />
          <div v-else class="space-y-5">
            <apexchart type="area" height="360" :options="chartOptions" :series="chartSeries" />
            <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div v-for="sensor in graphicsStore.series" :key="sensor.id" class="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div class="text-sm font-semibold">{{ sensor.sensorName }}</div>
                <div class="mt-1 text-sm text-brand-mist">{{ sensor.stationName }}</div>
                <div class="mt-4 space-y-1 text-sm text-brand-mist">
                  <div>Min: {{ formatMetric(sensor.stats.min, sensor.unitLabel) }}</div>
                  <div>Max: {{ formatMetric(sensor.stats.max, sensor.unitLabel) }}</div>
                  <div>Promedio: {{ formatMetric(sensor.stats.avg, sensor.unitLabel) }}</div>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  </AppShell>
</template>
