import { Module } from '@nestjs/common'
import { AppService } from './app.service'
import { ConfigModule } from './config/config.module'
import { DriverModule } from './driver/driver.module'
import { EventEmitterModule } from './event-emitter/event-emitter.module'
import { ExceptionsProvider } from './exceptions/exceptions.provider'
import { LoggerModule } from './logger/logger.module'
import { ScoreboardModule } from './scoreboard/scoreboard.module'
import { StoreModule } from './store/store.module'
import { TeamsModule } from './teams/teams.module'

@Module({
    imports: [
        ConfigModule,
        DriverModule,
        EventEmitterModule,
        LoggerModule,
        ScoreboardModule,
        StoreModule,
        TeamsModule,
    ],
    providers: [AppService, ExceptionsProvider],
})
export class AppModule {}
