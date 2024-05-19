<script setup lang="ts">
import { ref, inject } from 'vue'
import type { socketSymbol } from '@/services/socket'

const socketService = inject(socketSymbol)
const playerName = ref('')

function register() {
  socketService.register(playerName.value)
}
</script>
<template>
  <q-form @submit="register">
    <q-card>
      <q-card-section>
        <q-card-title>Rejoindre le jeu</q-card-title>
      </q-card-section>
      <q-card-section>
        <q-input v-model="playerName" label="Votre nom" />
      </q-card-section>
      <q-card-actions>
        <q-btn type="submit">J'arrive !</q-btn>
      </q-card-actions>
    </q-card>
  </q-form>
</template>
