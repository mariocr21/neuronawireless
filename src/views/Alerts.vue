<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <svg class="w-8 h-8 text-brand-warning glow-border rounded-full" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          Centro de Alertas
        </h1>
        <p class="text-gray-400 mt-1">Configuración de umbrales y registro de notificaciones</p>
      </div>

      <div class="flex items-center gap-3">
        <button class="bg-brand-green/10 text-brand-green border border-brand-green/30 px-4 py-2 rounded-lg hover:bg-brand-green hover:text-brand-black hover:glow-border transition flex items-center gap-2 font-semibold">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
          Nueva Regla
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      <!-- Active Alerts (Rules) -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Reglas Activas
          </h2>
          <span class="text-sm font-mono text-gray-400">{{ alerts.length }} configuradas</span>
        </div>

        <div class="space-y-3">
          <div v-for="alert in alerts" :key="alert.id" class="glass-panel p-4 flex items-center justify-between group transition-all hover:border-brand-green/30">
            <div class="flex items-center gap-4">
              <div class="relative">
                <input type="checkbox" v-model="alert.is_active" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-green"></div>
              </div>
              <div>
                <h4 class="text-white font-medium" :class="{'text-gray-500 line-through': !alert.is_active}">{{ alert.title }}</h4>
                <p class="text-xs text-brand-info mt-1 font-mono uppercase tracking-widest">{{ alert.condition }}</p>
              </div>
            </div>
            <button class="text-gray-500 hover:text-brand-negative opacity-0 group-hover:opacity-100 transition-all p-2 bg-black/40 rounded-lg">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Notifications Log -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Registro de Eventos
          </h2>
          <button class="text-xs text-brand-green hover:underline">Marcar leídas</button>
        </div>

        <div class="glass-panel overflow-hidden border border-white/10">
          <div class="max-h-[600px] overflow-y-auto custom-scrollbar p-1">
            <div v-for="notif in notifications" :key="notif.id" 
                 class="p-4 border-b border-white/5 last:border-0 hover:bg-white/5 cursor-pointer transition flex gap-4"
                 :class="{'bg-brand-warning/5 border-l-2 border-l-brand-warning': !notif.read}"
            >
              <div class="mt-1">
                <div v-if="notif.level === 'critical'" class="w-8 h-8 rounded-full bg-brand-negative/20 text-brand-negative flex items-center justify-center">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <div v-else class="w-8 h-8 rounded-full bg-brand-warning/20 text-brand-warning flex items-center justify-center">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
              </div>
              <div class="flex-1">
                <div class="flex justify-between items-start mb-1">
                  <h4 class="text-white font-medium text-sm">{{ notif.title }}</h4>
                  <span class="text-xs text-gray-500 font-mono">{{ notif.time }}</span>
                </div>
                <p class="text-gray-400 text-sm leading-relaxed">{{ notif.message }}</p>
                <div class="mt-2 text-xs text-gray-500 uppercase font-mono tracking-widest">
                  Estación: {{ notif.station }}
                </div>
              </div>
            </div>
            
            <button class="w-full p-4 text-center text-sm font-semibold text-brand-green hover:bg-brand-green/10 transition uppercase tracking-widest">
              Cargar Historial Completo
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const alerts = ref([]);
const notifications = ref([]);
const loading = ref(false);

const mapNotificationLevel = (apiType) => {
   // Assuming old api returns some type or code. We default to 'warning'
   if(String(apiType).toLowerCase().includes('critic') || String(apiType) === '1') return 'critical';
   return 'warning';
};

const mapReadStatus = (status) => {
   return status === 1 || status === true || status === 'read';
};

const formatTime = (dateString) => {
  if(!dateString) return 'Desconocido';
  const d = new Date(dateString);
  return d.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
}

const fetchData = async () => {
  loading.value = true;
  try {
    // 1. Fetch Alert Rules
    const alertsRes = await api.get('/app/alerts');
    alerts.value = (alertsRes.data.alerts || []).map(a => ({
       id: a.id,
       title: a.title || 'Alerta sin nombre',
       condition: a.condition || 'Condición genérica',
       is_active: a.is_active === 1 || a.is_active === true
    }));

    // 2. Fetch Notifications Log
    const notifRes = await api.get('/app/notifications?page=1');
    notifications.value = (notifRes.data.notifications || []).map(n => ({
      id: n.id,
      title: n.title || 'Alerta de Sistema',
      message: n.message || n.body || 'Sin detalles.',
      time: formatTime(n.created_at || n.date),
      station: n.station_name || 'General',
      level: mapNotificationLevel(n.type || n.level),
      read: mapReadStatus(n.status || n.is_read)
    }));

  } catch(error) {
    console.error('Error fetching alerts data:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0,0,0,0.2);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(11, 167, 3, 0.5);
  border-radius: 4px;
}
</style>
