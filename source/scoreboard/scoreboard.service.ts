import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { instanceToPlain } from 'class-transformer'
import { fromEventPattern, map, Observable } from 'rxjs'
import { NodeEventHandler } from 'rxjs/internal/observable/fromEvent'
import { Config } from '../config/config.entity'
import { EVENT_TEAM } from '../event-emitter/constants'
import { LoggerService } from '../logger/logger.service'
import { Team } from '../teams/team.entity'
import { TeamsService } from '../teams/teams.service'
import { TransformerGroups } from '../transformer-groups.enum'
import { ScoreboardMessageEvent, ScoreboardViewData } from './scoreboard.entity'

@Injectable()
export class ScoreboardService {
    constructor(
        private readonly config: ConfigService<Config, true>,
        private readonly eventEmitter: EventEmitter2,
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

        const addHandler = (handler: NodeEventHandler) =>
            this.eventEmitter.on(EVENT_TEAM, handler)

        const removeHandler = (handler: NodeEventHandler) =>
            this.eventEmitter.off(EVENT_TEAM, handler)

        const transformHandler = (team: Team) => ({
            data: instanceToPlain(team, {
                groups: [TransformerGroups.EXTERNAL],
            }) as Team,
        })

        const observable: Observable<ScoreboardMessageEvent> =
            fromEventPattern<Team>(addHandler, removeHandler).pipe(
                map(transformHandler),
            )

        return observable
    }
}
