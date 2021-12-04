import { Module } from '@nestjs/common'
import { LoggerModule } from '../logger/logger.module'
import { DataProvider } from './data.provider'
import { StoreService } from './store.service'

@Module({
    imports: [LoggerModule],
    providers: [DataProvider, StoreService],
    exports: [StoreService],
})
export class StoreModule {}
