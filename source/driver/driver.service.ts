import { Injectable } from '@nestjs/common'
import rpio from 'rpio'
import { Observable, Subscriber, Subscription, throttleTime } from 'rxjs'
import { LoggerService } from '../logger/logger.service'
import { Team } from '../teams/team.entity'
import { TeamsService } from '../teams/teams.service'

@Injectable()
export class DriverService {
    private subscriptions: Subscription[] = []

    constructor(
        private readonly logger: LoggerService,
        private readonly teams: TeamsService,
    ) {
        this.logger.setup(this.constructor.name)
    }

    setup() {
        this.logger.debug('setup')
        rpio.on('warn', (message) => this.logger.warn(message))
        rpio.init()
        this.teams.getTeams().forEach((team) => this.setupGoal(team))
    }

    setupGoal(team: Team) {
        this.logger.debug(`watchGoals ${team}`)

        const producer = (observer: Subscriber<Team>) => {
            rpio.open(team.rivalGoalPin, rpio.INPUT, rpio.PULL_UP)

            rpio.poll(
                team.rivalGoalPin,
                () => observer.next(team),
                rpio.POLL_LOW,
            )
        }

        const observable = new Observable<Team>(producer).pipe(
            throttleTime(200),
        )

        const subscription = observable.subscribe((team) =>
            this.teams.incrementTeamPoint(team.color),
        )

        this.subscriptions.push(subscription)
    }

    teardown() {
        this.logger.debug('teardown')
        this.subscriptions.forEach((subscription) => subscription.unsubscribe())
        this.teams.getTeams().forEach((team) => this.teardownGoal(team))
        rpio.exit()
    }

    teardownGoal(team: Team) {
        this.logger.debug(`teardownGoal ${team}`)
        rpio.poll(team.rivalGoalPin, null)
        rpio.close(team.rivalGoalPin)
    }
}
