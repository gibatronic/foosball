jest.mock('@nestjs/config')
jest.mock('../logger/logger.service')

import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { LoggerService } from '../logger/logger.service'
import { LogService } from './log.service'

describe('LogService', () => {
    let service: LogService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ConfigService, LoggerService, LogService],
        }).compile()

        service = module.get<LogService>(LogService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})
