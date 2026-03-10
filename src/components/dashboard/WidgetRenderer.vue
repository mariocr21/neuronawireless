<script setup>
import { computed, onMounted, ref, watch } from "vue";
import VueApexCharts from "vue3-apexcharts";

import SectionCard from "@/components/ui/SectionCard.vue";
import { appClient } from "@/services/http";
import { normalizeSensorSeries } from "@/domain/normalizers";
import { formatMetric } from "@/utils/format";

const props = defineProps({
  widget: { type: Object, required: true },
  liveStamp: { type: String, default: "" },
});

const apexchart = VueApexCharts;
const loading = ref(false);
const error = ref("");
const payload = ref([]);

const chartSeries = computed(() =>
  payload.value.map((sensor) => ({
    name: sensor.name,
    data: sensor.points.map((point) => ({ x: point.x, y: point.y })),
    color: sensor.color || undefined,
  })),
);

const currentSensors = computed(() => payload.value.slice(0, 4));

const chartOptions = computed(() => ({
  chart: {
    toolbar: { show: false },
    background: "transparent",
    foreColor: "#9fb4a8",
    animations: { enabled: true },
  },
  stroke: { curve: "smooth", width: 2.4 },
  fill: {
    type: "gradient",
    gradient: { opacityFrom: 0.32, opacityTo: 0.05 },
  },
  grid: { borderColor: "rgba(255,255,255,0.08)", strokeDashArray: 4 },
  xaxis: { type: "datetime", labels: { datetimeUTC: false } },
  yaxis: { labels: { formatter: (value) => value?.toFixed?.(1) || value } },
  legend: { position: "top", horizontalAlign: "left" },
  tooltip: { theme: "dark" },
}));

const loadWidget = async () => {
  loading.value = true;
  error.value = "";

  try {
    const endpoint =
      props.widget.type === "line"
        ? `/dashboard/chart/sensor/${props.widget.id}/chart`
        : `/dashboard/chart/sensor/${props.widget.id}/temperature`;

    const response = await appClient.get(endpoint);
    const raw = Array.isArray(response.data) ? response.data : response.data?.chartSensors || [];
    payload.value = raw.map(normalizeSensorSeries);
  } catch (err) {
    error.value = err?.response?.data?.message || "No fue posible cargar este widget.";
    payload.value = [];
  } finally {
    loading.value = false;
  }
};

watch(
  () => props.liveStamp,
  () => {
    loadWidget();
  },
);

onMounted(loadWidget);
</script>

<template>
  <SectionCard class="h-full">
    <div class="flex h-full flex-col">
      <div class="mb-5 flex items-start justify-between gap-4">
        <div>
          <div class="text-xs uppercase tracking-[0.32em] text-brand-mist">Widget {{ widget.order }}</div>
          <div class="mt-1 text-xl font-semibold">{{ widget.title }}</div>
          <div class="mt-1 text-sm text-brand-mist">{{ widget.description || "Visualizacion operativa del dashboard." }}</div>
        </div>
        <div class="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-brand-mist">
          {{ widget.type }}
        </div>
      </div>

      <div v-if="loading" class="flex flex-1 items-center justify-center text-sm text-brand-mist">
        Sincronizando widget...
      </div>
      <div v-else-if="error" class="flex flex-1 items-center justify-center text-sm text-brand-danger">
        {{ error }}
      </div>
      <div v-else-if="!payload.length" class="flex flex-1 items-center justify-center text-sm text-brand-mist">
        Sin sensores configurados o sin datos disponibles.
      </div>
      <template v-else>
        <div v-if="widget.type === 'line'" class="min-h-[280px] flex-1">
          <apexchart type="area" height="280" :options="chartOptions" :series="chartSeries" />
        </div>
        <div v-else class="grid flex-1 gap-4 sm:grid-cols-2">
          <div
            v-for="sensor in currentSensors"
            :key="sensor.id"
            class="rounded-3xl border border-white/10 bg-black/20 p-4"
          >
            <div class="text-xs uppercase tracking-[0.24em] text-brand-mist">{{ sensor.stationName }}</div>
            <div class="mt-2 text-lg font-semibold">{{ sensor.sensorName }}</div>
            <div class="mt-4 text-3xl font-semibold text-brand-green">
              {{ formatMetric(sensor.current ?? sensor.points.at(-1)?.y ?? sensor.stats.avg, sensor.unitLabel) }}
            </div>
            <div class="mt-3 text-sm text-brand-mist">
              Min {{ formatMetric(sensor.stats.min, sensor.unitLabel) }} / Max {{ formatMetric(sensor.stats.max, sensor.unitLabel) }}
            </div>
          </div>
        </div>
      </template>
    </div>
  </SectionCard>
</template>
