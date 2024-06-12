<script setup lang="ts">
import { ref, inject } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/gameStore'
import { socketSymbol } from '@/plugins/socket'
import CorrectGuessIndicator from './CorrectGuessIndicator.vue'
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
      <q-page @submit="guess" class="column no-wrap">
        <q-scroll-area style="flex: 1 1 1px">
          <q-chat-message
            v-for="(reply, index) in gameState.replies"
            :key="index"
            class="q-mx-sm"
            :name="gameStore.resolveName(reply.author)"
            :sent="reply.author === playerRegistered"
            :text="[reply.answer]"
          >
            <template v-slot:stamp>
              <correct-guess-indicator
                v-if="reply.isTitleCorrect"
                icon="label"
                tooltip-text="Le titre est correct"
              />
              <correct-guess-indicator
                v-if="reply.isArtistCorrect"
                icon="person"
                tooltip-text="L'artiste est correct"
              />
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
