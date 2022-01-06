import { Injectable } from '@nestjs/common'
import rpio from 'rpio'
import { LoggerService } from '../logger/logger.service'
import { TeamsService } from '../teams/teams.service'

@Injectable()
export class DriverService {
    constructor(
        private readonly logger: LoggerService,
        private readonly teams: TeamsService,
    ) {
        this.logger.setup(this.constructor.name)
    }

    setup() {
        this.logger.debug('setup')
        rpio.on('warn', (message) => this.logger.warn(message))

        rpio.init({
            close_on_exit: true,
            gpiomem: true,
            mapping: 'physical',
            mock: 'raspi-3',
        })

        this.setupGoals()
    }

    setupGoals() {
        this.logger.debug('setupGoals')
        const teams = this.teams.getTeams()

        for (const team of teams) {
            rpio.open(team.pin, rpio.INPUT, rpio.PULL_UP)

            rpio.poll(
                team.pin,
                () => this.logger.debug(`${team.pin} ${team.color}`),
                rpio.POLL_HIGH,
            )
        }
    }

    teardown() {
        this.logger.debug('teardown')
        this.teardownGoals()
        rpio.exit()
    }

    teardownGoals() {
        this.logger.debug('teardownGoals')
        const teams = this.teams.getTeams()

        for (const team of teams) {
            rpio.poll(team.pin, null)
            rpio.close(team.pin)
        }
    }
}
