import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { LoggerModule } from '../logger/logger.module'
import { LogController } from './log.controller'
import { LogService } from './log.service'

@Module({
    imports: [ConfigModule, LoggerModule],
    controllers: [LogController],
    providers: [LogService],
})
export class LogModule {}
