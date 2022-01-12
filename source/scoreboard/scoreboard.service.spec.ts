jest.mock('@nestjs/config')
jest.mock('../logger/logger.service')
jest.mock('../teams/teams.service')

import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { LoggerService } from '../logger/logger.service'
import { TeamsService } from '../teams/teams.service'
import { ScoreboardService } from './scoreboard.service'

describe('ScoreboardService', () => {
    let service: ScoreboardService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ConfigService,
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
