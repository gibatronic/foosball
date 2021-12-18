import { Module } from '@nestjs/common'
import { LoggerModule } from '../logger/logger.module'
import { TeamsModule } from '../teams/teams.module'
import { DriverService } from './driver.service'

@Module({
    imports: [LoggerModule, TeamsModule],
    providers: [DriverService],
    exports: [DriverService],
})
export class DriverModule {}
