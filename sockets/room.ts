import type { Server } from 'socket.io'
import type GlobalGameState from '../common/types/globalGameState'
import { effect, computed, type ReactiveEffectRunner, type Ref } from '@vue/reactivity'
import type TeamState from '../common/types/teamState'

export function useRooms(io: Server, globalState: Ref<GlobalGameState>) {
  const teamsState = computed<Record<string, TeamState>>(() => {
    const state: Record<string, TeamState> = {}
    const currentTurn = globalState.value.turns.length
    const totalSteps = globalState.value.steps.length
    const turn = currentTurn > 0 ? globalState.value.turns[currentTurn - 1] : null
    const step = totalSteps > 0 ? globalState.value.steps[currentTurn - 1] : null
    globalState.value.teams.forEach((team) => {
      const teamHasFoundArtist =
        turn?.teamReplies[team.id]?.some((reply) => reply.isArtistCorrect) ?? false
      const teamHasFoundTitle =
        turn?.teamReplies[team.id]?.some((reply) => reply.isTitleCorrect) ?? false
      state[team.id] = {
        name: team.name,
        members: team.members,
        score: team.score,
        currentTurn: currentTurn,
        totalSteps: totalSteps,
        acceptAnswers: turn?.acceptAnswers ?? false,
        waitingForArtist: !!step?.artist && !teamHasFoundArtist,
        waitingForTitle: !!step?.title && !teamHasFoundTitle,
        replies: turn?.teamReplies[team.id] ?? []
      }
    })
    return state
  })

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
