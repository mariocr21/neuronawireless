<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <svg class="w-8 h-8 text-brand-green glow-border rounded-full" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
          Análisis Gráfico
        </h1>
        <p class="text-gray-400 mt-1">Comparativa de variables climatológicas y de suelo</p>
      </div>

      <!-- Date Filters -->
      <div class="flex items-center gap-3 bg-black/40 p-2 rounded-xl border border-white/5">
        <div class="flex items-center gap-2 px-3">
          <svg class="w-4 h-4 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          <input type="date" v-model="filters.from" class="bg-transparent border-none text-sm text-gray-300 focus:ring-0 cursor-pointer outline-none">
        </div>
        <span class="text-gray-600">→</span>
        <div class="flex items-center gap-2 px-3">
          <input type="date" v-model="filters.to" class="bg-transparent border-none text-sm text-gray-300 focus:ring-0 cursor-pointer outline-none">
        </div>
        <button @click="generateGraphics" :disabled="loadingCharts" class="bg-brand-green hover:bg-brand-green-light text-brand-black p-2 rounded-lg transition-colors ml-2" title="Generar Gráficas">
          <svg v-if="!loadingCharts" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          <svg v-else class="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        </button>
      </div>
    </div>

    <!-- Layout Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      <!-- Selectors Area (Left Column) -->
      <div class="lg:col-span-1 space-y-4">
        <div class="glass-panel p-5">
          <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            Estaciones y Sensores
          </h3>
          
          <div class="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            <!-- Simulated Tree Checkboxes -->
            <div v-for="station in availableStations" :key="station.id" class="border border-white/5 rounded-lg bg-black/20 overflow-hidden">
              <div class="px-3 py-2 bg-white/5 flex items-center justify-between cursor-pointer" @click="station.expanded = !station.expanded">
                <span class="font-medium text-sm text-gray-200">{{ station.name }}</span>
                <svg class="w-4 h-4 text-gray-400 transition-transform" :class="{'rotate-180': station.expanded}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
              <div v-show="station.expanded" class="p-3 space-y-2">
                <label v-for="sensor in station.sensors" :key="sensor.id" class="flex items-center gap-2 cursor-pointer group">
                  <div class="relative flex items-center justify-center">
                    <input type="checkbox" v-model="selectedSensors" :value="sensor.id" class="peer appearance-none w-4 h-4 border border-gray-600 rounded bg-transparent checked:bg-brand-green checked:border-brand-green transition-all">
                    <svg class="absolute w-3 h-3 text-brand-black opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span class="text-sm text-gray-400 group-hover:text-white transition-colors">{{ sensor.name }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Area (Right Column) -->
      <div class="lg:col-span-3 space-y-6">
        
        <!-- Main Chart -->
        <div class="glass-panel p-6 relative overflow-hidden">
          <div class="absolute top-0 right-0 w-64 h-64 bg-brand-info/10 rounded-full blur-3xl"></div>
          <h3 class="text-xl font-bold text-white mb-6 relative z-10">Evolución de Temperatura y Humedad</h3>
          <div class="h-80 relative z-10">
            <apexchart type="area" height="100%" :options="chartOptions" :series="chartSeries"></apexchart>
          </div>
        </div>

        <!-- KPI Cards based on selected data -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="glass-panel p-5 border-t-2 border-brand-negative">
            <div class="text-sm text-gray-400 uppercase tracking-widest mb-1">Temperatura Máx</div>
            <div class="text-3xl font-bold font-mono text-white">{{ kpis.maxTemp }}</div>
          </div>
          <div class="glass-panel p-5 border-t-2 border-brand-info">
            <div class="text-sm text-gray-400 uppercase tracking-widest mb-1">Temperatura Mín</div>
            <div class="text-3xl font-bold font-mono text-white">{{ kpis.minTemp }}</div>
          </div>
          <div class="glass-panel p-5 border-t-2 border-brand-green">
            <div class="text-sm text-gray-400 uppercase tracking-widest mb-1">Promedio General</div>
            <div class="text-3xl font-bold font-mono text-white">{{ kpis.avgTemp }}</div>
            <div class="text-xs text-gray-500 mt-2">En el periodo seleccionado</div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import api from '../services/api';

