import { io } from 'socket.io-client'
import { useGameStore } from '@/stores/gameStore'
import { storeToRefs } from 'pinia'
import type Player from '@/types/player'
import type { InjectionKey, Plugin } from 'vue'

export interface SocketService {
  register(player: Player): void
}

export const socketSymbol = Symbol('socket') as InjectionKey<SocketService>

const plugin: Plugin = function (app) {
  const { isConnected, player } = storeToRefs(useGameStore())
  const socket = io('/', {
    transports: ['websocket'],
    path: '/ws'
  })

  socket.on('connect', () => {
    console.log('socket connected')
    isConnected.value = true

    if (player.value !== null) {
      socket.emit('playerAdded', player.value)
    }
  })

  socket.on('disconnect', () => {
    console.log('socket disconnected')
    isConnected.value = false
  })

  socket.connect()

  function register(player: Player) {
    socket.emit('playerAdded', player)
  }

  const socketService: SocketService = {
    register
  }

  app.provide(socketSymbol, socketService)
}

export default plugin
