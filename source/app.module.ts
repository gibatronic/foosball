import { Module } from '@nestjs/common'
import { AppService } from './app.service'
import { ConfigModule } from './config/config.module'
import { DriverModule } from './driver/driver.module'
import { ExceptionsProvider } from './exceptions/exceptions.provider'
import { LogModule } from './log/log.module'
import { LoggerModule } from './logger/logger.module'
import { ScoreboardModule } from './scoreboard/scoreboard.module'
import { StoreModule } from './store/store.module'
import { TeamsModule } from './teams/teams.module'

@Module({
    imports: [
        ConfigModule,
        DriverModule,
        LoggerModule,
        LogModule,
        ScoreboardModule,
        StoreModule,
        TeamsModule,
    ],
    providers: [ExceptionsProvider, AppService],
})
export class AppModule {}
