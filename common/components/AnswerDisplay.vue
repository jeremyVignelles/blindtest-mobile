<script setup lang="ts">
defineProps<{
  title: string | null
  artist: string | null
}>()
</script>

<template>
  <div class="row">
    <q-card class="col q-ma-xs q-pa-xs" flat :class="{ 'bg-green': title !== null }">
      <div class="text-caption">Titre</div>
      <div class="text-bold">{{ title ?? '???' }}</div>
    </q-card>
    <q-card class="col q-ma-xs q-pa-xs" flat :class="{ 'bg-green': artist !== null }">
      <div class="text-caption">Artiste</div>
      <div class="text-bold">{{ artist ?? '???' }}</div>
    </q-card>
  </div>
</template>
