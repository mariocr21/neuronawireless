<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: String, required: true },
  hint: { type: String, default: "" },
  tone: { type: String, default: "green" },
});
</script>

<template>
  <div class="rounded-3xl border border-white/10 bg-black/20 p-5 shadow-card">
    <div class="text-xs uppercase tracking-[0.3em] text-brand-mist">{{ label }}</div>
    <div class="mt-3 text-3xl font-semibold" :class="tone === 'green' ? 'text-brand-green' : tone === 'blue' ? 'text-brand-sky' : tone === 'gold' ? 'text-brand-gold' : 'text-white'">
      {{ value }}
    </div>
    <div v-if="hint" class="mt-2 text-sm text-brand-mist">{{ hint }}</div>
  </div>
</template>
