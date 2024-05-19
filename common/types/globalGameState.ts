import type Player from './player'
import type Team from './team'

export default interface GlobalGameState {
  teams: Team[]
  unjoinedPlayers: Player[]
}
