import { LogLevel } from '@nestjs/common'
import { Team } from '../teams/team.entity'

export class Config {
    environment!: 'development' | 'production'
    logLevels!: LogLevel[]
    port!: number
    teams!: Team[]
    version!: string
}
