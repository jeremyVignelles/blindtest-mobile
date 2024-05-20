<script setup lang="ts">
import { ref, inject } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/gameStore'
import { socketSymbol } from '@/plugins/socket'

const socketService = inject(socketSymbol)!

const gameStore = useGameStore()
const { gameState, playerRegistered } = storeToRefs(gameStore)

const message = ref('')

async function guess() {
  if (!message.value) return
  const result = await socketService.guess(message.value)
  // TODO : do something with result, other than logging it
  console.log(result)
  message.value = ''
}
</script>

<template>
  <q-page v-if="gameState">
    <h1 v-if="gameState.currentTurn === 0">En attente de démarrage...</h1>
    <h1 v-else-if="gameState.currentTurn === gameState.totalSteps && !gameState.acceptAnswers">
      Fin du jeu !
    </h1>
    <div v-else>
      <q-form @submit="guess">
        <q-chat-message
          v-for="(reply, index) in gameState.replies"
          :key="index"
          :name="gameStore.resolveName(reply.author)"
          :sent="reply.author === playerRegistered"
          :text="[reply.answer]"
        />
        <q-input
          :disable="
            !gameState.acceptAnswers || (!gameState.waitingForArtist && !gameState.waitingForTitle)
          "
          v-model="message"
          label="Proposition"
        >
          <template v-slot:append>
            <q-btn icon="send" type="submit" @click="guess" color="primary" />
          </template>
        </q-input>
      </q-form>
    </div>
  </q-page>
</template>
