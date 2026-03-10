import { ref } from "vue";
import { defineStore } from "pinia";

import { apiClient, extractErrorMessage } from "@/services/http";
import { normalizeNotification } from "@/domain/normalizers";

export const useNotificationsStore = defineStore("notifications", () => {
  const items = ref([]);
  const unread = ref(0);
  const nextPage = ref(1);
  const loading = ref(false);
  const error = ref("");

  const reset = () => {
    items.value = [];
    unread.value = 0;
    nextPage.value = 1;
  };

  const fetchNotifications = async ({ append = false } = {}) => {
    loading.value = true;
    error.value = "";

    try {
      const page = append ? nextPage.value : 1;
      const response = await apiClient.get(`/app/notifications?page=${page}`);
      const normalized = (response.data.notifications || []).map(normalizeNotification);

      items.value = append ? [...items.value, ...normalized] : normalized;
      unread.value = Number(response.data.unread || 0);
      nextPage.value = response.data.next_page || null;
      return items.value;
    } catch (err) {
      error.value = extractErrorMessage(err, "No fue posible cargar las notificaciones.");
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const markAsRead = async (notificationId) => {
    const response = await apiClient.post("/app/notifications/mark", { notification_id: notificationId });
    const normalized = normalizeNotification(response.data.notification);
    items.value = items.value.map((item) => (item.id === notificationId ? normalized : item));
    unread.value = Number(response.data.unread || unread.value);
  };

  return {
    items,
    unread,
    nextPage,
    loading,
    error,
    reset,
    fetchNotifications,
    markAsRead,
  };
});
