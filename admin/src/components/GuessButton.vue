<script setup lang="ts">
defineProps<{
  icon: string
  color: string
  tooltipText: string
}>()

const model = defineModel<boolean>({ required: true })
</script>

<template>
  <q-btn round flat :color="model ? color : undefined" @click="model = !model">
    <q-icon :name="icon" size="sm" />
    <q-tooltip>{{ tooltipText }}</q-tooltip>
  </q-btn>
</template>
