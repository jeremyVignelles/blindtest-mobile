import type GameStep from './common/types/gameStep'

export function check(
  expected: GameStep,
  lowerGuess: string
): { isTitleCorrect: boolean; isArtistCorrect: boolean } {
  return {
    isTitleCorrect: expected.title?.toLowerCase() === lowerGuess,
    isArtistCorrect: expected.artist?.toLowerCase() === lowerGuess
  }
}
