<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/gameStore'
import RegisterForm from '@/components/RegisterForm.vue'
import GameView from '@/components/GameView.vue'
import SelectTeam from '@/components/SelectTeam.vue'
const { isConnected, playerRegistered, teamJoined } = storeToRefs(useGameStore())
</script>

<template>
  <main>
    <q-inner-loading v-if="!isConnected">
      <q-spinner-bars />
    </q-inner-loading>
    <register-form v-else-if="!playerRegistered" />
    <select-team v-else-if="!teamJoined" />
    <game-view v-else />
  </main>
</template>

<style scoped></style>
