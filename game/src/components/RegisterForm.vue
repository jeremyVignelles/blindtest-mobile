<script setup lang="ts">
import { ref, inject } from 'vue'
import { socketSymbol } from '@/plugins/socket'
import { useGameStore } from '@/stores/gameStore'

const socketService = inject(socketSymbol)!
const gameStore = useGameStore()
const playerName = ref(gameStore.playerName ?? '')
if (gameStore.playerName) {
  register()
}

function register() {
  if (!playerName.value) return
  gameStore.playerName = playerName.value
  socketService.register(playerName.value)
}
</script>
<template>
  <q-page>
    <q-form @submit="register">
      <q-card>
        <q-card-section>
          <span class="text-h3">Rejoindre le jeu</span>
        </q-card-section>
        <q-card-section>
          <q-input v-model="playerName" label="Votre nom" />
        </q-card-section>
        <q-card-actions align="stretch" vertical>
          <q-btn :disabled="!playerName" type="submit">J'arrive !</q-btn>
        </q-card-actions>
      </q-card>
    </q-form>
  </q-page>
</template>
