import { io } from 'socket.io-client'
import { useGameStore } from '@/stores/gameStore'
import { storeToRefs } from 'pinia'
import type TeamInfo from '@/types/teamInfo'
import type Player from '@/types/player'
import type { InjectionKey, Plugin } from 'vue'

export interface SocketService {}

export const socketSymbol = Symbol('socket') as InjectionKey<SocketService>

const plugin: Plugin = function (app) {
  const { isConnected, teams, unjoinedPlayers } = storeToRefs(useGameStore())
  const socket = io('/admin', {
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

  socket.on('teamAdded', (team: TeamInfo) => {
    console.log('teamAdded', team)
    if (teams.value.find((t) => t.id === team.id)) {
      console.error('Team already exists')
      return
    }
    teams.value.push({
      ...team,
      score: 0,
      members: []
    })
  })

  socket.on('teamRemoved', (teamId: string) => {
    console.log('teamRemoved', teamId)
    teams.value = teams.value.filter((team) => team.id !== teamId)
  })

  socket.on('teamRenamed', (team: TeamInfo) => {
    console.log('teamRenamed', team)
    const foundTeam = teams.value.find((t) => team.id === t.id)
    if (!foundTeam) {
      console.error('Team not found')
      return
    }
    foundTeam.name = team.name
  })

  socket.on('playerAdded', (player: Player) => {
    console.log('playerAdded', player)
    if (unjoinedPlayers.value.find((p) => p.id === player.id)) {
      console.error('Player already exists')
      return
    }
    if (teams.value.some((team) => team.members.some((p) => p.id === player.id))) {
      console.error('Player already in a team')
      return
    }
    unjoinedPlayers.value.push(player)
  })

  socket.on('playerRemoved', (playerId: string) => {
    console.log('playerRemoved', playerId)
    unjoinedPlayers.value = unjoinedPlayers.value.filter((player) => player.id !== playerId)
    teams.value.forEach((team) => {
      team.members = team.members.filter((player) => player.id !== playerId)
    })
  })

  socket.on('playerRenamed', (player: Player) => {
    console.log('playerRenamed', player)
    const foundPlayer = unjoinedPlayers.value.find((p) => p.id === player.id)
    if (foundPlayer) {
      foundPlayer.name = player.name
    }
    teams.value.forEach((team) => {
      const foundPlayer = team.members.find((p) => p.id === player.id)
      if (foundPlayer) {
        foundPlayer.name = player.name
      }
    })
  })

  socket.on('playerJoined', (playerId: string, teamId: string) => {
    console.log('playerJoined', playerId, teamId)
    const team = teams.value.find((team) => team.id === teamId)
    const player = unjoinedPlayers.value.find((player) => player.id === playerId)
    if (!team || !player) {
      console.error('Team or player not found')
      return
    }
    // Remove player from unjoinedPlayers and add to the appropriate team
    unjoinedPlayers.value = unjoinedPlayers.value.filter((player) => player.id !== playerId)
    // Add player to the appropriate team
    team.members.push(player)
  })
  socket.connect()

  const socketService: SocketService = {}

  app.provide(socketSymbol, socketService)
}

export default plugin
