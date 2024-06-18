<script setup lang="ts">
import { computed, ref, inject } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/gameStore'
import { socketSymbol } from '@/plugins/socket'
import CorrectGuessIndicator from './CorrectGuessIndicator.vue'
import { type QInput, type QScrollArea } from 'quasar'
import { useScrollToBottom } from '@/composables/scrollToBottom'
import AnswerDisplay from './AnswerDisplay.vue'

const socketService = inject(socketSymbol)!

const gameStore = useGameStore()
const { gameState, playerRegistered } = storeToRefs(gameStore)

const message = ref('')
const scrollArea = ref<QScrollArea>()
const guessInput = ref<QInput>()

const guessInputDisabled = computed(() => {
  // If the game is not started or if the game is not accepting answers, disable the input
  if (!gameState.value || !gameState.value.acceptAnswers) return true

  // If there is still a title to be found, the input is enabled
  if (gameState.value.hasTitle && !gameState.value.title) return false

  // same for the artist
  if (gameState.value.hasArtist && !gameState.value.artist) return false

  // Otherwise, it is disabled
  return true
})

useScrollToBottom(scrollArea)

async function guess() {
  if (!message.value) return
  guessInput.value?.focus()
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
      <h2 class="text-center">En attente de démarrage...</h2>
    </q-page>
    <q-page
      v-else-if="gameState.currentTurn === gameState.totalSteps && !gameState.acceptAnswers"
      class="flex flex-center"
    >
      <h2 class="text-center">Fin du jeu !</h2>
    </q-page>

    <q-page v-else class="column no-wrap">
      <AnswerDisplay
        :title="gameState.title"
        :title-disabled="!gameState.hasTitle"
        :artist="gameState.artist"
        :artist-disabled="!gameState.hasArtist"
      />
      <q-scroll-area ref="scrollArea" style="flex: 1 1 1px">
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
      <q-form @submit="guess">
        <q-input
          ref="guessInput"
          outlined
          autofocus
          autocomplete="off"
          :disable="guessInputDisabled"
          v-model="message"
          label="Proposition"
        >
          <template v-slot:append>
            <q-btn
              icon="send"
              type="submit"
              @click="guess"
              @touchend.prevent="guess"
              color="primary"
            />
          </template>
        </q-input>
      </q-form>
    </q-page>
  </template>
</template>
