<script setup lang="ts">
import { computed, ref, inject } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { socketSymbol } from '@/plugins/socket'
import TeamCard from '@/components/TeamCard.vue'
import type { QFile } from 'quasar'
import type GameStep from './types/gameStep'
import GuessesList from './components/GuessList.vue'
import type Team from './types/team'
import AnswerDisplay from './components/AnswerDisplay.vue'
const gameStore = useGameStore()

const socketService = inject(socketSymbol)!

const leftDrawerOpen = ref(false)
const fileInput = ref<QFile>()

const currentTurn = computed(() => {
  if (gameStore.globalGameState.turns.length === 0) {
    return null
  } else {
    return {
      ...gameStore.globalGameState.turns[gameStore.globalGameState.turns.length - 1],
      title:
        gameStore.globalGameState.steps[gameStore.globalGameState.turns.length - 1].title ?? null,
      artist:
        gameStore.globalGameState.steps[gameStore.globalGameState.turns.length - 1].artist ?? null
    }
  }
})
const hasNextTurn = computed(() => {
  return gameStore.globalGameState.turns.length < gameStore.globalGameState.steps.length
})

const sortedTeams = computed(() => {
  return gameStore.globalGameState.teams.slice().sort((a, b) => b.score - a.score)
})

function teamCardProps(team: Team) {
  const currentStepReplies = currentTurn.value?.teamReplies[team.id]
  return {
    team,
    currentStepTitleCorrect: currentStepReplies?.some((reply) => reply.isTitleCorrect) ?? false,
    currentStepArtistCorrect: currentStepReplies?.some((reply) => reply.isArtistCorrect) ?? false
  }
}

function uploadFile(value: File) {
  const reader = new FileReader()
  reader.onload = () => {
    const data = JSON.parse(reader.result as string)

    console.log('read file', data)
    // Check this is an array
    if (!Array.isArray(data)) {
      console.error('Invalid file format: root is not an array')
      return
    }
    // Check all items are of type GameStep
    if (
      !data.every(
        (item) =>
          Object.keys(item).length > 0 &&
          Object.keys(item).every((key) => ['artist', 'title'].includes(key))
      )
    ) {
      console.error('Invalid file format')
      return
    }
    socketService.loadGame(data as GameStep[])
  }
  reader.readAsText(value)
}
</script>

<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="leftDrawerOpen = !leftDrawerOpen" />

        <q-toolbar-title> Blindtest Mobile Admin </q-toolbar-title>

        <span>
          {{ gameStore.globalGameState.turns.length }} /
          {{ gameStore.globalGameState.steps.length }}
        </span>
        <q-btn
          v-if="gameStore.globalGameState.steps.length === 0"
          dense
          flat
          round
          icon="file_upload"
          @click="fileInput?.pickFiles"
        />
        <q-btn
          v-else-if="currentTurn?.acceptAnswers === true"
          dense
          flat
          round
          icon="stop"
          @click="socketService.stopTurn"
        />
        <q-btn
          v-else-if="hasNextTurn"
          dense
          flat
          round
          icon="skip_next"
          @click="socketService.nextTurn"
        />

        <q-file
          v-show="false"
          ref="fileInput"
          :modelValue="null"
          @update:modelValue="uploadFile"
          accept=".json"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" overlay bordered>
      <q-list>
        <q-item clickable v-close-popup @click="socketService.reset">
          <q-item-section avatar>
            <q-icon name="refresh" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Reset</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <q-space />
    </q-drawer>

    <q-page-container>
      <q-page class="row">
        <div v-if="currentTurn" class="col column">
          <AnswerDisplay :title="currentTurn.title" :artist="currentTurn.artist" />
          <GuessesList :guesses="currentTurn.teamReplies" />
        </div>
        <q-scroll-area class="col">
          <div class="column q-pa-xs q-gutter-md">
            <div v-for="team in sortedTeams" :key="team.id">
              <team-card v-bind="teamCardProps(team)" />
            </div>
            <div v-if="gameStore.globalGameState.unjoinedPlayers.length > 0">
              <q-card>
                <q-card-section class="bg-purple text-white q-pa-sm">
                  <span class="text-h5">??</span>
                </q-card-section>
                <q-card-section class="q-pa-sm">
                  <ul class="q-my-none">
                    <li
                      v-for="player in gameStore.globalGameState.unjoinedPlayers"
                      :key="player.id"
                    >
                      {{ player.name }}
                    </li>
                  </ul>
                </q-card-section>
              </q-card>
            </div>
          </div></q-scroll-area
        >
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped></style>
