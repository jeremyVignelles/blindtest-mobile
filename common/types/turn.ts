import type TeamReply from './teamReply'

export default interface Turn {
  teamReplies: Record<string, TeamReply[]>
  startTime: number
  acceptAnswers: boolean
}
