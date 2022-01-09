import { Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { instanceToInstance, plainToClass } from 'class-transformer'
import { Config } from '../config/config.entity'
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
        private readonly config: ConfigService<Config, true>,
        private readonly logger: LoggerService,
        private readonly store: StoreService,
    ) {
        this.logger.setup(this.constructor.name)
    }

    setTeam(team: Team) {
        team = plainToClass(Team, team, {
            groups: [TransformerGroups.PRIVATE],
        })

        this.logger.debug(`setTeam ${team}`)
        this.store.set(`team:${team.color}`, team)
    }

    setTeams(teams: Team[]) {
        this.logger.debug(`setTeams ${teams.length}`)
        teams.forEach((team) => this.setTeam(team))
    }

    getTeam(color: string) {
        this.logger.debug(`getTeam '${color}'`)
        const team = this.store.get<Team>(`team:${color}`)

        if (team === null) {
            throw new TeamNotFound(color)
        }

        return instanceToInstance(team, {
            groups: [TransformerGroups.PRIVATE],
        })
    }

    getTeams() {
        this.logger.debug(`getTeams`)
        const teams = this.config.get<Config['teams']>('teams')
        return teams.map(({ color }) => this.getTeam(color))
    }

    getTeamPoints(color: string) {
        this.logger.debug(`getTeamPoints '${color}'`)
        return this.getTeam(color).points
    }

    incrementTeamPoints(color: string) {
        this.logger.debug(`incrementTeamPoints '${color}'`)

        const team = this.getTeam(color)
        team.points = team.points + 1
        this.setTeam(team)

        return team.points
    }

    decrementTeamPoints(color: string) {
        this.logger.debug(`decrementTeamPoints '${color}'`)

        const team = this.getTeam(color)
        team.points = Math.max(0, team.points - 1)
        this.setTeam(team)

        return team.points
    }

    resetTeamPoints(color: string) {
        this.logger.debug(`resetTeamPoints '${color}'`)

        if (color === 'all') {
            this.setTeams(
                this.getTeams().map((team) => {
                    team.points = 0
                    return team
                }),
            )

            return
        }

        const team = this.getTeam(color)
        team.points = 0
        this.setTeam(team)
    }
}
