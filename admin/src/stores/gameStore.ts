import type GlobalGameState from '@/types/globalGameState'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGameStore = defineStore('game', () => {
  const isConnected = ref(false)
  const globalGameState = ref<GlobalGameState>({
    teams: [],
    unjoinedPlayers: [],
    steps: [],
    turns: [],
    currentTurnCorrectnessOverrides: {}
  })

  return {
    isConnected,
    globalGameState
  }
})
