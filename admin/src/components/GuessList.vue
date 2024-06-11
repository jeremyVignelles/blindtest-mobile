<script setup lang="ts">
import type TeamReply from '@/types/teamReply'
import { computed, inject } from 'vue'
import GuessButton from './GuessButton.vue'
import { socketSymbol } from '@/plugins/socket'

const props = defineProps<{
  guesses: Record<string, TeamReply[]>
}>()

const socketService = inject(socketSymbol)!

const aggregatedGuesses = computed(() => {
  const guesses = Object.entries(props.guesses).flatMap(([key, replies]) =>
    replies.map((r, index) => ({ ...r, teamId: key, index }))
  )
  guesses.sort((a, b) => a.time - b.time)
  return guesses
})

function setTitleCorrect(guess: TeamReply, newValue: boolean) {
  socketService.setTitleCorrect(guess.answer, newValue)
}

function setArtistCorrect(guess: TeamReply, newValue: boolean) {
  socketService.setArtistCorrect(guess.answer, newValue)
}

function setRefused(guess: TeamReply, newValue: boolean) {
  socketService.setRefused(guess.answer, newValue)
}
</script>
<template>
  <main class="q-pa-md">
    <q-list separator>
      <q-item v-for="guess in aggregatedGuesses" :key="guess.teamId + '-' + guess.index">
        <q-item-section>
          <q-item-label>{{ guess.answer }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <div class="row">
            <GuessButton
              icon="label"
              color="green"
              tooltipText="Titre correct ?"
              :modelValue="guess.isTitleCorrect"
              @update:modelValue="setTitleCorrect(guess, $event)"
            />
            <GuessButton
              icon="person"
              color="green"
              tooltipText="Artiste correct ?"
              :modelValue="guess.isArtistCorrect"
              @update:modelValue="setArtistCorrect(guess, $event)"
            />
            <GuessButton
              icon="block"
              color="red"
              tooltipText="Réponse refusée ?"
              :modelValue="guess.isRefused"
              @update:modelValue="setRefused(guess, $event)"
            />
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </main>
</template>
