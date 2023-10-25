jest.mock('@nestjs/config')
jest.mock('../logger/logger.service')

import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { LoggerService } from '../logger/logger.service'
import { DisplayDriverService } from './display-driver.service'

describe('DisplayDriverService', () => {
    let service: DisplayDriverService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ConfigService, DisplayDriverService, LoggerService],
        }).compile()

        service = module.get<DisplayDriverService>(DisplayDriverService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})
