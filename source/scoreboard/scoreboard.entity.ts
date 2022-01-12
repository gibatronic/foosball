import { MessageEvent } from '@nestjs/common'
import { Team } from '../teams/team.entity'

export interface ScoreboardViewData {
    teamA: Team
    teamB: Team
    version: string
}

export interface ScoreboardMessageEvent extends MessageEvent {
    data: {
        teamPointsA?: number
        teamPointsB?: number
    }
}
