import { computed, ref } from "vue";
import { defineStore } from "pinia";

import { fetchInertiaPage, appClient, extractErrorMessage } from "@/services/http";
import { normalizeWidget, normalizeWidgetSensor } from "@/domain/normalizers";

const sensorLimits = {
  line: 5,
  temperature: 4,
  percentage: 1,
  percentage_medium: 1,
  percentage_line: 5,
};

export const useDashboardStore = defineStore("dashboard", () => {
  const widgets = ref([]);
  const manageWidgets = ref([]);
  const widgetSensors = ref({});
  const loading = ref(false);
  const saving = ref(false);
  const error = ref("");

  const sortedWidgets = computed(() =>
    [...widgets.value].sort((a, b) => a.order - b.order),
  );

  const getSensorLimit = (type) => sensorLimits[type] || 1;

  const fetchDashboard = async () => {
    loading.value = true;
    error.value = "";

    try {
      const props = await fetchInertiaPage("/");
      widgets.value = (props.dashboardCharts || []).map(normalizeWidget);
    } catch (err) {
      error.value = extractErrorMessage(err, "No fue posible cargar el dashboard.");
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchManageWidgets = async () => {
    loading.value = true;
    error.value = "";

    try {
      const props = await fetchInertiaPage("/dashboard/chart/administrar");
      manageWidgets.value = (props.dashboardCharts || []).map(normalizeWidget);
      return manageWidgets.value;
    } catch (err) {
      error.value = extractErrorMessage(err, "No fue posible cargar la administracion del dashboard.");
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchWidgetSensors = async (widgetId) => {
    const response = await appClient.get(`/dashboard/chart/administrar/${widgetId}/sensor`);
    widgetSensors.value = {
      ...widgetSensors.value,
      [widgetId]: (response.data.chartSensors || []).map(normalizeWidgetSensor),
    };

    return widgetSensors.value[widgetId];
  };

  const saveWidget = async (payload, widgetId = null) => {
    saving.value = true;
    error.value = "";

    try {
      if (widgetId) {
        await appClient.put(`/dashboard/chart/administrar/editar/${widgetId}`, payload);
      } else {
        await appClient.post("/dashboard/chart/administrar", payload);
      }

      await fetchManageWidgets();
      await fetchDashboard();
    } catch (err) {
      error.value = extractErrorMessage(err, "No fue posible guardar el widget.");
      throw err;
    } finally {
      saving.value = false;
    }
  };

  const toggleWidgetStatus = async (widgetId, status) => {
    await appClient.post(`/dashboard/chart/administrar/${widgetId}/estatus`, { status });
    await Promise.all([fetchManageWidgets(), fetchDashboard()]);
  };

  const deleteWidget = async (widgetId) => {
    await appClient.delete(`/dashboard/chart/administrar/${widgetId}`);
    await Promise.all([fetchManageWidgets(), fetchDashboard()]);
    const next = { ...widgetSensors.value };
    delete next[widgetId];
    widgetSensors.value = next;
  };

  const saveWidgetSensor = async ({ widgetId, chartSensorId, sensorId, color }) => {
    saving.value = true;
    error.value = "";

    try {
      if (chartSensorId) {
        await appClient.put(`/dashboard/chart/administrar/sensor/${chartSensorId}`, {
          sensor_id: sensorId,
          color,
        });
      } else {
        await appClient.post("/dashboard/chart/administrar/sensor", {
          dashboard_chart_id: widgetId,
          sensor_id: sensorId,
          color,
        });
      }

      await Promise.all([fetchWidgetSensors(widgetId), fetchManageWidgets(), fetchDashboard()]);
    } catch (err) {
      error.value = extractErrorMessage(err, "No fue posible guardar el sensor del widget.");
      throw err;
    } finally {
      saving.value = false;
    }
  };

  const deleteWidgetSensor = async (widgetId, chartSensorId) => {
    await appClient.delete(`/dashboard/chart/administrar/${widgetId}/${chartSensorId}`);
    await Promise.all([fetchWidgetSensors(widgetId), fetchManageWidgets(), fetchDashboard()]);
  };

  return {
    widgets,
    manageWidgets,
    widgetSensors,
    loading,
    saving,
    error,
    sortedWidgets,
    getSensorLimit,
    fetchDashboard,
    fetchManageWidgets,
    fetchWidgetSensors,
    saveWidget,
    toggleWidgetStatus,
    deleteWidget,
    saveWidgetSensor,
    deleteWidgetSensor,
  };
});
