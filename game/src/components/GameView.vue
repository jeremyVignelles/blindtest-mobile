<script setup lang="ts">
import { computed, ref, inject, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/gameStore'
import { socketSymbol } from '@/plugins/socket'
import CorrectGuessIndicator from './CorrectGuessIndicator.vue'
import { type QInput, type QScrollArea } from 'quasar'
import { useScrollToBottom } from '@/composables/scrollToBottom'
import AnswerDisplay from './AnswerDisplay.vue'
import GuessNotification from './GuessNotification.vue'
import type { Notification } from '@/types/notification'

const socketService = inject(socketSymbol)!

const gameStore = useGameStore()
const { gameState, playerRegistered } = storeToRefs(gameStore)

const message = ref('')
const scrollArea = ref<QScrollArea>()
const guessInput = ref<QInput>()
const notification = ref<Notification | null>(null)

const guessInputDisabled = computed(() => {
  // If the game is not started or if the game is not accepting answers, disable the input
  return !gameState.value || !gameState.value.acceptAnswers
})

const turnComplete = computed(() => {
  if (!gameState.value) return true
  // If we have found the artist (if requested) and the title (if requested), then the turn is completed
  return (
    (!gameState.value.hasArtist || !!gameState.value.artist) &&
    (!gameState.value.hasTitle || !!gameState.value.title)
  )
})

watch(turnComplete, (newValue, oldValue) => {
  if (!oldValue && newValue) {
    // When the turn becomes complete, show a notification
    notification.value = {
      message: 'Parfait !',
      type: 'success'
    }
  }
})

useScrollToBottom(scrollArea)

async function guess() {
  if (!message.value) return
  guessInput.value?.focus()
  const result = await socketService.guess(message.value)
  if ('error' in result) {
    notification.value = {
      message: result.error,
      type: 'error'
    }
  } else if (result.isAlreadyTried) {
    notification.value = {
      message: 'Déjà proposé !',
      type: 'error'
    }
  } else if (result.isArtistCorrect || result.isTitleCorrect) {
    notification.value = {
      message: 'Bravo !',
      type: 'success'
    }
  } else {
    notification.value = null
  }
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
        <guess-notification :notification="notification" @transition-end="notification = null" />
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
