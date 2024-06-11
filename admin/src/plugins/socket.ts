import { io } from 'socket.io-client'
import { useGameStore } from '@/stores/gameStore'
import { storeToRefs } from 'pinia'
import type { InjectionKey, Plugin } from 'vue'
import type GlobalGameState from '@/types/globalGameState'
import type GameStep from '@/types/gameStep'

export interface SocketService {
  reset: () => void
  nextTurn: () => void
  stopTurn: () => void
  loadGame: (steps: GameStep[]) => void
  setScore: (teamId: string, score: number) => void
  setTitleCorrect: (guess: string, isCorrect: boolean) => void
  setArtistCorrect: (guess: string, isCorrect: boolean) => void
  setRefused: (guess: string, isRefused: boolean) => void
}

export const socketSymbol = Symbol('socket') as InjectionKey<SocketService>

const plugin: Plugin = function (app) {
  const { isConnected, globalGameState } = storeToRefs(useGameStore())
  const socket = io('/admin', {
    transports: ['websocket'],
    path: '/ws'
    // TODO : auth
  })

  socket.on('connect', () => {
    console.log('socket connected')
    isConnected.value = true
  })

  socket.on('disconnect', () => {
    console.log('socket disconnected')
    isConnected.value = false
  })

  socket.on('state', (state: GlobalGameState) => {
    console.log('state', state)
    globalGameState.value = state
  })

  socket.connect()

  const socketService: SocketService = {
    reset() {
      socket.emit('reset')
    },
    nextTurn() {
      socket.emit('nextTurn')
    },
    stopTurn() {
      socket.emit('stopTurn')
    },
    loadGame(steps: GameStep[]) {
      socket.emit('load', steps)
    },
    setScore(teamId: string, score: number) {
      socket.emit('setScore', teamId, score)
    },
    setTitleCorrect(guess: string, isCorrect: boolean) {
      socket.emit('setTitleCorrect', guess, isCorrect)
    },
    setArtistCorrect(guess: string, isCorrect: boolean) {
      socket.emit('setArtistCorrect', guess, isCorrect)
    },
    setRefused(guess: string, isRefused: boolean) {
      socket.emit('setRefused', guess, isRefused)
    }
  }

  app.provide(socketSymbol, socketService)
}

export default plugin
