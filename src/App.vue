<template>
  <div class="min-h-screen bg-brand-dark flex flex-col font-sans text-white">
    <!-- Top Navigation Header -->
    <header v-if="$route.path !== '/login'" class="h-16 border-b border-white/10 bg-brand-dark/80 backdrop-blur top-0 z-50 sticky px-6 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center glow-border">
          <!-- Logo placeholder -->
          <svg class="w-5 h-5 text-brand-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        </div>
        <span class="text-xl font-bold tracking-wider text-brand-green-light text-glow">NEURONA <span class="font-light text-white ml-1 text-sm tracking-normal">WIRELESS</span></span>
      </div>
      <nav class="hidden md:flex space-x-8">
        <router-link to="/" class="hover:text-brand-green-light transition-colors duration-200 text-sm tracking-wide font-medium">Dashboard</router-link>
        <router-link to="/stations" class="text-gray-400 hover:text-brand-green-light transition-colors duration-200 text-sm tracking-wide font-medium">Estaciones</router-link>
        <router-link to="/graphics" class="text-gray-400 hover:text-brand-green-light transition-colors duration-200 text-sm tracking-wide font-medium">Gráficos</router-link>
        <router-link to="/alerts" class="text-gray-400 hover:text-brand-green-light transition-colors duration-200 text-sm tracking-wide font-medium">Alertas</router-link>
      </nav>
      <div class="flex items-center space-x-4">
        <button @click="handleLogout" class="text-gray-400 hover:text-brand-negative transition" title="Cerrar Sesión">
           <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
        </button>
        <div class="w-8 h-8 rounded-full border border-brand-green flex items-center justify-center overflow-hidden">
           <img src="https://ui-avatars.com/api/?name=Admin&background=000&color=0ba703" alt="Admin" class="w-full h-full object-cover"/>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-1 w-full max-w-7xl mx-auto p-6 md:p-8">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from './stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = async () => {
  if(confirm('¿Deseas cerrar sesión?')) {
    await authStore.logout();
    router.push('/login');
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
