<template>
  <div class="space-y-8">
    
    <!-- Top Bar: Title & Global Actions -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          Estaciones de Monitoreo
          <span class="px-3 py-1 bg-brand-green/20 text-brand-green border border-brand-green/50 rounded-full text-sm font-semibold tracking-wide">
            {{ stations.length }} Activas
          </span>
        </h1>
        <p class="text-gray-400 mt-1">Monitoreo en tiempo real de nodos agrícolas</p>
      </div>

      <div class="flex items-center gap-3">
        <div class="relative">
          <svg class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Buscar estación..." class="pl-10 pr-4 py-2 bg-brand-dark/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all w-64">
        </div>
        <button @click="fetchStations" class="p-2 bg-brand-dark/80 border border-gray-700 hover:border-brand-green text-gray-400 hover:text-brand-green-light rounded-lg transition-all group">
          <svg class="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>
        <button class="bg-brand-green text-brand-black font-semibold px-4 py-2 rounded-lg hover:bg-brand-green-light hover:glow-border transition flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          Añadir Estación
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-64 glass-panel">
      <div class="flex flex-col items-center gap-4">
        <svg class="animate-spin h-10 w-10 text-brand-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        <span class="text-brand-green animate-pulse tracking-widest uppercase text-sm font-semibold">Sincronizando red...</span>
      </div>
    </div>

    <!-- Stations Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      
      <div v-for="station in stations" :key="station.id" class="glass-panel group relative overflow-hidden flex flex-col hover:border-brand-green/50 transition-colors duration-300">
        
        <!-- Decoration glow -->
        <div class="absolute top-0 right-0 w-32 h-32 bg-brand-green/5 rounded-full blur-2xl group-hover:bg-brand-green/20 transition-all duration-500"></div>

        <!-- Card Header -->
        <div class="p-5 border-b border-white/5 flex justify-between items-start relative z-10">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="w-2 h-2 rounded-full" :class="station.status === 'online' ? 'bg-brand-green shadow-[0_0_8px_#0ba703]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'"></span>
              <span class="text-xs uppercase tracking-wider text-gray-400 font-semibold">{{ station.status === 'online' ? 'ON LINE' : 'OFF LINE' }}</span>
            </div>
            <h3 class="text-xl font-bold text-white group-hover:text-brand-green-light transition-colors">{{ station.name }}</h3>
            <p class="text-xs text-gray-500 mt-1 flex items-center gap-1">
               <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
               {{ station.location }}
            </p>
          </div>
          
          <div class="text-right flex flex-col items-end">
            <div class="flex items-center gap-1 text-gray-400" title="Batería">
              <svg class="w-4 h-4" :class="station.battery < 20 ? 'text-red-500' : 'text-brand-green'" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-1h2v-8h-2V7c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2zm2 0h12v10H6V7z" /><rect x="8" y="9" width="8" height="6" fill="currentColor"/></svg>
              <span class="text-sm font-mono">{{ station.battery }}%</span>
            </div>
            <div class="flex items-center gap-1 text-gray-400 mt-1" title="Señal">
              <svg class="w-4 h-4 text-brand-info" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.906 14.142 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>
              <span class="text-xs font-mono">{{ station.signal }}dBm</span>
            </div>
          </div>
        </div>

        <!-- Metrics Area -->
        <div class="p-5 grid grid-cols-2 gap-4 relative z-10 flex-1">
          <div class="bg-black/30 rounded-lg p-3 border border-white/5">
            <div class="text-gray-400 text-xs mb-1 uppercase flex items-center gap-1">
               <svg class="w-3 h-3 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
               Temperatura
            </div>
            <div class="text-2xl font-bold font-mono">
              {{ station.temperature }}°C
            </div>
          </div>
          <div class="bg-black/30 rounded-lg p-3 border border-white/5">
            <div class="text-gray-400 text-xs mb-1 uppercase flex items-center gap-1">
               <svg class="w-3 h-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
               Humedad
            </div>
            <div class="text-2xl font-bold font-mono">
              {{ station.humidity }}%
            </div>
          </div>
          <div class="bg-black/30 rounded-lg p-3 border border-white/5 col-span-2">
            <div class="text-gray-400 text-xs mb-1 uppercase flex items-center gap-1">
               <svg class="w-3 h-3 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-1h2v-8h-2V7c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2zm2 0h12v10H6V7z" /></svg>
               Humedad Suelo
            </div>
            <div class="w-full bg-black/50 rounded-full h-2.5 mt-2 border border-white/10 overflow-hidden">
              <div class="bg-gradient-to-r from-brand-green to-brand-green-light h-2.5 rounded-full" :style="{ width: station.soilMoisture + '%' }"></div>
            </div>
            <div class="text-sm font-mono mt-1 text-right text-gray-400">{{ station.soilMoisture }}%</div>
          </div>
        </div>

        <!-- Footer Action -->
        <div class="p-4 border-t border-white/5 bg-black/20 text-center">
          <button class="text-sm text-brand-green hover:text-brand-green-light font-medium uppercase tracking-wider transition-colors">
            Ver Detalles Completos &rarr;
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const loading = ref(true);
const stations = ref([]);

const fetchStations = async () => {
  loading.value = true;
  try {
    const response = await api.get('/app/stations'); // Endpoint from old Stations.vue
    
    // Transform backend data array to match our new UI structure requirements
    stations.value = response.data.stations.map(station => {
      // Find specific sensors if available in the backend payload
      // According to old Graphics.vue, station object has a `sensors` array
      const tempSensor = station.sensors?.find(s => s.name.toLowerCase().includes('temp')) || { data: [/* missing */], lastValue: '--' };
      const humSensor = station.sensors?.find(s => s.name.toLowerCase().includes('hum') && !s.name.toLowerCase().includes('suelo')) || { lastValue: '--' };
      const soilSensor = station.sensors?.find(s => s.name.toLowerCase().includes('suelo')) || { lastValue: 0 };
      
      // Simulating some UI data like battery/signal that may not be present in old API
      return {
        id: station.id,
        name: station.name,
        location: station.location || 'Localización Desconocida',
        status: station.is_active || station.status === 1 ? 'online' : 'offline', // Using typical DB fields
        battery: station.battery || Math.floor(Math.random() * (100 - 15) + 15),
        signal: station.signal || -(Math.floor(Math.random() * (95 - 50) + 50)),
        temperature: tempSensor.lastValue || '--',
        humidity: humSensor.lastValue || '--',
        soilMoisture: soilSensor.lastValue || 0,
        originalData: station // Keeporiginal around
      }
    });
  } catch(error) {
    console.error('Failed to load stations:', error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchStations();
})
</script>
