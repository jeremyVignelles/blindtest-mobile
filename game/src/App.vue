<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/gameStore'
import RegisterForm from '@/components/RegisterForm.vue'
import GameView from '@/components/GameView.vue'
import SelectTeam from '@/components/SelectTeam.vue'
const { isConnected, playerRegistered, gameState, teamJoined, teamName } =
  storeToRefs(useGameStore())
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <template v-if="teamJoined">
          <q-toolbar-title>Équipe {{ teamName }}</q-toolbar-title>
          <span>{{ gameState?.currentTurn }} / {{ gameState?.totalSteps }}</span>
        </template>
        <q-toolbar-title v-else>Rejoignez la partie !</q-toolbar-title>
      </q-toolbar>
    </q-header>
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
