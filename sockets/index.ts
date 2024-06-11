import type { Server } from 'socket.io'
import type GlobalGameState from '../common/types/globalGameState'
import { ref } from '@vue/reactivity'
import { useAdminSocket } from './admin'
import { useGameSocket } from './game'
import { useRooms } from './room'

export function useSockets(io: Server) {
  const globalState = ref<GlobalGameState>({
    teams: [],
    unjoinedPlayers: [],
    steps: [],
    turns: [],
    currentTurnCorrectnessOverrides: {}
  })

  useAdminSocket(io, globalState)
  useGameSocket(io, globalState)
  useRooms(io, globalState)
}
