jest.mock('./scoreboard.service')

import { Test, TestingModule } from '@nestjs/testing'
import { ScoreboardController } from './scoreboard.controller'
import { ScoreboardService } from './scoreboard.service'

describe('ScoreboardController', () => {
    let controller: ScoreboardController

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ScoreboardController],
            providers: [ScoreboardService],
        }).compile()

        controller = module.get<ScoreboardController>(ScoreboardController)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })
})
