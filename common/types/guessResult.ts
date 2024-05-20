export interface AlreadyTriedGuessResult {
  isAlreadyTried: true
}
export interface ValidationGuessResult {
  isAlreadyTried: false
  isTitleCorrect: boolean
  isArtistCorrect: boolean
}
export interface ErrorGuessResult {
  error: string
}
export type GuessResult = AlreadyTriedGuessResult | ValidationGuessResult | ErrorGuessResult
