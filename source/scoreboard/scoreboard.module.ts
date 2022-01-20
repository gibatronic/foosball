import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { LoggerModule } from '../logger/logger.module'
import { TeamsModule } from '../teams/teams.module'
import { ScoreboardController } from './scoreboard.controller'
import { ScoreboardService } from './scoreboard.service'

@Module({
    imports: [ConfigModule, LoggerModule, TeamsModule],
    controllers: [ScoreboardController],
    providers: [ScoreboardService],
    exports: [ScoreboardService],
})
export class ScoreboardModule {}
