<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/gameStore'
import RegisterForm from '@/components/RegisterForm.vue'
import GameView from '@/components/GameView.vue'
import SelectTeam from '@/components/SelectTeam.vue'
const { isConnected, playerRegistered, teamJoined } = storeToRefs(useGameStore())
</script>

<template>
  <q-layout>
    <q-page-container>
      <q-page v-if="!isConnected">
        <q-inner-loading>
          <q-spinner-bars />
        </q-inner-loading>
      </q-page>
      <register-form v-else-if="playerRegistered === null" />
      <select-team v-else-if="!teamJoined" />
      <game-view v-else />
    </q-page-container>
  </q-layout>
</template>

<style scoped></style>
