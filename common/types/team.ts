import type Player from './player'

export default interface Team {
  id: string
  name: string
  members: Player[]
}
