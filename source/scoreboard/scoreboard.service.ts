import { Injectable, ServiceUnavailableException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { OnEvent } from '@nestjs/event-emitter'
import { instanceToPlain } from 'class-transformer'
import { Subject } from 'rxjs'
import { Config } from '../config/config.entity'
import { EVENT_TEAM } from '../event-emitter/constants'
import { LoggerService } from '../logger/logger.service'
import { Team } from '../teams/team.entity'
import { TeamsService } from '../teams/teams.service'
import { TransformerGroups } from '../transformer-groups.enum'
import { ScoreboardMessageEvent, ScoreboardViewData } from './scoreboard.entity'

@Injectable()
export class ScoreboardService {
    private messages: Subject<ScoreboardMessageEvent> = new Subject()

    constructor(
        private readonly config: ConfigService<Config, true>,
        private readonly logger: LoggerService,
        private readonly teams: TeamsService,
    ) {
        this.logger.setup(this.constructor.name)
    }

    getViewData(): ScoreboardViewData {
        this.logger.debug('getViewData')
        const serialize = (team: Team) =>
            instanceToPlain(team, {
                groups: [TransformerGroups.EXTERNAL],
            }) as Team

        const teamList = this.teams.getTeams().map(serialize)
        const teamMap = teamList.reduce((teams, team) => {
            teams[team.name] = team
            return teams
        }, {} as Record<string, Team>)

        return {
            serializedTeamMap: JSON.stringify(teamMap),
            teams: teamList,
            version: this.config.get<Config['version']>('version'),
        }
    }

    streamEvents() {
        this.logger.debug('streamEvents')

        if (this.messages.closed) {
            throw new ServiceUnavailableException()
        }

        return this.messages.asObservable()
    }

    @OnEvent(EVENT_TEAM)
    streamEvent(team: Team) {
        this.logger.debug(`streamEvent ${team}`)

        this.messages.next({
            data: instanceToPlain(team, {
                groups: [TransformerGroups.EXTERNAL],
            }) as Team,
            type: EVENT_TEAM.description,
        })
    }

    teardown() {
        this.logger.debug('teardown')
        this.messages.complete()
        this.messages.unsubscribe()
    }
}
