jest.mock('@nestjs/config')
jest.mock('./driver/driver.service')
jest.mock('./logger/logger.service')
jest.mock('./scoreboard/scoreboard.service')
jest.mock('./teams/teams.service')

import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { AppService } from './app.service'
import { DriverService } from './driver/driver.service'
import { LoggerService } from './logger/logger.service'
import { ScoreboardService } from './scoreboard/scoreboard.service'
import { TeamsService } from './teams/teams.service'

describe('AppService', () => {
    let service: AppService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AppService,
                ConfigService,
                DriverService,
                LoggerService,
                ScoreboardService,
                TeamsService,
            ],
        }).compile()

        service = module.get<AppService>(AppService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})
