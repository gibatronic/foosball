jest.mock('@nestjs/config')
jest.mock('../logger/logger.service')
jest.mock('../scoreboard/scoreboard.service')
jest.mock('../store/store.service')

import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { LoggerService } from '../logger/logger.service'
import { ScoreboardService } from '../scoreboard/scoreboard.service'
import { StoreService } from '../store/store.service'
import { TeamsController } from './teams.controller'
import { TeamsService } from './teams.service'

describe('TeamsController', () => {
    let controller: TeamsController

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TeamsController],
            providers: [
                ConfigService,
                LoggerService,
                ScoreboardService,
                StoreService,
                TeamsService,
            ],
        }).compile()

        controller = module.get<TeamsController>(TeamsController)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })
})
