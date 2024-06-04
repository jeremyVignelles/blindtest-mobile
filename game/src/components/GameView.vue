<script setup lang="ts">
import { ref, inject } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/gameStore'
import { socketSymbol } from '@/plugins/socket'
import type { QInput } from 'quasar'

const socketService = inject(socketSymbol)!

const gameStore = useGameStore()
const { gameState, playerRegistered } = storeToRefs(gameStore)

const message = ref('')
const guessInput = ref<QInput>()

async function guess() {
  if (!message.value) return
  const result = await socketService.guess(message.value)
  // TODO : do something with result, other than logging it
  console.log(result)
  message.value = ''
  guessInput.value?.focus()
}
</script>

<template>
  <template v-if="gameState">
    <q-page v-if="gameState.currentTurn === 0" class="flex flex-center">
      <h1>En attente de démarrage...</h1>
    </q-page>
    <q-page
      v-else-if="gameState.currentTurn === gameState.totalSteps && !gameState.acceptAnswers"
      class="flex flex-center"
    >
      <h1>Fin du jeu !</h1>
    </q-page>

    <q-form v-else>
      <q-page @submit="guess" class="column">
        <q-scroll-area class="col-grow">
          <q-chat-message
            v-for="(reply, index) in gameState.replies"
            :key="index"
            class="q-mx-sm"
            :name="gameStore.resolveName(reply.author)"
            :sent="reply.author === playerRegistered"
            :text="[reply.answer]"
          >
            <template v-slot:stamp>
              <q-icon v-if="reply.isTitleCorrect" name="label" color="green" />
              <q-icon v-if="reply.isArtistCorrect" name="person" color="green" />
            </template>
          </q-chat-message>
        </q-scroll-area>
        <q-input
          ref="guessInput"
          outlined
          autofocus
          autocomplete="off"
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
      </q-page>
    </q-form>
  </template>
</template>
