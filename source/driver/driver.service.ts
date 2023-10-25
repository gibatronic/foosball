import { Injectable } from '@nestjs/common'
import { LoggerService } from '../logger/logger.service'
import { DisplayDriverService } from './display-driver.service'
import { GoalDriverService } from './goal-driver.service'

@Injectable()
export class DriverService {
    constructor(
        private readonly displayDriver: DisplayDriverService,
        private readonly goalDriver: GoalDriverService,
        private readonly logger: LoggerService,
    ) {
        this.logger.setup(this.constructor.name)
    }

    async setup() {
        this.logger.debug('setup')

        await Promise.allSettled([
            this.displayDriver.setup(),
            this.goalDriver.setup(),
        ])
    }

    async teardown() {
        this.logger.debug('teardown')

        await Promise.allSettled([
            this.displayDriver.teardown(),
            this.goalDriver.teardown(),
        ])
    }
}
