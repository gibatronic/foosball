jest.mock('@nestjs/config')
jest.mock('../logger/logger.service')
jest.mock('../scoreboard/scoreboard.service')
jest.mock('../store/store.service')

import { ConfigService } from '@nestjs/config'
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
                ConfigService,
                DriverService,
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
