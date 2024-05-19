import type Player from '@/types/player'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useSessionStorage } from '@vueuse/core'

export const useGameStore = defineStore('game', () => {
  const isConnected = ref(false)
  const player = useSessionStorage<Player | null>('player', null)

  return {
    isConnected,
    player
  }
})
