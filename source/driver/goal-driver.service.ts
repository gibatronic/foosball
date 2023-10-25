import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import rpio from 'rpio'
import { Subject, skipUntil, throttleTime, timer } from 'rxjs'
import { EVENT_GOAL } from '../event-emitter/constants'
import { LoggerService } from '../logger/logger.service'
import { Team } from '../teams/team.entity'
import { TeamsService } from '../teams/teams.service'

@Injectable()
export class GoalDriverService {
    private goalPinPoll = new Subject<string>()
    private goalPinRest = 400 // milliseconds

    constructor(
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

    async teardown() {
        this.logger.debug('teardown')
        this.teams.getTeams().forEach((team) => this.teardownGoal(team))
        this.goalPinPoll.complete()
        this.goalPinPoll.unsubscribe()
        rpio.exit()
    }

    teardownGoal(team: Team) {
        this.logger.debug(`teardownGoal ${team}`)
        rpio.poll(team.rivalGoalPin, null)
        rpio.close(team.rivalGoalPin)
    }
}
