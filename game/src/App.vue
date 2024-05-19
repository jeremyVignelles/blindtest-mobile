<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/gameStore'
import RegisterForm from '@/components/RegisterForm.vue'
import GameView from '@/components/GameView.vue'
const { isConnected, player } = storeToRefs(useGameStore())
</script>

<template>
  <main>
    <q-spinner-bars v-if="!isConnected" />
    <register-form v-else-if="!player" />
    <game-view v-else />
  </main>
</template>

<style scoped></style>
