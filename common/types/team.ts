import type Player from './player'
import type TeamInfo from './teamInfo'
export default interface Team extends TeamInfo {
  score: number
  members: Player[]
}
