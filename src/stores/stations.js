import { computed, ref } from "vue";
import { defineStore } from "pinia";

import { apiClient, extractErrorMessage } from "@/services/http";
import { normalizeStationSummary } from "@/domain/normalizers";

export const useStationsStore = defineStore("stations", () => {
  const items = ref([]);
  const loading = ref(false);
  const error = ref("");
  const lastUpdatedAt = ref(null);

  const totalOnline = computed(() => items.value.filter((station) => station.isOnline).length);

  const fetchStations = async () => {
    loading.value = true;
    error.value = "";

    try {
      const response = await apiClient.get("/app/stations");
      items.value = (response.data.stations || []).map(normalizeStationSummary);
      lastUpdatedAt.value = new Date().toISOString();
      return items.value;
    } catch (err) {
      error.value = extractErrorMessage(err, "No fue posible cargar las estaciones.");
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    items,
    loading,
    error,
    lastUpdatedAt,
    totalOnline,
    fetchStations,
  };
});
