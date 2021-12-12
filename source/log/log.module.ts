import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { LogController } from './log.controller'

@Module({
    imports: [ConfigModule],
    controllers: [LogController],
})
export class LogModule {}
