<template>
  <div class="fixed inset-0 min-h-screen bg-brand-black flex items-center justify-center relative overflow-hidden">
    <!-- Background Animated Grid/Glow -->
    <div class="absolute inset-0 z-0">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-green/20 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-green-light/10 rounded-full blur-[100px]"></div>
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDM5aDQwdjFIMHpNNDAgMHY0MGgxVjB6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+PC9zdmc+')] opacity-50"></div>
    </div>

    <!-- Login Container -->
    <div class="relative z-10 w-full max-w-md p-8 sm:p-10 glass-panel border border-brand-green/30 glow-border">
      
      <!-- Brand Logo -->
      <div class="text-center mb-10">
        <div class="mx-auto w-16 h-16 rounded-full bg-brand-green flex items-center justify-center glow-border mb-4">
          <svg class="w-8 h-8 text-brand-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        </div>
        <h1 class="text-3xl font-bold tracking-widest text-brand-green-light text-glow">NEURONA</h1>
        <p class="text-gray-400 uppercase tracking-[0.3em] text-xs mt-2">Wireless System</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-300">Usuario / Email</label>
          <div class="relative">
             <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/></svg>
             </div>
             <input v-model="form.email" type="email" required class="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg bg-brand-dark/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all" placeholder="admin@neurona.com">
          </div>
        </div>

        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-300">Contraseña</label>
          <div class="relative">
             <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/></svg>
             </div>
             <input v-model="form.password" :type="showPassword ? 'text' : 'password'" required class="block w-full pl-10 pr-10 py-3 border border-gray-700 rounded-lg bg-brand-dark/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all" placeholder="••••••••">
             <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <svg v-if="!showPassword" class="h-5 w-5 text-gray-400 hover:text-white transition" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                <svg v-else class="h-5 w-5 text-gray-400 hover:text-white transition" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
             </button>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input id="remember-me" v-model="form.remember_me" type="checkbox" class="h-4 w-4 text-brand-green focus:ring-brand-green border-gray-600 rounded bg-brand-dark">
            <label for="remember-me" class="ml-2 block text-sm text-gray-300">
              Mantener sesión
            </label>
          </div>
        </div>

        <div v-if="errorMsg" class="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm text-center">
          {{ errorMsg }}
        </div>

        <div>
          <button type="submit" :disabled="authStore.loading" class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold tracking-wider uppercase text-brand-black bg-brand-green hover:bg-brand-green-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green focus:ring-offset-brand-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed glow-border hover:shadow-[0_0_20px_rgba(11,167,3,0.5)]">
            <svg v-if="authStore.loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-brand-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            {{ authStore.loading ? 'Ingresando...' : 'Ingresar al Sistema' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
  email: '',
  password: '',
  remember_me: false
});

const showPassword = ref(false);
const errorMsg = ref('');

const handleLogin = async () => {
  errorMsg.value = '';
  
  try {
    // Calling the API through Pinia
    await authStore.login(form.value);
    router.push('/stations');
  } catch (error) {
    errorMsg.value = authStore.error || 'Ocurrió un error inesperado al iniciar sesión o conexión rechazada.';
  }
};
</script>
