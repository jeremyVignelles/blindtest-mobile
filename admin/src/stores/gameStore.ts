import type Team from '@/types/team'
import type Player from '@/types/player'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useSessionStorage } from '@vueuse/core'

export const useGameStore = defineStore('game', () => {
  const isConnected = ref(false)
  const teams = useSessionStorage<Team[]>('teams', [])
  const unjoinedPlayers = useSessionStorage<Player[]>('unjoinedPlayers', [])

  return {
    isConnected,
    teams,
    unjoinedPlayers
  }
})
