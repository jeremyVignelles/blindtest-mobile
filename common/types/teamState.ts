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
  replies: TeamReply[]
}
