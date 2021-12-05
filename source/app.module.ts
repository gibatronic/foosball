import { Module } from '@nestjs/common'
import { AppService } from './app.service'
import { ConfigModule } from './config/config.module'
import { LoggerModule } from './logger/logger.module'
import { StoreModule } from './store/store.module'
import { TeamsModule } from './teams/teams.module'

@Module({
    imports: [ConfigModule, LoggerModule, StoreModule, TeamsModule],
    providers: [AppService],
})
export class AppModule {}
