import { LogLevel } from '@nestjs/common'
import { Team } from '../teams/team.entity'
import { Environment } from './environment.entity'

export interface Config {
    environment: Environment
    logFile: string | null
    logLevels: LogLevel[]
    port: number
    teams: Team[]
    version: string
}

export type ConfigFile = {
    [key in Environment]: Config
}
