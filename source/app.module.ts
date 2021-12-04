import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import configuration from './config/configuration'
import { LoggerModule } from './logger/logger.module'
import { StoreModule } from './store/store.module'
import { TeamsModule } from './teams/teams.module'

@Module({
    imports: [
        ConfigModule.forRoot({ cache: true, load: [configuration] }),
        LoggerModule,
        StoreModule,
        TeamsModule,
    ],
})
export class AppModule {}
