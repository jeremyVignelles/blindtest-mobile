import { io } from 'socket.io-client'
import { useGameStore } from '@/stores/gameStore'
import { storeToRefs } from 'pinia'
import type { InjectionKey, Plugin } from 'vue'
import type GlobalGameState from '@/types/globalGameState'

export interface SocketService {
  reset: () => void
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
    }
  }

  app.provide(socketSymbol, socketService)
}

export default plugin
