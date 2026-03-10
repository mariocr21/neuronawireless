import { computed, ref } from "vue";
import { defineStore } from "pinia";

import { apiClient, authStorageKey, extractErrorMessage } from "@/services/http";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const accessToken = ref(localStorage.getItem(authStorageKey) || null);
  const loading = ref(false);
  const ready = ref(false);
  const error = ref("");

  const isAuthenticated = computed(() => Boolean(accessToken.value));

  const syncToken = (token) => {
    accessToken.value = token;

    if (token) {
      localStorage.setItem(authStorageKey, token);
    } else {
      localStorage.removeItem(authStorageKey);
    }
  };

  const clearSession = () => {
    user.value = null;
    syncToken(null);
  };

  const fetchUser = async () => {
    if (!accessToken.value) {
      user.value = null;
      ready.value = true;
      return null;
    }

    try {
      const response = await apiClient.post("/auth/user");
      user.value = response.data;
      return user.value;
    } catch (err) {
      clearSession();
      throw err;
    } finally {
      ready.value = true;
    }
  };

  const bootstrap = async () => {
    if (ready.value) {
      return;
    }

    if (accessToken.value) {
      try {
        await fetchUser();
      } catch {
        ready.value = true;
      }
    } else {
      ready.value = true;
    }
  };

  const login = async (credentials) => {
    loading.value = true;
    error.value = "";

    try {
      const response = await apiClient.post("/auth/login", credentials);
      syncToken(response.data.access_token);
      await fetchUser();
      return response.data;
    } catch (err) {
      clearSession();
      error.value = extractErrorMessage(err, "No fue posible iniciar sesion.");
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    try {
      if (accessToken.value) {
        await apiClient.post("/auth/logout");
      }
    } catch {
      // Best effort logout.
    } finally {
      clearSession();
      ready.value = true;
    }
  };

  window.addEventListener("auth:unauthorized", clearSession);

  return {
    user,
    accessToken,
    loading,
    ready,
    error,
    isAuthenticated,
    bootstrap,
    login,
    logout,
    fetchUser,
    clearSession,
  };
});
