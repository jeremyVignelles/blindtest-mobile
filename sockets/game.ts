import type { Server } from 'socket.io'
import type GlobalGameState from '../common/types/globalGameState'
import { randomUUID } from 'crypto'
import makeLogger from '../logger'
import { type Ref, computed } from '@vue/reactivity'
import type { GuessResult } from '../common/types/guessResult'
import { check } from '../check'
import { debouncedWatch } from '../debouncedWatch'

export function useGameSocket(io: Server, globalState: Ref<GlobalGameState>) {
  const teams = computed(() => globalState.value.teams)

  debouncedWatch(
    teams,
    (t) => {
      io.of('/').emit('teams', t)
    },
    50
  )
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

    socket.on('guess', (guess: string, ack: (result: GuessResult) => void) => {
      logger.log('guess', guess)
      const currentTurn = globalState.value.turns.length
      if (currentTurn > 0) {
        const turn = globalState.value.turns[currentTurn - 1]
        const teamId = socket.data.teamId
        const team = globalState.value.teams.find((t) => t.id === teamId)
        if (!team) {
          ack({ error: 'Équipe non trouvée' })
          return
        }
        if (teamId && turn.acceptAnswers) {
          if (!turn.teamReplies[teamId]) {
            turn.teamReplies[teamId] = []
          }
          const lowerGuess: string = guess.toLocaleLowerCase()
          if (
            turn.teamReplies[teamId].some(
              (reply) => reply.answer.toLocaleLowerCase() === lowerGuess
            )
          ) {
            ack({ isAlreadyTried: true })
          } else {
            const result = {
              ...check(globalState.value.steps[currentTurn - 1], lowerGuess),
              ...globalState.value.currentTurnCorrectnessOverrides[lowerGuess]
            }
            // Ensure coherence between the admin and the player
            if (result.isRefused) {
              result.isArtistCorrect = false
              result.isTitleCorrect = false
            }
            const points =
              (result.isArtistCorrect &&
              !turn.teamReplies[teamId].some((reply) => reply.isArtistCorrect)
                ? 1
                : 0) +
              (result.isTitleCorrect &&
              !turn.teamReplies[teamId].some((reply) => reply.isTitleCorrect)
                ? 1
                : 0)
            turn.teamReplies[teamId].push({
              answer: guess,
              time: +new Date(),
              author: socket.data.playerId,
              isArtistCorrect: result.isArtistCorrect,
              isTitleCorrect: result.isTitleCorrect,
              isRefused: result.isRefused ?? false
            })
            team.score += points
            ack({ isAlreadyTried: false, ...result, points })
          }
        } else {
          ack({ error: 'Pas de tour en cours' })
        }
      } else {
        ack({ error: 'Pas de tour en cours' })
      }
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

    socket.on('register', (playerName: string, ack: (userId: string | null) => void) => {
      logger.log('register', playerName)
      globalState.value.unjoinedPlayers.push({
        id: socket.data.playerId,
        name: playerName
      })
      ack(socket.data.playerId)
    })
  })
}
