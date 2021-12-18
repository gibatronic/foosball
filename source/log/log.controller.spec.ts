jest.mock('@nestjs/config')

import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { LogController } from './log.controller'

describe('LogController', () => {
    let controller: LogController

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LogController],
            providers: [ConfigService],
        }).compile()

        controller = module.get<LogController>(LogController)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })
})
