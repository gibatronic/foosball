import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { exec as execCB } from 'node:child_process'
import { FileHandle, open } from 'node:fs/promises'
import { promisify } from 'node:util'
import rpio from 'rpio'
import { Subject, skipUntil, throttleTime, timer } from 'rxjs'
import { Config } from '../config/config.entity'
import { EVENT_GOAL } from '../event-emitter/constants'
import { LoggerService } from '../logger/logger.service'
import { Team } from '../teams/team.entity'
import { TeamsService } from '../teams/teams.service'

const exec = promisify(execCB)

const wait = (milliseconds: number) =>
    new Promise((resolve) => setTimeout(resolve, milliseconds))

@Injectable()
export class DriverService {
    private goalPinPoll = new Subject<string>()
    private goalPinRest = 400 // milliseconds
    private displayPort: FileHandle | null = null

    constructor(
        private readonly config: ConfigService<Config, true>,
        private readonly eventEmitter: EventEmitter2,
        private readonly logger: LoggerService,
        private readonly teams: TeamsService,
    ) {
        this.logger.setup(this.constructor.name)
    }

    async setup() {
        this.logger.debug('setup')

        rpio.on('warn', (message) => this.logger.warn(message))
        rpio.init()

        await this.setupDisplay()
        this.setupGoals()
    }

    async setupDisplay() {
        this.logger.debug('setupDisplay')

        const displayFQBN =
            this.config.get<Config['displayFQBN']>('displayFQBN')

        const { stdout: output, stderr: error } = await exec(
            `arduino-cli board list | grep --max-count 1 '${displayFQBN}' | cut -d ' ' -f 1`,
        )

        if (error !== '') {
            throw new Error(`failed to find a display: ${error}`)
        }

        if (output === '') {
            throw new Error(`no display found with fqbn "${displayFQBN}"`)
        }

        const displayPort = output.trim()
        this.logger.debug(`found display at "${displayPort}"`)
        this.displayPort = await open(displayPort, 'r+')

        // wait for the display to send
        // a byte to signal being ready
        await this.displayPort.read()
    }

    setupGoals() {
        this.logger.debug('setupGoals')
        this.teams.getTeams().forEach((team) => this.setupGoal(team))

        const subscriber = (teamName: string) =>
            this.eventEmitter.emit(EVENT_GOAL, teamName)

        this.goalPinPoll
            .asObservable()
            .pipe(
                // ignore signals immediatly after setup
                skipUntil(timer(this.goalPinRest)),

                // ignore signals immediatly after one is detected
                throttleTime(this.goalPinRest),
            )
            .subscribe(subscriber)
    }

    setupGoal(team: Team) {
        this.logger.debug(`setupGoal ${team}`)
        const callback = () => this.goalPinPoll.next(team.name)

        rpio.open(team.rivalGoalPin, rpio.INPUT, rpio.PULL_UP)
        rpio.poll(team.rivalGoalPin, callback, rpio.POLL_LOW)
    }

    async display(frame: Uint8Array) {
        if (this.displayPort === null) {
            throw new Error('dropping frame, display port is not open')
        }

        await this.displayPort.write(frame)
    }

    async teardown() {
        this.logger.debug('teardown')
        await this.teardownDisplay()
        this.teardownGoals()
        rpio.exit()
    }

    async teardownDisplay() {
        this.logger.debug('teardownDisplay')

        if (this.displayPort === null) {
            return
        }

        await this.display(new Uint8Array(160))
        await wait(200)
        await this.displayPort.close()
    }

    teardownGoals() {
        this.logger.debug('teardownGoals')
        this.teams.getTeams().forEach((team) => this.teardownGoal(team))

        this.goalPinPoll.complete()
        this.goalPinPoll.unsubscribe()
    }

    teardownGoal(team: Team) {
        this.logger.debug(`teardownGoal ${team}`)
        rpio.poll(team.rivalGoalPin, null)
        rpio.close(team.rivalGoalPin)
    }
}
