jest.mock('../logger/logger.service')
jest.mock('../store/store.service')

import { Test, TestingModule } from '@nestjs/testing'
import { LoggerService } from '../logger/logger.service'
import { StoreService } from '../store/store.service'
import { TeamsController } from './teams.controller'
import { TeamsService } from './teams.service'

describe('TeamsController', () => {
    let controller: TeamsController

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TeamsController],
            providers: [LoggerService, StoreService, TeamsService],
        }).compile()

        controller = module.get<TeamsController>(TeamsController)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })
})
