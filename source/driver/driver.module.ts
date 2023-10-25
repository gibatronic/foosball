import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { LoggerModule } from '../logger/logger.module'
import { TeamsModule } from '../teams/teams.module'
import { DisplayDriverService } from './display-driver.service'
import { DriverService } from './driver.service'
import { GoalDriverService } from './goal-driver.service'

@Module({
    imports: [ConfigModule, LoggerModule, TeamsModule],
    providers: [DriverService, DisplayDriverService, GoalDriverService],
    exports: [DriverService, DisplayDriverService, GoalDriverService],
})
export class DriverModule {}
