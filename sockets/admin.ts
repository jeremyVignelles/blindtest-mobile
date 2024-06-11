import { type Ref, effect } from '@vue/reactivity'
import type { Server } from 'socket.io'
import type GlobalGameState from '../common/types/globalGameState'
import { randomUUID } from 'crypto'
import makeLogger from '../logger'
import type Team from '../common/types/team'
import type TeamReply from '../common/types/teamReply'

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
        turns: [],
        currentTurnCorrectnessOverrides: {}
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
        globalState.value.currentTurnCorrectnessOverrides = {}
      }
    })

    socket.on('stopTurn', () => {
      logger.log('stopTurn')
      const currentTurn = globalState.value.turns.length
      if (currentTurn > 0) {
        globalState.value.turns[currentTurn - 1].acceptAnswers = false
      }
    })

    socket.on('setScore', (teamId, score) => {
      logger.log('setScore', teamId, score)
      const team = globalState.value.teams.find((t) => t.id === teamId)
      if (team) {
        team.score = score
      }
    })

    socket.on('setTitleCorrect', (guess, isCorrect) => {
      logger.log('setTitleCorrect', guess, isCorrect)
      setGuessCorrectness(guess, 'isTitleCorrect', isCorrect)
    })

    socket.on('setArtistCorrect', (guess, isCorrect) => {
      logger.log('setArtistCorrect', guess, isCorrect)
      setGuessCorrectness(guess, 'isArtistCorrect', isCorrect)
    })

    socket.on('setRefused', (guess, isRefused) => {
      logger.log('setRefused', guess, isRefused)
      setGuessCorrectness(guess, 'isRefused', isRefused)
    })

    function setGuessCorrectness(
      guess: string,
      correctnessField: 'isTitleCorrect' | 'isArtistCorrect' | 'isRefused',
      newValue: boolean
    ) {
      const lowerGuess = guess.toLowerCase()
      const currentTurn = globalState.value.turns.length
      if (currentTurn === 0) return

      const turn = globalState.value.turns[currentTurn - 1]
      for (const teamId in turn.teamReplies) {
        const teamReplies = turn.teamReplies[teamId]
        const thisGuessFromThisTeam = teamReplies.find(
          (reply) => reply.answer.toLowerCase() === lowerGuess
        )
        if (!thisGuessFromThisTeam) continue
        const team = globalState.value.teams.find((t) => t.id === teamId)
        if (!team) continue
        logger.debug(
          'Found team',
          team.name,
          'for guess',
          guess,
          'updating correctness for',
          correctnessField
        )
        if (correctnessField === 'isRefused') {
          // If the guess is refused, remove the points for both isTitleCorrect and isArtistCorrect
          fixGuessCorrectness(team, 'isTitleCorrect', false, thisGuessFromThisTeam, teamReplies)
          fixGuessCorrectness(team, 'isArtistCorrect', false, thisGuessFromThisTeam, teamReplies)
          thisGuessFromThisTeam.isRefused = newValue
        } else {
          fixGuessCorrectness(team, correctnessField, newValue, thisGuessFromThisTeam, teamReplies)
        }
      }

      // Store in the overrides list
      globalState.value.currentTurnCorrectnessOverrides[lowerGuess] = {
        ...globalState.value.currentTurnCorrectnessOverrides[lowerGuess],
        [correctnessField]: newValue
      }
    }

    function fixGuessCorrectness(
      team: Team,
      correctnessField: 'isTitleCorrect' | 'isArtistCorrect',
      isCorrect: boolean,
      thisGuessFromThisTeam: TeamReply,
      teamReplies: TeamReply[]
    ) {
      // Detect if this guess correctness changed, and if so, update the score
      if (thisGuessFromThisTeam[correctnessField] != isCorrect) {
        // It was not correct before, but became correct
        if (isCorrect) {
          const hasFoundCorrect = teamReplies.some((reply) => reply[correctnessField])
          thisGuessFromThisTeam[correctnessField] = true
          thisGuessFromThisTeam.isRefused = false
          if (!hasFoundCorrect) {
            // The point was not awarded yet, award the point
            team.score++
          }
        }

        // It was correct before, but became incorrect
        if (!isCorrect) {
          thisGuessFromThisTeam[correctnessField] = false
          if (!teamReplies.some((reply) => reply[correctnessField])) {
            // The point was awarded and no other has correct, remove the point
            team.score--
          }
        }
      }
    }
  })
}
