jest.mock('@nestjs/config')
jest.mock('../logger/logger.service')
jest.mock('../teams/teams.service')

import { ConfigService } from '@nestjs/config'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Test, TestingModule } from '@nestjs/testing'
import { LoggerService } from '../logger/logger.service'
import { TeamsService } from '../teams/teams.service'
import { GoalDriverService } from './goal-driver.service'

describe('GoalDriverService', () => {
    let service: GoalDriverService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ConfigService,
                EventEmitter2,
                GoalDriverService,
                LoggerService,
                TeamsService,
            ],
        }).compile()

        service = module.get<GoalDriverService>(GoalDriverService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})
