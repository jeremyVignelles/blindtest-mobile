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
  const guesses = Object.entries(props.guesses).flatMap(([teamId, replies]) =>
    replies.map((r) => ({ ...r, teamsId: [teamId], id: r.answer.toLowerCase() }))
  )
  guesses.sort((a, b) => a.time - b.time)

  // remove duplicates
  const alreadySeen = new Set<string>()
  return guesses.filter((guess) => {
    if (alreadySeen.has(guess.id)) return false
    alreadySeen.add(guess.id)
    return true
  })
})
</script>
<template>
  <main class="q-pa-md">
    <q-list separator>
      <q-item v-for="guess in aggregatedGuesses" :key="guess.id">
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
              @update:modelValue="socketService.setTitleCorrect(guess.answer, $event)"
            />
            <GuessButton
              icon="person"
              color="green"
              tooltipText="Artiste correct ?"
              :modelValue="guess.isArtistCorrect"
              @update:modelValue="socketService.setArtistCorrect(guess.answer, $event)"
            />
            <GuessButton
              icon="block"
              color="red"
              tooltipText="Réponse refusée ?"
              :modelValue="guess.isRefused"
              @update:modelValue="socketService.setRefused(guess.answer, $event)"
            />
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </main>
</template>
