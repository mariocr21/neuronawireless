<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
      <button class="bg-brand-green hover:bg-brand-green-light hover:glow-border transition px-4 py-2 rounded-lg font-medium text-brand-black">
        Añadir Estación
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="glass-panel p-6 flex flex-col">
        <span class="text-gray-400 text-sm uppercase tracking-wider font-semibold mb-1">Estaciones Activas</span>
        <span class="text-4xl font-bold text-brand-green-light text-glow">12</span>
      </div>
      <div class="glass-panel p-6 flex flex-col">
        <span class="text-gray-400 text-sm uppercase tracking-wider font-semibold mb-1">Alertas Generadas</span>
        <span class="text-4xl font-bold text-brand-warning">3</span>
      </div>
      <div class="glass-panel p-6 flex flex-col">
        <span class="text-gray-400 text-sm uppercase tracking-wider font-semibold mb-1">Estado General</span>
        <span class="text-4xl font-bold text-brand-info">Óptimo</span>
      </div>
    </div>
    
    <div class="glass-panel p-6 h-96 flex items-center justify-center">
      <span class="text-gray-500">[Mapa o Gráfico Principal de Resumen]</span>
    </div>
  </div>
</template>

<script setup>
</script>
