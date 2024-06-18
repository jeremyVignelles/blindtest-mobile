import type Player from './player'
import type TeamReply from './teamReply'

export default interface TeamState {
  name: string
  score: number
  members: Player[]
  /**
   * The current turn of the game (0 = waiting for start, ==totalSteps = last turn)
   */
  currentTurn: number
  /**
   * The total number of steps in the game
   */
  totalSteps: number
  acceptAnswers: boolean
  /**
   * There is a title to be found
   */
  hasTitle: boolean

  /**
   * The title of the song, if it has been revealed
   */
  title: string | null

  /**
   * There is an artist to be found
   */
  hasArtist: boolean

  /**
   * The artist of the song, if it has been revealed
   */
  artist: string | null
  replies: TeamReply[]
}
