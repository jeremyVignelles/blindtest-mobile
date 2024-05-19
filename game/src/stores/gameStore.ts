import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useSessionStorage } from '@vueuse/core'
import type Team from '@/types/team'

export const useGameStore = defineStore('game', () => {
  const isConnected = ref(false)
  const playerRegistered = ref(false)
  const teamJoined = ref(false)
  const playerName = useSessionStorage<string | null>('playerName', null)
  function $reset() {
    playerName.value = null
    teamId.value = null
    teams.value = []
    playerRegistered.value = false
    teamJoined.value = false
    isConnected.value = false
  }
  const teamId = useSessionStorage<string | null>('teamId', null)
  const teams = ref<Team[]>([])

  return {
    isConnected,
    playerName,
    playerRegistered,
    $reset,
    teamId,
    teamJoined,
    teams
  }
})
