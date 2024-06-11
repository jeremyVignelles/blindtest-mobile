import type GameStep from './gameStep'
import type Player from './player'
import type Team from './team'
import type Turn from './turn'

export default interface GlobalGameState {
  teams: Team[]
  unjoinedPlayers: Player[]
  /**
   * The answers to the questions that will be asked in the game.
   */
  steps: GameStep[]
  /**
   * The already replied questions in the game
   * This is used to keep track of the questions that have already been asked
   * currentTurn.length <= steps.length
   */
  turns: Turn[]
  /**
   * The admin-set correctness of the current turn's guesses
   */
  currentTurnCorrectnessOverrides: Record<
    string,
    { isTitleCorrect: boolean; isArtistCorrect: boolean; isRefused: boolean }
  >
}
