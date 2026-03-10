import { computed, ref } from "vue";
import { defineStore } from "pinia";

export const useRealtimeStore = defineStore("realtime", () => {
  const connected = ref(navigator.onLine);
  const mode = ref("polling");
  const lastHeartbeat = ref(null);
  const timers = new Map();

  const statusLabel = computed(() => {
    if (!connected.value) {
      return "Sin conexion";
    }

    return mode.value === "polling" ? "Sincronizacion activa" : "Tiempo real activo";
  });

  const beat = () => {
    connected.value = navigator.onLine;
    lastHeartbeat.value = new Date().toISOString();
  };

  const startPolling = (key, callback, intervalMs = 30000) => {
    if (timers.has(key)) {
      clearInterval(timers.get(key));
    }

    callback();
    const timer = window.setInterval(async () => {
      beat();
      await callback();
    }, intervalMs);

    timers.set(key, timer);
  };

  const stopPolling = (key) => {
    if (timers.has(key)) {
      clearInterval(timers.get(key));
      timers.delete(key);
    }
  };

  const stopAll = () => {
    timers.forEach((timer) => clearInterval(timer));
    timers.clear();
  };

  window.addEventListener("online", beat);
  window.addEventListener("offline", () => {
    connected.value = false;
  });

  return {
    connected,
    mode,
    lastHeartbeat,
    statusLabel,
    beat,
    startPolling,
    stopPolling,
    stopAll,
  };
});
