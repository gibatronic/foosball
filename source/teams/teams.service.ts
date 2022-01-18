import { Injectable, NotFoundException } from '@nestjs/common'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import { plainToInstance } from 'class-transformer'
import { EVENT_GOAL, EVENT_TEAM } from '../event-emitter/constants'
import { LoggerService } from '../logger/logger.service'
import { StoreService } from '../store/store.service'
import { TransformerGroups } from '../transformer-groups.enum'
import { Team } from './team.entity'

export class UnknownTeam extends NotFoundException {
    constructor(name: string) {
        super(`Unknown "${name}" team`, 'Unknown Team')
    }
}

@Injectable()
export class TeamsService {
    private readonly storePrefix = 'team:'

    constructor(
        private readonly eventEmitter: EventEmitter2,
        private readonly logger: LoggerService,
        private readonly store: StoreService,
    ) {
        this.logger.setup(this.constructor.name)
    }

    setTeam(team: Team) {
        team = plainToInstance(Team, team, {
            groups: [TransformerGroups.INTERNAL],
        })

        this.logger.debug(`setTeam ${team}`)
        this.store.set(`${this.storePrefix}${team.name}`, team)
        this.eventEmitter.emit(EVENT_TEAM, team)

        return team
    }

    setTeams(teams: Team[]) {
        this.logger.debug(`setTeams ${teams.length}`)
        return teams.map((team) => this.setTeam(team))
    }

    getTeam(name: string) {
        this.logger.debug(`getTeam '${name}'`)
        const team = this.store.get<Team>(`${this.storePrefix}${name}`)

        if (team === null) {
            throw new UnknownTeam(name)
        }

        return team
    }

    getTeams() {
        this.logger.debug('getTeams')
        return this.store.list<Team>(this.storePrefix)
    }

    @OnEvent(EVENT_GOAL)
    incrementTeamPoints(name: string) {
        this.logger.debug(`incrementTeamPoints '${name}'`)
        const team = this.getTeam(name)
        team.points = team.points + 1
        return this.setTeam(team)
    }

    decrementTeamPoints(name: string) {
        this.logger.debug(`decrementTeamPoints '${name}'`)
        const team = this.getTeam(name)
        team.points = Math.max(0, team.points - 1)
        return this.setTeam(team)
    }

    resetTeamPoints(name: string) {
        this.logger.debug(`resetTeamPoints '${name}'`)
        const team = this.getTeam(name)
        team.points = 0
        return this.setTeam(team)
    }
}
