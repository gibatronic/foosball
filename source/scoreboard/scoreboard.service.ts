import { Injectable, ServiceUnavailableException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { OnEvent } from '@nestjs/event-emitter'
import { instanceToPlain } from 'class-transformer'
import { Subject } from 'rxjs'
import { Config } from '../config/config.entity'
import { EVENT_RESET, EVENT_TEAM, EVENT_WIN } from '../event-emitter/constants'
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
            winner: this.teams.getWinner(),
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
    streamTeamEvent(team: Team) {
        this.logger.debug(`streamTeamEvent ${team}`)
        this.sendMessage(EVENT_TEAM, team)
    }

    @OnEvent(EVENT_RESET)
    streamResetEvent(teams: Team[]) {
        this.logger.debug('streamResetEvent')
        this.sendMessage(EVENT_RESET, teams)
    }

    @OnEvent(EVENT_WIN)
    streamWinEvent(team: Team) {
        this.logger.debug(`streamWinEvent ${team}`)
        this.sendMessage(EVENT_WIN, team)
    }

    teardown() {
        this.logger.debug('teardown')
        this.messages.complete()
        this.messages.unsubscribe()
    }

    private sendMessage(type: symbol, data: Team | Team[]) {
        this.logger.debug(`sendMessage '${type.description}'`)

        this.messages.next({
            data: instanceToPlain(data, {
                groups: [TransformerGroups.EXTERNAL],
            }) as Team | Team[],
            type: type.description,
        })
    }
}
