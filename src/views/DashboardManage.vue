<script setup>
import { computed, onMounted, ref } from "vue";

import AppShell from "@/components/AppShell.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import SectionCard from "@/components/ui/SectionCard.vue";
import { useDashboardStore } from "@/stores/dashboard";
import { useStationsStore } from "@/stores/stations";

const dashboardStore = useDashboardStore();
const stationsStore = useStationsStore();

const form = ref({
  id: null,
  title: "",
  description: "",
  type_chart: "line",
  chart_order: 1,
  sub_days: 7,
  min: 0,
  max: 100,
  status: true,
});

const sensorForm = ref({
  widgetId: null,
  chartSensorId: null,
  sensorId: "",
  color: "#59d94f",
});

const activeWidgetId = ref(null);

const allSensors = computed(() =>
  stationsStore.items.flatMap((station) =>
    station.sensors.map((sensor) => ({
      value: sensor.id,
      label: `${station.name} - ${sensor.name}`,
    })),
  ),
);

const selectedWidgetSensors = computed(() =>
  activeWidgetId.value ? dashboardStore.widgetSensors[activeWidgetId.value] || [] : [],
);

const resetForm = () => {
  form.value = {
    id: null,
    title: "",
    description: "",
    type_chart: "line",
    chart_order: 1,
    sub_days: 7,
    min: 0,
    max: 100,
    status: true,
  };
};

const editWidget = async (widget) => {
  form.value = {
    id: widget.id,
    title: widget.title,
    description: widget.description,
    type_chart: widget.type,
    chart_order: widget.order,
    sub_days: widget.days,
    min: widget.min,
    max: widget.max,
    status: widget.isActive,
  };
  activeWidgetId.value = widget.id;
  await dashboardStore.fetchWidgetSensors(widget.id);
};

const saveWidget = async () => {
  const payload = {
    title: form.value.title,
    description: form.value.description,
    type_chart: form.value.type_chart,
    chart_order: Number(form.value.chart_order),
    sub_days: Number(form.value.sub_days),
    min: Number(form.value.min),
    max: Number(form.value.max),
    status: Boolean(form.value.status),
  };

  await dashboardStore.saveWidget(payload, form.value.id);
  resetForm();
};

const loadSensors = async (widgetId) => {
  activeWidgetId.value = widgetId;
  sensorForm.value.widgetId = widgetId;
  sensorForm.value.chartSensorId = null;
  sensorForm.value.sensorId = "";
  sensorForm.value.color = "#59d94f";
  await dashboardStore.fetchWidgetSensors(widgetId);
};

const editSensor = (widgetId, sensor) => {
  activeWidgetId.value = widgetId;
  sensorForm.value = {
    widgetId,
    chartSensorId: sensor.id,
    sensorId: sensor.sensorId,
    color: sensor.color,
  };
};

const saveSensor = async () => {
  await dashboardStore.saveWidgetSensor(sensorForm.value);
  sensorForm.value.chartSensorId = null;
  sensorForm.value.sensorId = "";
  sensorForm.value.color = "#59d94f";
};

onMounted(async () => {
  await Promise.all([dashboardStore.fetchManageWidgets(), stationsStore.fetchStations()]);
});
</script>

