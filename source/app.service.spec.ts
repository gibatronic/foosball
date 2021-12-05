import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { AppService } from './app.service'
import { LoggerModule } from './logger/logger.module'
import { StoreModule } from './store/store.module'
import { TeamsModule } from './teams/teams.module'

describe('AppService', () => {
    let service: AppService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule, LoggerModule, StoreModule, TeamsModule],
            providers: [AppService],
        }).compile()

        service = module.get<AppService>(AppService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})
