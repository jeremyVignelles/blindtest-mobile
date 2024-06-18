<script setup lang="ts">
defineProps<{
  title: string | null
  titleDisabled?: boolean
  artist: string | null
  artistDisabled?: boolean
}>()
</script>

<template>
  <div class="row no-wrap">
    <q-card
      v-if="!titleDisabled"
      class="col q-ma-xs q-pa-xs"
      flat
      :class="{ 'bg-green': title !== null }"
    >
      <div class="text-caption">Titre</div>
      <div class="text-bold">{{ title ?? '???' }}</div>
    </q-card>
    <q-card
      v-if="!artistDisabled"
      class="col q-ma-xs q-pa-xs"
      flat
      :class="{ 'bg-green': artist !== null }"
    >
      <div class="text-caption">Artiste</div>
      <div class="text-bold">{{ artist ?? '???' }}</div>
    </q-card>
  </div>
</template>

<style scoped>
.q-card {
  transition: background-color 1s;
}
</style>
