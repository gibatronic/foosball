jest.mock('@nestjs/config')
jest.mock('../driver/display-driver.service')
jest.mock('../logger/logger.service')
jest.mock('../teams/teams.service')

import { ConfigService } from '@nestjs/config'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Test, TestingModule } from '@nestjs/testing'
import { DisplayDriverService } from '../driver/display-driver.service'
import { LoggerService } from '../logger/logger.service'
import { TeamsService } from '../teams/teams.service'
import { ScoreboardService } from './scoreboard.service'

describe('ScoreboardService', () => {
    let service: ScoreboardService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ConfigService,
                DisplayDriverService,
                EventEmitter2,
                LoggerService,
                ScoreboardService,
                TeamsService,
            ],
        }).compile()

        service = module.get<ScoreboardService>(ScoreboardService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})
