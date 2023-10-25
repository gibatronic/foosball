jest.mock('@nestjs/config')
jest.mock('../logger/logger.service')
jest.mock('../scoreboard/scoreboard.service')
jest.mock('../store/store.service')

import { ConfigService } from '@nestjs/config'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Test, TestingModule } from '@nestjs/testing'
import { LoggerService } from '../logger/logger.service'
import { StoreService } from '../store/store.service'
import { TeamsService } from './teams.service'

describe('TeamsService', () => {
    let service: TeamsService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ConfigService,
                EventEmitter2,
                LoggerService,
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
