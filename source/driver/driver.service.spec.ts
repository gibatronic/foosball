jest.mock('@nestjs/config')
jest.mock('../logger/logger.service')
jest.mock('./display-driver.service')
jest.mock('./goal-driver.service')

import { Test, TestingModule } from '@nestjs/testing'
import { LoggerService } from '../logger/logger.service'
import { DisplayDriverService } from './display-driver.service'
import { DriverService } from './driver.service'
import { GoalDriverService } from './goal-driver.service'

describe('DriverService', () => {
    let service: DriverService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DisplayDriverService,
                DriverService,
                GoalDriverService,
                LoggerService,
            ],
        }).compile()

        service = module.get<DriverService>(DriverService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})
