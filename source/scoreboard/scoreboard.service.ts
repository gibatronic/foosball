import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Observable, Subscriber } from 'rxjs'
import { Config } from '../config/config.entity'
import { LoggerService } from '../logger/logger.service'
import { Team } from '../teams/team.entity'
import { TeamsService } from '../teams/teams.service'
import { ScoreboardMessageEvent, ScoreboardViewData } from './scoreboard.entity'

@Injectable()
export class ScoreboardService {
    private sseCache = {
        teamPointsA: 0,
        teamPointsB: 0,
    }

    private sseState = {
        teamPointsA: 0,
        teamPointsB: 0,
    }

    constructor(
        private readonly config: ConfigService<Config, true>,
        private readonly logger: LoggerService,

        @Inject(forwardRef(() => TeamsService))
        private readonly teams: TeamsService,
    ) {
        this.logger.setup(this.constructor.name)
    }

    private getTeams() {
        const [teamA, teamB] = this.teams.getTeams().sort(this.sortByTeamName)
        return { teamA, teamB }
    }

    getViewData(): ScoreboardViewData {
        this.logger.debug('getViewData')
        const { teamA, teamB } = this.getTeams()

        return {
            teamA,
            teamB,
            version: this.config.get<Config['version']>('version'),
        }
    }

    private sortByTeamName(a: Team, b: Team) {
        return a.name.localeCompare(b.name)
    }

    sse() {
        this.logger.debug('sse')

        const {
            teamA: { points: teamPointsA },
            teamB: { points: teamPointsB },
        } = this.getTeams()

        this.sseCache.teamPointsA = teamPointsA
        this.sseCache.teamPointsB = teamPointsB

        this.sseState.teamPointsA = teamPointsA
        this.sseState.teamPointsB = teamPointsB

        return new Observable<ScoreboardMessageEvent>((observer) =>
            this.sseWatch(observer),
        )
    }

    sseUpdateTeamPoints() {
        this.logger.debug('sseUpdateTeamPoints')

        const {
            teamA: { points: teamPointsA },
            teamB: { points: teamPointsB },
        } = this.getTeams()

        if (this.sseState.teamPointsA !== teamPointsA) {
            this.sseState.teamPointsA = teamPointsA
        }

        if (this.sseState.teamPointsB !== teamPointsB) {
            this.sseState.teamPointsB = teamPointsB
        }
    }

    private sseWatch(observer: Subscriber<ScoreboardMessageEvent>) {
        this.logger.debug('sseWatch')

        const tick = () => {
            const data: ScoreboardMessageEvent['data'] = {}

            if (this.sseCache.teamPointsA !== this.sseState.teamPointsA) {
                this.sseCache.teamPointsA = this.sseState.teamPointsA
                data.teamPointsA = this.sseState.teamPointsA
            }

            if (this.sseCache.teamPointsB !== this.sseState.teamPointsB) {
                this.sseCache.teamPointsB = this.sseState.teamPointsB
                data.teamPointsB = this.sseState.teamPointsB
            }

            if (Object.keys(data).length) {
                this.logger.debug(`sseWatch ${JSON.stringify(data)}`)
                observer.next({ data })
            }

            if (observer.closed) {
                return
            }

            setTimeout(tick)
        }

        setTimeout(tick)
    }
}
