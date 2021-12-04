import { Module } from '@nestjs/common'
import { LoggerModule } from './logger/logger.module'
import { StoreModule } from './store/store.module'
import { TeamsModule } from './teams/teams.module'

@Module({
    imports: [LoggerModule, StoreModule, TeamsModule],
})
export class AppModule {}
