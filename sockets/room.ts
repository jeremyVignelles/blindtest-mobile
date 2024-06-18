import type { Server } from 'socket.io'
import type GlobalGameState from '../common/types/globalGameState'
import { computed, type Ref } from '@vue/reactivity'
import type TeamState from '../common/types/teamState'
import { debouncedWatch } from '../debouncedWatch'
import type { WatchStopHandle } from '@vue-reactivity/watch'

export function useRooms(io: Server, globalState: Ref<GlobalGameState>) {
  const rooms: Record<string, WatchStopHandle> = {}
  io.of('/').adapter.on('create-room', (room: string) => {
    const teamState = computed<TeamState | null>(() => {
      const team = globalState.value.teams.find((team) => team.id === room)
      if (!team) return null

      const currentTurn = globalState.value.turns.length
      const totalSteps = globalState.value.steps.length
      const turn = currentTurn > 0 ? globalState.value.turns[currentTurn - 1] : null
      const step = totalSteps > 0 ? globalState.value.steps[currentTurn - 1] : null

      const lastFoundArtistGuess = turn?.teamReplies[team.id]?.findLast(
        (reply) => reply.isArtistCorrect
      )
      const lastFoundTitleGuess = turn?.teamReplies[team.id]?.findLast(
        (reply) => reply.isTitleCorrect
      )

      const hasArtist = !!step?.artist
      const hasTitle = !!step?.title

      let returnedTitle = null
      let returnedArtist = null

      if (hasTitle) {
        if (!turn?.acceptAnswers) {
          // The turn is finished, show the answer
          returnedTitle = step.title!
        } else if (lastFoundTitleGuess) {
          // Show the answer as it was input by the user
          returnedTitle = lastFoundTitleGuess.answer
        }
      }

      if (hasArtist) {
        if (!turn?.acceptAnswers) {
          // The turn is finished, show the answer
          returnedArtist = step.artist!
        } else if (lastFoundArtistGuess) {
          // Show the answer as it was input by the user
          returnedArtist = lastFoundArtistGuess?.answer
        }
      }
      return {
        name: team.name,
        members: team.members,
        score: team.score,
        currentTurn: currentTurn,
        totalSteps: totalSteps,
        acceptAnswers: turn?.acceptAnswers ?? false,
        hasArtist: hasArtist,
        artist: returnedArtist,
        hasTitle: hasTitle,
        title: returnedTitle,
        replies: turn?.teamReplies[team.id] ?? []
      }
    })
    rooms[room] = debouncedWatch(
      teamState,
      (roomState) => {
        if (roomState) {
          io.of('/').to(room).emit('state', roomState)
        }
      },
      50,
      { immediate: true }
    )
  })

  io.of('/').adapter.on('delete-room', (room: string) => {
    rooms[room]()
    delete rooms[room]
  })
}
