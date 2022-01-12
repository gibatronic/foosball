import { Inject, Injectable } from '@nestjs/common'
import { LoggerService } from '../logger/logger.service'
import { DATA_PROVIDER } from './constants'

@Injectable()
export class StoreService {
    constructor(
        private readonly logger: LoggerService,

        @Inject(DATA_PROVIDER)
        private readonly data: Map<string, unknown>,
    ) {
        this.logger.setup(this.constructor.name)
    }

    public get<V>(key: string) {
        this.logger.debug(`get '${key}'`)
        return (this.data.get(key) as V) ?? null
    }

    public set(key: string, value: unknown) {
        this.logger.debug(`set '${key}' ${value}`)
        this.data.set(key, value)
    }
}
