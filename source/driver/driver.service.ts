import { Injectable } from '@nestjs/common'
import { LoggerService } from '../logger/logger.service'
import { TeamsService } from '../teams/teams.service'

@Injectable()
export class DriverService {
    constructor(
        private readonly logger: LoggerService,
        public readonly teams: TeamsService,
    ) {
        this.logger.setup(this.constructor.name)
    }

    setUp() {
        this.logger.debug('setUp')
        this.setUpGoals()
    }

    setUpGoals() {
        this.logger.debug('setUpGoals')
    }
}
