jest.mock('../logger/logger.service')
jest.mock('../scoreboard/scoreboard.service')
jest.mock('../store/store.service')

import { EventEmitter2 } from '@nestjs/event-emitter'
import { Test, TestingModule } from '@nestjs/testing'
import { DriverService } from '../driver/driver.service'
import { LoggerService } from '../logger/logger.service'
import { ScoreboardService } from '../scoreboard/scoreboard.service'
import { StoreService } from '../store/store.service'
import { TeamsService } from './teams.service'

describe('TeamsService', () => {
    let service: TeamsService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DriverService,
                EventEmitter2,
                LoggerService,
                ScoreboardService,
                StoreService,
                TeamsService,
            ],
        }).compile()

        service = module.get<TeamsService>(TeamsService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})
