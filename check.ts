import type GameStep from './common/types/gameStep'

export function check(
  expected: GameStep,
  normalizedGuess: string
): { isTitleCorrect: boolean; isArtistCorrect: boolean } {
  return {
    isTitleCorrect: normalize(expected.title) === normalizedGuess,
    isArtistCorrect: normalize(expected.artist) === normalizedGuess
  }
}

const charMapping = new Map([
  [' ', ' '],
  ['a', 'a'],
  ['b', 'b'],
  ['c', 'c'],
  ['d', 'd'],
  ['e', 'e'],
  ['f', 'f'],
  ['g', 'g'],
  ['h', 'h'],
  ['i', 'i'],
  ['j', 'j'],
  ['k', 'k'],
  ['l', 'l'],
  ['m', 'm'],
  ['n', 'n'],
  ['o', 'o'],
  ['p', 'p'],
  ['q', 'q'],
  ['r', 'r'],
  ['s', 's'],
  ['t', 't'],
  ['u', 'u'],
  ['v', 'v'],
  ['w', 'w'],
  ['x', 'x'],
  ['y', 'y'],
  ['z', 'z'],
  ['à', 'a'],
  ['â', 'a'],
  ['æ', 'a'],
  ['ç', 'c'],
  ['è', 'e'],
  ['é', 'e'],
  ['ê', 'e'],
  ['ë', 'e'],
  ['î', 'i'],
  ['ï', 'i'],
  ['ô', 'o'],
  ['œ', 'o'],
  ['ù', 'u'],
  ['û', 'u'],
  ['ü', 'u'],
  ['ÿ', 'y']
])

export function normalize(value: string): string
export function normalize(value: null): null
export function normalize(value: undefined): undefined
export function normalize(value: string | null): string | null
export function normalize(value: string | undefined): string | undefined
export function normalize(value: string | null | undefined): string | null | undefined {
  if (!value) return value

  return (
    value
      .toLocaleLowerCase()
      // Map characters using the charMap and discard the rest
      .split('')
      .map((char) => charMapping.get(char) || '')
      .join('')
      .trim()
  )
}