const apexchart = VueApexCharts;

const today = new Date();
const lastWeek = new Date(today);
lastWeek.setDate(lastWeek.getDate() - 7);

const filters = ref({
  from: lastWeek.toISOString().split('T')[0],
  to: today.toISOString().split('T')[0]
});

const selectedSensors = ref([]);
const availableStations = ref([]);
const chartSeries = ref([]);
const kpis = ref({
  maxTemp: '--',
  minTemp: '--',
  avgTemp: '--'
});
const loadingCharts = ref(false);

const chartOptions = ref({
  chart: {
    type: 'area',
    toolbar: { show: false },
    background: 'transparent',
    foreColor: '#9ca3af',
    animations: { enabled: true, easing: 'easeinout', speed: 800 }
  },
  colors: ['#0ba703', '#31CCEC', '#F2C037', '#C10015'],
  fill: {
    type: 'gradient',
    gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 100] }
  },
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 2 },
  xaxis: {
    type: 'category', // we will pass dates as categories
    categories: [],
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    labels: { formatter: (value) => { return value !== undefined ? value.toFixed(1) : '' } }
  },
  tooltip: {
    theme: 'dark'
  },
  grid: {
    borderColor: '#ffffff10',
    strokeDashArray: 4,
  },
  legend: { position: 'top', horizontalAlign: 'right' }
});

const loadInitialStations = async () => {
  try {
    const response = await api.get('/app/stations');
    availableStations.value = response.data.stations.map((st, idx) => ({
      id: st.id,
      name: st.name,
      expanded: idx === 0,
      sensors: st.sensors.map(s => ({
        id: s.id,
        name: s.name
      }))
    }));
  } catch (error) {
    console.error('Error fetching stations:', error);
  }
};

const generateGraphics = async () => {
  if(selectedSensors.value.length === 0) {
    alert('Selecciona al menos un sensor.');
    return;
  }
  
  loadingCharts.value = true;
  chartSeries.value = [];
  
  const payload = {
    sensors: selectedSensors.value,
    since: filters.value.from + " 00:00:00",
    until: filters.value.to + " 23:59:59"
  };

  try {
    const response = await api.post('/app/sensors/graphics', payload);
    const data = response.data.sensors;
    
    if (data && data.length > 0) {
      let tempMax = -999;
      let tempMin = 999;
      let totalAvg = 0;
      let tempSensorCount = 0;
      
      const newSeries = data.map(sensor => {
        // Calculate KPIs if it's a temp sensor roughly
        if(sensor.name.toLowerCase().includes('temp')) {
           tempMax = Math.max(tempMax, sensor.max);
           tempMin = Math.min(tempMin, sensor.min);
           totalAvg += sensor.avg;
           tempSensorCount++;
        }
        return {
          name: `${sensor.name} (${sensor.station_name})`,
          data: sensor.data || []
        };
      });
      
      chartSeries.value = newSeries;
      
      // Update KPIs
      kpis.value.maxTemp = tempMax !== -999 ? tempMax.toFixed(1) + '°C' : '--';
      kpis.value.minTemp = tempMin !== 999 ? tempMin.toFixed(1) + '°C' : '--';
      kpis.value.avgTemp = tempSensorCount > 0 ? (totalAvg / tempSensorCount).toFixed(1) + '°C' : '--';
      
      // For x-axis, assuming data[] arrays map sequentially, we can generate generic dates or leave blank. 
      // In production, the backend should return actual datetime points.
      const maxLength = Math.max(...chartSeries.value.map(s => s.data.length));
      chartOptions.value = {
         ...chartOptions.value,
         xaxis: {
             categories: Array.from({length: maxLength}, (_, i) => `Plot ${i+1}`)
         }
      };
      
    } else {
       alert('No hay datos en este rango.');
    }
  } catch (error) {
    console.error("Error loading graphics:", error);
  } finally {
    loadingCharts.value = false;
  }
};

onMounted(() => {
  loadInitialStations();
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
