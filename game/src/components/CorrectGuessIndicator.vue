<template>
  <q-btn round flat>
    <q-icon :name="icon" size="sm" />
    <q-badge rounded floating color="green">
      <q-icon name="check_circle" />
    </q-badge>
    <q-tooltip>{{ tooltipText }}</q-tooltip>
  </q-btn>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  icon: String,
  tooltipText: String
})
</script>
