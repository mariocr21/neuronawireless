<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";

import AppShell from "@/components/AppShell.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import SectionCard from "@/components/ui/SectionCard.vue";
import { useAlertsStore } from "@/stores/alerts";
import { useNotificationsStore } from "@/stores/notifications";
import { useRealtimeStore } from "@/stores/realtime";

const alertsStore = useAlertsStore();
const notificationsStore = useNotificationsStore();
const realtimeStore = useRealtimeStore();

const form = ref({
  id: null,
  title: "",
  is_active: true,
});

const criticalCount = computed(() => notificationsStore.items.filter((item) => item.level === "critical").length);

const editRule = (rule) => {
  form.value = {
    id: rule.id,
    title: rule.title,
    is_active: rule.isActive,
  };
};

const submit = async () => {
  if (form.value.id) {
    await alertsStore.updateRule({ id: form.value.id, title: form.value.title });
  } else {
    await alertsStore.createRule({
      title: form.value.title,
      is_active: form.value.is_active,
    });
  }

  form.value = {
    id: null,
    title: "",
    is_active: true,
  };
};

const refresh = async () => {
  await Promise.all([alertsStore.fetchRules(), notificationsStore.fetchNotifications()]);
};

onMounted(async () => {
  await refresh();
  realtimeStore.startPolling("alerts", refresh, 45000);
});

onUnmounted(() => {
  realtimeStore.stopPolling("alerts");
});
</script>

<template>
  <AppShell>
    <div class="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <SectionCard>
        <div class="text-xs uppercase tracking-[0.35em] text-brand-green">Reglas</div>
        <h2 class="mt-2 text-2xl font-semibold">Centro de alertas y configuracion</h2>

        <div class="mt-5 grid gap-4 sm:grid-cols-3">
          <div class="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div class="text-xs uppercase tracking-[0.2em] text-brand-mist">Reglas</div>
            <div class="mt-2 text-2xl font-semibold">{{ alertsStore.rules.length }}</div>
          </div>
          <div class="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div class="text-xs uppercase tracking-[0.2em] text-brand-mist">Activas</div>
            <div class="mt-2 text-2xl font-semibold text-brand-green">{{ alertsStore.rules.filter((item) => item.isActive).length }}</div>
          </div>
          <div class="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div class="text-xs uppercase tracking-[0.2em] text-brand-mist">Criticas</div>
            <div class="mt-2 text-2xl font-semibold text-brand-danger">{{ criticalCount }}</div>
          </div>
        </div>

        <div class="mt-6 grid gap-4">
          <input v-model="form.title" class="field-shell" placeholder="Titulo de la alerta" />
          <label class="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-brand-mist">
            <input v-model="form.is_active" type="checkbox" />
            Crear regla activa
          </label>
          <button class="rounded-full bg-brand-green px-5 py-3 text-sm font-semibold text-brand-ink" type="button" @click="submit">
            {{ form.id ? "Actualizar alerta" : "Crear alerta" }}
          </button>
        </div>

        <div class="mt-6 space-y-3">
          <article v-for="rule in alertsStore.rules" :key="rule.id" class="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div class="text-lg font-semibold">{{ rule.title }}</div>
                <div class="text-sm text-brand-mist">{{ rule.conditionSummary }}</div>
              </div>
              <div class="flex flex-wrap gap-2">
                <button class="rounded-full border border-white/10 px-3 py-2 text-sm text-brand-mist" type="button" @click="editRule(rule)">
                  Editar
                </button>
                <button class="rounded-full border border-white/10 px-3 py-2 text-sm text-brand-mist" type="button" @click="alertsStore.toggleRule({ id: rule.id, isActive: !rule.isActive })">
                  {{ rule.isActive ? "Desactivar" : "Activar" }}
                </button>
                <button class="rounded-full border border-brand-danger/30 px-3 py-2 text-sm text-brand-danger" type="button" @click="alertsStore.deleteRule(rule.id)">
                  Eliminar
                </button>
              </div>
            </div>
          </article>
        </div>
      </SectionCard>

      <SectionCard>
        <div class="mb-5 flex items-center justify-between">
          <div>
            <div class="text-xs uppercase tracking-[0.35em] text-brand-green">Incidentes</div>
            <h3 class="mt-2 text-2xl font-semibold">Registro de notificaciones</h3>
          </div>
          <button
            v-if="notificationsStore.nextPage"
            class="rounded-full border border-white/10 px-4 py-2 text-sm text-brand-mist hover:text-white"
            type="button"
            @click="notificationsStore.fetchNotifications({ append: true })"
          >
            Cargar mas
          </button>
        </div>

        <div v-if="notificationsStore.loading" class="py-20 text-center text-brand-mist">Cargando eventos...</div>
        <EmptyState
          v-else-if="notificationsStore.error"
          title="No se pudieron cargar las notificaciones"
          :description="notificationsStore.error"
        />
        <EmptyState
          v-else-if="!notificationsStore.items.length"
          title="No hay incidentes recientes"
          description="Cuando ocurra una activacion o evento, aparecera en este historial."
        />
        <div v-else class="space-y-3">
          <article
            v-for="notification in notificationsStore.items"
            :key="notification.id"
            class="rounded-2xl border border-white/10 bg-black/20 p-4"
            :class="notification.read ? '' : 'ring-1 ring-brand-gold/30'"
          >
            <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div class="flex items-center gap-3">
                  <span class="h-2.5 w-2.5 rounded-full" :class="notification.level === 'critical' ? 'bg-brand-danger' : 'bg-brand-gold'"></span>
                  <div class="text-lg font-semibold">{{ notification.title }}</div>
                </div>
                <div class="mt-2 text-sm text-brand-mist">{{ notification.message }}</div>
                <div class="mt-2 text-xs uppercase tracking-[0.2em] text-brand-mist">{{ notification.stationName }}</div>
              </div>
              <div class="flex flex-col items-start gap-3 text-sm text-brand-mist sm:items-end">
                <div>{{ notification.createdLabel || notification.createdHuman }}</div>
                <button v-if="!notification.read" class="rounded-full border border-white/10 px-3 py-2" type="button" @click="notificationsStore.markAsRead(notification.id)">
                  Marcar leida
                </button>
              </div>
            </div>
          </article>
        </div>
      </SectionCard>
    </div>
  </AppShell>
</template>
