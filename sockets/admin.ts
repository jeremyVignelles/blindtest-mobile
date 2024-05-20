import { type Ref, effect } from '@vue/reactivity'
import type { Server } from 'socket.io'
import type GlobalGameState from '../common/types/globalGameState'
import { randomUUID } from 'crypto'
import makeLogger from '../logger'

export function useAdminSocket(io: Server, globalState: Ref<GlobalGameState>) {
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

    socket.on('load', (steps) => {
      logger.log('load', steps)
      globalState.value.steps = steps
      globalState.value.turns = []
    })

    socket.on('nextTurn', () => {
      logger.log('nextTurn')
      const currentTurn = globalState.value.turns.length
      const totalSteps = globalState.value.steps.length
      if (currentTurn < totalSteps) {
        globalState.value.turns.push({
          startTime: +new Date(),
          teamReplies: {},
          acceptAnswers: true
        })
      }
    })

    socket.on('stopTurn', () => {
      logger.log('stopTurn')
      const currentTurn = globalState.value.turns.length
      if (currentTurn > 0) {
        globalState.value.turns[currentTurn - 1].acceptAnswers = false
      }
    })
  })
}
