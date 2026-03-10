import { ref } from "vue";
import { defineStore } from "pinia";

import { apiClient, extractErrorMessage } from "@/services/http";
import { normalizeSensorSeries, normalizeStationSummary } from "@/domain/normalizers";

export const useGraphicsStore = defineStore("graphics", () => {
  const availableStations = ref([]);
  const series = ref([]);
  const loadingStations = ref(false);
  const loadingSeries = ref(false);
  const error = ref("");

  const fetchStations = async () => {
    loadingStations.value = true;

    try {
      const response = await apiClient.get("/app/stations");
      availableStations.value = (response.data.stations || []).map(normalizeStationSummary);
      return availableStations.value;
    } catch (err) {
      error.value = extractErrorMessage(err, "No fue posible cargar estaciones para analisis.");
      throw err;
    } finally {
      loadingStations.value = false;
    }
  };

  const fetchSeries = async ({ sensors, from, to }) => {
    loadingSeries.value = true;
    error.value = "";

    try {
      const response = await apiClient.post("/app/sensors/graphics", {
        sensors,
        since: `${from} 00:00:00`,
        until: `${to} 23:59:59`,
      });

      series.value = (response.data.sensors || []).map(normalizeSensorSeries);
      return series.value;
    } catch (err) {
      error.value = extractErrorMessage(err, "No fue posible cargar las graficas.");
      throw err;
    } finally {
      loadingSeries.value = false;
    }
  };

  return {
    availableStations,
    series,
    loadingStations,
    loadingSeries,
    error,
    fetchStations,
    fetchSeries,
  };
});
