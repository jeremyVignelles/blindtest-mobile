import { io } from 'socket.io-client'
import { useGameStore } from '@/stores/gameStore'
import { storeToRefs } from 'pinia'
import type { InjectionKey, Plugin } from 'vue'
import type Team from '@/types/team'
import type TeamState from '@/types/teamState'
import type { GuessResult } from '@/types/guessResult'

export interface SocketService {
  createTeam(teamName: string): Promise<string>
  guess(guess: string): Promise<GuessResult>
  joinTeam(teamId: string): void
  register(playerName: string): void
}

export const socketSymbol = Symbol('socket') as InjectionKey<SocketService>

const plugin: Plugin = function (app) {
  const gameStore = useGameStore()
  const { isConnected, teamJoined, playerRegistered, teams, gameState } = storeToRefs(gameStore)
  const socket = io('/', {
    transports: ['websocket'],
    path: '/ws'
  })

  socket.on('connect', () => {
    console.log('socket connected')
    isConnected.value = true
  })

  socket.on('disconnect', () => {
    console.log('socket disconnected')
    isConnected.value = false
  })

  socket.on('state', (state: TeamState) => {
    gameState.value = state
  })

  socket.on('reset', () => {
    console.log('reset')
    gameStore.$reset()
  })

  socket.on('teams', (newTeams: Team[]) => {
    console.log('teams', newTeams)
    teams.value = newTeams
  })

  socket.connect()

  function createTeam(teamName: string) {
    return new Promise<string>((resolve) => {
      socket.emit('createTeam', teamName, (teamId: string) => {
        resolve(teamId)
      })
    })
  }
  function guess(guess: string) {
    return new Promise<GuessResult>((resolve) => {
      socket.emit('guess', guess, (guessResult: GuessResult) => {
        resolve(guessResult)
      })
    })
  }

  function joinTeam(teamId: string) {
    socket.emit('join', teamId, (success: boolean) => {
      if (success) {
        console.log('joined team', teamId)
        teamJoined.value = true
      } else {
        console.log('failed to join team', teamId)
      }
    })
  }

  function register(playerName: string) {
    socket.emit('register', playerName, (userId: string | null) => {
      if (userId) {
        console.log('registered')
        playerRegistered.value = userId
      } else {
        console.log('failed to register')
      }
    })
  }

  const socketService: SocketService = {
    createTeam,
    guess,
    joinTeam,
    register
  }

  app.provide(socketSymbol, socketService)
}

export default plugin
