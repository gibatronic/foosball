import { Injectable, ServiceUnavailableException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { OnEvent } from '@nestjs/event-emitter'
import { instanceToPlain } from 'class-transformer'
import { Subject } from 'rxjs'
import { Config } from '../config/config.entity'
import { DisplayDriverService } from '../driver/display-driver.service'
import { EVENT_RESET, EVENT_TEAM, EVENT_WIN } from '../event-emitter/constants'
import { LoggerService } from '../logger/logger.service'
import { Team } from '../teams/team.entity'
import { TeamsService } from '../teams/teams.service'
import { TransformerGroups } from '../transformer-groups.enum'
import { _, digits } from './constants'
import { ScoreboardMessageEvent, ScoreboardViewData } from './scoreboard.entity'

@Injectable()
export class ScoreboardService {
    private readonly colorsPerPixel = 4 // RGBW
    private readonly digitColumns = 3
    private readonly frameColumns = 8
    private readonly messages: Subject<ScoreboardMessageEvent> = new Subject()

    constructor(
        private readonly config: ConfigService<Config, true>,
        private readonly displayDriver: DisplayDriverService,
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

    framePoints(frame: Uint8Array, column: number, { color, points }: Team) {
        const digit = digits[points]
        const digitPixels = digit.length
        const columnDelta = this.frameColumns - this.digitColumns

        // map each digit pixel to a specific frame pixel, for example:
        //
        // digit
        // ┌ 1 1 1 ┐
        // │ 1 0 1 │
        // │ 1 1 1 │
        // │ 1 0 1 │
        // └ 1 1 1 ┘
        //
        // frame
        // ┌ 0 0 0 0 0 0 0 0 ┐
        // │ 0 0 0 0 0 0 0 0 │
        // │ 0 0 0 0 0 0 0 0 │
        // │ 0 0 0 0 0 0 0 0 │
        // └ 0 0 0 0 0 0 0 0 ┘
        //
        // frame + digit at column 5:
        // ┌ 0 0 0 0 0 1 1 1 ┐
        // │ 0 0 0 0 0 1 0 1 │
        // │ 0 0 0 0 0 1 1 1 │
        // │ 0 0 0 0 0 1 0 1 │
        // └ 0 0 0 0 0 1 1 1 ┘

        for (
            let digitIndex = 0, pixelIndex = column;
            digitIndex < digitPixels;
            digitIndex += 1,
                pixelIndex +=
                    1 + (digitIndex % this.digitColumns === 0 ? columnDelta : 0)
        ) {
            if (digit[digitIndex] === _) {
                continue
            }

            const frameIndex = pixelIndex * this.colorsPerPixel

            frame[frameIndex + 0] = color[0]
            frame[frameIndex + 1] = color[1]
            frame[frameIndex + 2] = color[2]
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
        this.updateDisplay()
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
        this.updateDisplay()
    }

    teardown() {
        this.logger.debug('teardown')
        this.messages.complete()
        this.messages.unsubscribe()
    }

    updateDisplay() {
        this.logger.debug('updateDisplay')

        const teams = this.teams.getTeams()
        const frame = new Uint8Array(160)

        for (const [index, team] of teams.entries()) {
            this.framePoints(frame, index * 5, team)
        }

        this.displayDriver.display(frame)
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
