jest.mock('../logger/logger.service')
jest.mock('../teams/teams.service')

import { EventEmitter2 } from '@nestjs/event-emitter'
import { Test, TestingModule } from '@nestjs/testing'
import { LoggerService } from '../logger/logger.service'
import { TeamsService } from '../teams/teams.service'
import { DriverService } from './driver.service'

describe('DriverService', () => {
    let service: DriverService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DriverService,
                EventEmitter2,
                LoggerService,
                TeamsService,
            ],
        }).compile()

        service = module.get<DriverService>(DriverService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})
