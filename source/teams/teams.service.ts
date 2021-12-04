import { Injectable, NotFoundException } from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import { LoggerService } from '../logger/logger.service'
import { StoreService } from '../store/store.service'
import { Team } from './team.entity'

export class TeamNotFound extends NotFoundException {
    constructor(color: string) {
        super(`No team with color "${color}" was found`, 'Team Not Found')
    }
}

@Injectable()
export class TeamsService {
    constructor(
        private readonly logger: LoggerService,
        private readonly store: StoreService,
    ) {
        this.logger.setContext(this.constructor.name)
    }

    getTeams() {
        this.logger.debug(`getTeams`)

        return this.store.list<Team>('team')
    }

    getTeam(color: string) {
        this.logger.debug(`getTeam '${color}'`)

        const team = this.store.get<Team>(`team:${color}`)

        if (team === null) {
            throw new TeamNotFound(color)
        }

        return team
    }

    getTeamGoals(color: string) {
        this.logger.debug(`getTeamGoals '${color}'`)

        return this.getTeam(color).goals
    }

    addTeam(team: Team) {
        team = plainToClass(Team, team)

        this.logger.debug(`setTeam ${team}`)
        this.store.set(`team:${team.color}`, team)
    }

    addTeamGoal(color: string) {
        this.logger.debug(`addTeam '${color}'`)

        return ++this.getTeam(color).goals
    }
}
