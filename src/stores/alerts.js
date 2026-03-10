import { ref } from "vue";
import { defineStore } from "pinia";

import { apiClient, extractErrorMessage } from "@/services/http";
import { normalizeAlertRule } from "@/domain/normalizers";

export const useAlertsStore = defineStore("alerts", () => {
  const rules = ref([]);
  const loading = ref(false);
  const saving = ref(false);
  const error = ref("");

  const fetchRules = async () => {
    loading.value = true;
    error.value = "";

    try {
      const response = await apiClient.get("/app/alerts");
      rules.value = (response.data.alerts || []).map(normalizeAlertRule);
      return rules.value;
    } catch (err) {
      error.value = extractErrorMessage(err, "No fue posible cargar las alertas.");
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createRule = async (payload) => {
    saving.value = true;

    try {
      await apiClient.post("/app/alerts", payload);
      await fetchRules();
    } catch (err) {
      error.value = extractErrorMessage(err, "No fue posible crear la alerta.");
      throw err;
    } finally {
      saving.value = false;
    }
  };

  const updateRule = async (payload) => {
    saving.value = true;

    try {
      await apiClient.put("/app/alerts", payload);
      await fetchRules();
    } catch (err) {
      error.value = extractErrorMessage(err, "No fue posible actualizar la alerta.");
      throw err;
    } finally {
      saving.value = false;
    }
  };

  const toggleRule = async ({ id, isActive }) => {
    await apiClient.post("/app/alerts/switch", { id, is_active: isActive });
    await fetchRules();
  };

  const deleteRule = async (id) => {
    await apiClient.delete(`/app/alerts/${id}`);
    await fetchRules();
  };

  return {
    rules,
    loading,
    saving,
    error,
    fetchRules,
    createRule,
    updateRule,
    toggleRule,
    deleteRule,
  };
});
