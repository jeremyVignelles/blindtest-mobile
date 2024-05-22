import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useSessionStorage } from '@vueuse/core'
import type Team from '@/types/team'
import type TeamState from '@/types/teamState'
import { computed } from 'vue'

export const useGameStore = defineStore('game', () => {
  const isConnected = ref(false)
  const gameState = ref<TeamState | null>(null)
  const playerRegistered = ref<string | null>(null)
  const teamJoined = ref(false)
  const playerName = useSessionStorage<string | null>('playerName', null)
  function $reset() {
    playerName.value = null
    teamId.value = null
    teams.value = []
    playerRegistered.value = null
    teamJoined.value = false
    isConnected.value = false
  }
  const teamId = useSessionStorage<string | null>('teamId', null)
  const teams = ref<Team[]>([])

  function resolveName(userId: string) {
    return gameState.value?.members.find((m) => m.id === userId)?.name ?? '??'
  }

  const teamName = computed(() => {
    return teams.value.find((t) => t.id === teamId.value)?.name
  })

  return {
    isConnected,
    gameState,
    playerName,
    playerRegistered,
    $reset,
    resolveName,
    teamId,
    teamName,
    teamJoined,
    teams
  }
})
