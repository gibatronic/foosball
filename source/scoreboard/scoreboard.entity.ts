import { MessageEvent } from '@nestjs/common'
import { Team } from '../teams/team.entity'

export interface ScoreboardViewData {
    serializedTeamMap: string
    teams: Team[]
    version: string
    winner: Team | null
}

export interface ScoreboardMessageEvent extends MessageEvent {
    data: Team | Team[]
}
