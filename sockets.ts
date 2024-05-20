import type { Server } from 'socket.io'
import type GlobalGameState from './common/types/globalGameState'
import { randomUUID } from 'crypto'
import makeLogger from './logger'

export function useSockets(io: Server) {
  let globalState: GlobalGameState = {
    teams: [],
    unjoinedPlayers: [],
    steps: [],
    turns: []
  }

  useAdminSocket(io)
  useGameSocket(io)

  function useAdminSocket(io: Server) {
    const adms = io.of('/admin')
    adms.on('connection', (socket) => {
      const logger = makeLogger('admin ' + randomUUID())
      logger.log('connected')
      socket.emit('state', globalState)

      socket.on('reset', () => {
        logger.log('reset')
        io.of('/').emit('reset')
        // Close all sockets
        io.of('/').sockets.forEach((s) => s.disconnect(true))
        globalState = {
          teams: [],
          unjoinedPlayers: [],
          steps: [],
          turns: []
        }
        adms.emit('state', globalState)
      })
    })
  }

  function useGameSocket(io: Server) {
    const gs = io.of('/')
    gs.on('connection', (socket) => {
      socket.data.playerId = randomUUID()
      const logger = makeLogger('game ' + socket.data.playerId)
      logger.log('connected')

      socket.on('disconnect', () => {
        logger.log('disconnected')
        globalState.unjoinedPlayers = globalState.unjoinedPlayers.filter(
          (p) => p.id !== socket.data.playerId
        )
        globalState.teams.forEach((team) => {
          team.members = team.members.filter((m) => m.id !== socket.data.playerId)
        })
        // TODO: si en cours de jeu, rafraîchir le state des rooms
        io.of('/').emit('teams', globalState.teams)
        io.of('/admin').emit('state', globalState)
      })

      socket.on('createTeam', (teamName: string, cb: (teamId: string) => void) => {
        logger.log('createTeam', teamName)
        const teamId = randomUUID()
        globalState.teams.push({
          id: teamId,
          name: teamName,
          members: [],
          score: 0
        })
        cb(teamId)
        io.of('/').emit('teams', globalState.teams)
        io.of('/admin').emit('state', globalState)
      })

      socket.on('join', (teamId: string, ack: (success: boolean) => void) => {
        logger.log('join', teamId)
        const team = globalState.teams.find((t) => t.id === teamId)
        const pendingPlayer = globalState.unjoinedPlayers.find((p) => p.id === socket.data.playerId)
        if (team && pendingPlayer) {
          team.members.push(pendingPlayer)
          globalState.unjoinedPlayers = globalState.unjoinedPlayers.filter(
            (p) => p.id !== socket.data.playerId
          )
          ack(true)
          io.of('/').emit('teams', globalState.teams)
          io.of('/admin').emit('state', globalState)
        } else {
          ack(false)
        }
      })

      socket.on('register', (playerName: string, ack: (success: boolean) => void) => {
        logger.log('register', playerName)
        globalState.unjoinedPlayers.push({
          id: socket.data.playerId,
          name: playerName
        })
        ack(true)
        io.of('/admin').emit('state', globalState)
        io.of('/').emit('teams', globalState.teams)
      })
    })
  }
}