<template>
  <AppShell>
    <div class="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <SectionCard>
        <div class="mb-6 flex items-center justify-between">
          <div>
            <div class="text-xs uppercase tracking-[0.35em] text-brand-green">Configuracion</div>
            <h2 class="mt-2 text-2xl font-semibold">Administrador del dashboard principal</h2>
          </div>
          <button class="rounded-full border border-white/10 px-4 py-2 text-sm text-brand-mist hover:text-white" type="button" @click="resetForm">
            Nuevo widget
          </button>
        </div>

        <div v-if="!dashboardStore.manageWidgets.length" class="mb-6">
          <EmptyState title="No hay widgets registrados" description="Crea el primer widget para empezar a personalizar el dashboard." />
        </div>

        <div class="space-y-4">
          <article
            v-for="widget in dashboardStore.manageWidgets"
            :key="widget.id"
            class="rounded-3xl border border-white/10 bg-black/20 p-4"
          >
            <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div class="text-xs uppercase tracking-[0.28em] text-brand-mist">Posicion {{ widget.order }}</div>
                <div class="mt-1 text-lg font-semibold">{{ widget.title }}</div>
                <div class="mt-1 text-sm text-brand-mist">{{ widget.description }}</div>
              </div>
              <div class="flex flex-wrap gap-2">
                <button class="rounded-full border border-white/10 px-3 py-2 text-sm text-brand-mist hover:text-white" type="button" @click="editWidget(widget)">
                  Editar
                </button>
                <button class="rounded-full border border-white/10 px-3 py-2 text-sm text-brand-mist hover:text-white" type="button" @click="loadSensors(widget.id)">
                  Sensores
                </button>
                <button class="rounded-full border border-white/10 px-3 py-2 text-sm text-brand-mist hover:text-white" type="button" @click="dashboardStore.toggleWidgetStatus(widget.id, !widget.isActive)">
                  {{ widget.isActive ? "Desactivar" : "Activar" }}
                </button>
                <button class="rounded-full border border-brand-danger/30 px-3 py-2 text-sm text-brand-danger" type="button" @click="dashboardStore.deleteWidget(widget.id)">
                  Eliminar
                </button>
              </div>
            </div>
          </article>
        </div>
      </SectionCard>

      <div class="space-y-6">
        <SectionCard>
          <div class="text-xs uppercase tracking-[0.35em] text-brand-green">Widget</div>
          <h3 class="mt-2 text-xl font-semibold">{{ form.id ? "Editar widget" : "Crear widget" }}</h3>
          <div class="mt-5 grid gap-4 sm:grid-cols-2">
            <input v-model="form.title" class="field-shell sm:col-span-2" placeholder="Nombre del widget" />
            <textarea v-model="form.description" class="field-shell min-h-24 sm:col-span-2" placeholder="Descripcion"></textarea>
            <select v-model="form.type_chart" class="field-shell">
              <option value="line">Linea</option>
              <option value="temperature">Temperatura</option>
              <option value="percentage">Porcentaje circular</option>
              <option value="percentage_medium">Porcentaje medio</option>
              <option value="percentage_line">Porcentaje lineal</option>
            </select>
            <input v-model.number="form.chart_order" class="field-shell" max="5" min="1" type="number" placeholder="Posicion" />
            <input v-model.number="form.sub_days" class="field-shell" min="1" type="number" placeholder="Dias atras" />
            <input v-model.number="form.min" class="field-shell" type="number" placeholder="Minimo" />
            <input v-model.number="form.max" class="field-shell" type="number" placeholder="Maximo" />
            <label class="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-brand-mist sm:col-span-2">
              <input v-model="form.status" type="checkbox" />
              Activo desde su creacion
            </label>
          </div>
          <button class="mt-5 rounded-full bg-brand-green px-5 py-3 text-sm font-semibold text-brand-ink" type="button" @click="saveWidget">
            Guardar widget
          </button>
          <p v-if="dashboardStore.error" class="mt-3 text-sm text-brand-danger">{{ dashboardStore.error }}</p>
        </SectionCard>

        <SectionCard>
          <div class="flex items-center justify-between gap-4">
            <div>
              <div class="text-xs uppercase tracking-[0.35em] text-brand-green">Sensores por widget</div>
              <h3 class="mt-2 text-xl font-semibold">{{ activeWidgetId ? `Widget ${activeWidgetId}` : "Selecciona un widget" }}</h3>
            </div>
            <div v-if="activeWidgetId" class="text-sm text-brand-mist">
              Limite: {{ dashboardStore.getSensorLimit(dashboardStore.manageWidgets.find((item) => item.id === activeWidgetId)?.type) }}
            </div>
          </div>

          <div v-if="activeWidgetId" class="mt-5 space-y-4">
            <div class="grid gap-4 sm:grid-cols-[1fr_120px]">
              <select v-model="sensorForm.sensorId" class="field-shell">
                <option value="">Selecciona un sensor</option>
                <option v-for="sensor in allSensors" :key="sensor.value" :value="sensor.value">{{ sensor.label }}</option>
              </select>
              <input v-model="sensorForm.color" class="field-shell" type="color" />
            </div>
            <button class="rounded-full bg-brand-green px-5 py-3 text-sm font-semibold text-brand-ink" type="button" @click="saveSensor">
              Guardar sensor
            </button>

            <div class="space-y-3">
              <article
                v-for="sensor in selectedWidgetSensors"
                :key="sensor.id"
                class="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
              >
                <div>
                  <div class="text-sm font-medium">{{ sensor.stationName }}</div>
                  <div class="text-sm text-brand-mist">{{ sensor.sensorName }}</div>
                </div>
                <div class="flex items-center gap-3">
                  <span class="h-5 w-5 rounded-full border border-white/20" :style="{ backgroundColor: sensor.color }"></span>
                  <button class="text-sm text-brand-mist hover:text-white" type="button" @click="editSensor(activeWidgetId, sensor)">Editar</button>
                  <button class="text-sm text-brand-danger" type="button" @click="dashboardStore.deleteWidgetSensor(activeWidgetId, sensor.id)">Eliminar</button>
                </div>
              </article>
            </div>
          </div>
          <EmptyState
            v-else
            title="Activa el panel de sensores"
            description="Selecciona un widget de la lista para configurar los sensores que deben alimentarlo."
          />
        </SectionCard>
      </div>
    </div>
  </AppShell>
</template>
