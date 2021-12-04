import { LogLevel } from '@nestjs/common'
import { Team } from '../teams/team.entity'

export interface Configuration {
    environment: string
    logLevels: LogLevel[]
    port: number
    teams: Team[]
}

function getLogLevels(environment: string): LogLevel[] {
    switch (environment) {
        default:
        case 'development':
            return ['log', 'error', 'warn', 'debug']
        case 'production':
            return ['error', 'warn']
    }
}

export default (): Configuration => {
    if (
        process.env.ENVIRONMENT === undefined ||
        !['development', 'production'].includes(process.env.ENVIRONMENT)
    ) {
        throw new Error(`unkown ENVIRONMENT: "${process.env.ENVIRONMENT}"`)
    }

    return {
        environment: process.env.ENVIRONMENT,
        logLevels: getLogLevels(process.env.ENVIRONMENT),
        port: parseInt(process.env.PORT ?? '0', 10),
        teams: [
            {
                color: 'blue',
                goals: 0,
            },
            {
                color: 'red',
                goals: 0,
            },
        ],
    }
}
