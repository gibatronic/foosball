import { Injectable, NotFoundException } from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import { LoggerService } from '../logger/logger.service'
import { StoreService } from '../store/store.service'
import { TransformerGroups } from '../transformer-groups.enum'
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
        this.logger.setup(this.constructor.name)
    }

    addTeam(team: Team) {
        team = plainToClass(Team, team, {
            groups: [TransformerGroups.PRIVATE],
        })

        this.logger.debug(`addTeam ${team}`)
        this.store.set(`team:${team.color}`, team)
    }

    addTeams(teams: Team[]) {
        this.logger.debug(`addTeams ${teams.length}`)
        teams.forEach((team) => this.addTeam(team))
    }

    getTeam(color: string) {
        this.logger.debug(`getTeam '${color}'`)

        const team = this.store.get<Team>(`team:${color}`)

        if (team === null) {
            throw new TeamNotFound(color)
        }

        return team
    }

    getTeams() {
        this.logger.debug(`getTeams`)
        return this.store.list<Team>('team')
    }

    getTeamPoints(color: string) {
        this.logger.debug(`getTeamGoals '${color}'`)
        return this.getTeam(color).points
    }

    incrementTeamPoint(color: string) {
        this.logger.debug(`incrementTeamPoint '${color}'`)
        return ++this.getTeam(color).points
    }

    decrementTeamPoint(color: string) {
        this.logger.debug(`decrementTeamPoint '${color}'`)
        return --this.getTeam(color).points
    }
}
