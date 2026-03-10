<template>
  <div class="relative flex min-h-screen items-center justify-center overflow-hidden bg-app-shell px-4 py-10 text-white">
    <div class="pointer-events-none absolute inset-0 bg-grid-pattern opacity-70"></div>
    <div class="pointer-events-none absolute left-0 top-0 h-[32rem] w-[32rem] rounded-full bg-brand-green/15 blur-3xl"></div>
    <div class="pointer-events-none absolute bottom-0 right-0 h-[24rem] w-[24rem] rounded-full bg-brand-sky/12 blur-3xl"></div>

    <div class="relative grid w-full max-w-6xl gap-8 xl:grid-cols-[1.1fr_0.9fr]">
      <div class="hidden rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-card backdrop-blur-xl xl:block">
        <div class="text-xs uppercase tracking-[0.35em] text-brand-green">Neurona Wireless</div>
        <h1 class="mt-4 text-5xl font-semibold leading-tight">Monitoreo agricola con presencia global y lectura local.</h1>
        <p class="mt-5 max-w-xl text-base text-brand-mist">
          El nuevo front concentra operacion, analitica, alertas y dashboard configurable en una experiencia premium lista para escalar.
        </p>

        <div class="mt-10 grid gap-4 sm:grid-cols-3">
          <div class="rounded-3xl border border-white/10 bg-black/20 p-5">
            <div class="text-xs uppercase tracking-[0.2em] text-brand-mist">Tiempo real</div>
            <div class="mt-2 text-2xl font-semibold text-brand-green">Widgets vivos</div>
          </div>
          <div class="rounded-3xl border border-white/10 bg-black/20 p-5">
            <div class="text-xs uppercase tracking-[0.2em] text-brand-mist">Operacion</div>
            <div class="mt-2 text-2xl font-semibold text-brand-sky">Estaciones</div>
          </div>
          <div class="rounded-3xl border border-white/10 bg-black/20 p-5">
            <div class="text-xs uppercase tracking-[0.2em] text-brand-mist">Decision</div>
            <div class="mt-2 text-2xl font-semibold text-brand-gold">Analitica</div>
          </div>
        </div>
      </div>

      <div class="rounded-[2rem] border border-white/10 bg-black/35 p-8 shadow-card backdrop-blur-xl sm:p-10">
        <div class="mb-10">
          <div class="text-xs uppercase tracking-[0.35em] text-brand-green">Acceso seguro</div>
          <h2 class="mt-3 text-3xl font-semibold">Ingresar a la consola</h2>
          <p class="mt-2 text-brand-mist">Usa tu acceso productivo para entrar al nuevo centro de monitoreo.</p>
        </div>

        <form class="space-y-5" @submit.prevent="handleLogin">
          <input v-model="form.email" class="field-shell" type="email" required placeholder="Correo" />
          <div class="relative">
            <input
              v-model="form.password"
              class="field-shell pr-14"
              :type="showPassword ? 'text' : 'password'"
              required
              placeholder="Contrasena"
            />
            <button class="absolute inset-y-0 right-4 text-sm text-brand-mist" type="button" @click="showPassword = !showPassword">
              {{ showPassword ? "Ocultar" : "Ver" }}
            </button>
          </div>
          <label class="flex items-center gap-3 text-sm text-brand-mist">
            <input v-model="form.remember_me" type="checkbox" />
            Mantener sesion
          </label>

          <div v-if="errorMsg" class="rounded-2xl border border-brand-danger/30 bg-brand-danger/10 p-3 text-sm text-brand-danger">
            {{ errorMsg }}
          </div>

          <button
            class="w-full rounded-full bg-brand-green px-5 py-3 text-sm font-semibold text-brand-ink transition hover:bg-brand-spring disabled:opacity-60"
            type="submit"
            :disabled="authStore.loading"
          >
            {{ authStore.loading ? "Ingresando..." : "Entrar al sistema" }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
  email: "",
  password: "",
  remember_me: false,
});

const showPassword = ref(false);
const errorMsg = ref("");

const handleLogin = async () => {
  errorMsg.value = "";

  try {
    await authStore.login(form.value);
    router.push({ name: "dashboard" });
  } catch {
    errorMsg.value = authStore.error || "Ocurrio un error inesperado al iniciar sesion.";
  }
};
</script>
