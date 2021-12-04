import { Module } from '@nestjs/common'
import { LoggerModule } from '../logger/logger.module'
import { StoreModule } from '../store/store.module'
import { TeamsController } from './teams.controller'
import { TeamsService } from './teams.service'

@Module({
    imports: [LoggerModule, StoreModule],
    controllers: [TeamsController],
    providers: [TeamsService],
    exports: [TeamsService],
})
export class TeamsModule {}
