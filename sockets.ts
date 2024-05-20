import type { Server } from 'socket.io'
import type GlobalGameState from './common/types/globalGameState'
import { randomUUID } from 'crypto'
import makeLogger from './logger'
import { ref, effect, computed, type ReactiveEffectRunner } from '@vue/reactivity'
import type TeamState from './common/types/teamState'

export function useSockets(io: Server) {
  const globalState = ref<GlobalGameState>({
    teams: [],
    unjoinedPlayers: [],
    steps: [],
    turns: []
  })

  useAdminSocket(io)
  useGameSocket(io)
  useRooms(io)

  const teams = computed(() => globalState.value.teams)

  effect(() => {
    io.of('/').emit('teams', teams.value)
  })

  const teamsState = computed<Record<string, TeamState>>(() => {
    const state: Record<string, TeamState> = {}
    const currentTurn = globalState.value.turns.length
    const totalSteps = globalState.value.steps.length
    const turn = currentTurn > 0 ? globalState.value.turns[currentTurn - 1] : null
    globalState.value.teams.forEach((team) => {
      state[team.id] = {
        name: team.name,
        members: team.members,
        score: team.score,
        currentTurn: currentTurn,
        totalSteps: totalSteps,
        acceptAnswers: turn?.acceptAnswers ?? false,
        replies: turn?.teamReplies[team.id] ?? []
      }
    })
    return state
  })

  function useAdminSocket(io: Server) {
    const adms = io.of('/admin')
    adms.on('connection', (socket) => {
      const logger = makeLogger('admin ' + randomUUID())
      logger.log('connected')
      const updateStateEffect = effect(() => {
        socket.emit('state', globalState.value)
      })

      socket.on('disconnect', () => {
        logger.log('disconnected')
        updateStateEffect.effect.stop()
      })

      socket.on('reset', () => {
        logger.log('reset')
        io.of('/').emit('reset')
        // Close all sockets
        io.of('/').sockets.forEach((s) => s.disconnect(true))
        globalState.value = {
          teams: [],
          unjoinedPlayers: [],
          steps: [],
          turns: []
        }
      })
    })
  }

  function useGameSocket(io: Server) {
    const gs = io.of('/')
    gs.on('connection', (socket) => {
      socket.data.playerId = randomUUID()
      const logger = makeLogger('game ' + socket.data.playerId)
      logger.log('connected')

      socket.emit('teams', teams.value)

      socket.on('disconnect', () => {
        logger.log('disconnected')
        const unjoinedPlayerIndex = globalState.value.unjoinedPlayers.findIndex(
          (p) => p.id === socket.data.playerId
        )
        if (unjoinedPlayerIndex !== -1) {
          globalState.value.unjoinedPlayers.splice(unjoinedPlayerIndex, 1)
        }
        globalState.value.teams.forEach((team) => {
          const memberIndex = team.members.findIndex((m) => m.id === socket.data.playerId)
          if (memberIndex !== -1) {
            team.members.splice(memberIndex, 1)
          }
        })
      })

      socket.on('createTeam', (teamName: string, cb: (teamId: string) => void) => {
        logger.log('createTeam', teamName)
        const teamId = randomUUID()
        globalState.value.teams.push({
          id: teamId,
          name: teamName,
          members: [],
          score: 0
        })
        cb(teamId)
      })

      socket.on('join', (teamId: string, ack: (success: boolean) => void) => {
        logger.log('join', teamId)
        const team = globalState.value.teams.find((t) => t.id === teamId)
        const pendingPlayer = globalState.value.unjoinedPlayers.find(
          (p) => p.id === socket.data.playerId
        )
        if (team && pendingPlayer) {
          socket.data.teamId = teamId
          socket.join(teamId)
          team.members.push(pendingPlayer)
          globalState.value.unjoinedPlayers = globalState.value.unjoinedPlayers.filter(
            (p) => p.id !== socket.data.playerId
          )
          ack(true)
        } else {
          ack(false)
        }
      })

      socket.on('register', (playerName: string, ack: (success: boolean) => void) => {
        logger.log('register', playerName)
        globalState.value.unjoinedPlayers.push({
          id: socket.data.playerId,
          name: playerName
        })
        ack(true)
      })
    })
  }

  function useRooms(io: Server) {
    const rooms: Record<string, ReactiveEffectRunner> = {}
    io.of('/').adapter.on('create-room', (room: string) => {
      rooms[room] = effect(() => {
        const roomState = teamsState.value[room] // TODO: I think this will trigger a refresh too often
        if (roomState) {
          io.of('/').to(room).emit('state', roomState)
        }
      })
    })

    io.of('/').adapter.on('delete-room', (room: string) => {
      rooms[room].effect.stop()
      delete rooms[room]
    })
  }
}
