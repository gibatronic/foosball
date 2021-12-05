import { ConsoleLogger, Injectable, Scope } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Config } from '../config/config.entity'

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger {
    constructor(private readonly config: ConfigService<Config, true>) {
        super()
    }

    setup(context: string) {
        this.setContext(context)
        this.setLogLevels(this.config.get('logLevels'))
    }
}
