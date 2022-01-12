jest.mock('../logger/logger.service')

import { Test, TestingModule } from '@nestjs/testing'
import { LoggerService } from '../logger/logger.service'
import { DATA_PROVIDER } from './constants'
import { StoreService } from './store.service'

describe('StoreService', () => {
    let data: Map<string, unknown>
    let service: StoreService

    beforeEach(async () => {
        data = new Map<string, unknown>()

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                { provide: DATA_PROVIDER, useValue: data },
                LoggerService,
                StoreService,
            ],
        }).compile()

        service = module.get<StoreService>(StoreService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    it('should get a stored value', () => {
        data.set('key', 'value')
        expect(service.get('key')).toBe('value')
    })

    it('should get null for unkown key', () => {
        expect(service.get('key')).toBe(null)
    })

    it('should set the given value', () => {
        service.set('key', 'value')
        expect(data.get('key')).toBe('value')
    })
})
