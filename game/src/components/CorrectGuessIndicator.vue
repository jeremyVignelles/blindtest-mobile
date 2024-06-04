<template>
  <q-btn round flat @click="tooltipShown = !tooltipShown">
    <q-icon :name="icon" size="sm" />
    <q-badge rounded floating color="green" class="q-pa-none">
      <q-icon name="check_circle" size="xs" />
    </q-badge>
    <q-tooltip v-model="tooltipShown">{{ tooltipText }}</q-tooltip>
  </q-btn>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue'

defineProps({
  icon: String,
  tooltipText: String
})

const tooltipShown = ref(false)
</script>
