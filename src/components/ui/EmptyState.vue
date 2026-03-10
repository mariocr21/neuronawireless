<script setup>
defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
});
</script>

<template>
  <div class="rounded-3xl border border-dashed border-white/15 bg-white/5 px-6 py-12 text-center">
    <div class="text-lg font-semibold">{{ title }}</div>
    <div class="mt-2 text-sm text-brand-mist">{{ description }}</div>
    <div v-if="$slots.actions" class="mt-5">
      <slot name="actions" />
    </div>
  </div>
</template>
