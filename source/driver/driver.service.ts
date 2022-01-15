import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import rpio from 'rpio'
import { distinctUntilChanged, Subject, throttleTime } from 'rxjs'
import { EVENT_GOAL } from '../event-emitter/constants'
import { LoggerService } from '../logger/logger.service'
import { Team } from '../teams/team.entity'
import { TeamsService } from '../teams/teams.service'

@Injectable()
export class DriverService {
    private goalPinPoll = new Subject<string>()

    constructor(
        private readonly eventEmitter: EventEmitter2,
        private readonly logger: LoggerService,
        private readonly teams: TeamsService,
    ) {
        this.logger.setup(this.constructor.name)
    }

    setup() {
        this.logger.debug('setup')
        rpio.on('warn', (message) => this.logger.warn(message))
        rpio.init()
        this.setupGoals()
    }

    setupGoals() {
        this.logger.debug(`setupGoals`)
        this.teams.getTeams().forEach((team) => this.setupGoal(team))

        this.goalPinPoll
            .asObservable()
            .pipe(throttleTime(400))
            .subscribe((name: string) =>
                this.eventEmitter.emit(EVENT_GOAL, name),
            )
    }

    setupGoal(team: Team) {
        this.logger.debug(`setupGoal ${team}`)
        const callback = () => this.goalPinPoll.next(team.name)

        rpio.open(team.rivalGoalPin, rpio.INPUT, rpio.PULL_UP)
        rpio.poll(team.rivalGoalPin, callback, rpio.POLL_LOW)
    }

    teardown() {
        this.logger.debug('teardown')
        this.teardownGoals()
        rpio.exit()
    }

    teardownGoals() {
        this.logger.debug(`teardownGoals`)
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
