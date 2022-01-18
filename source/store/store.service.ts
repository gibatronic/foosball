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

    get<V>(key: string) {
        this.logger.debug(`get '${key}'`)
        return (this.data.get(key) as V) ?? null
    }

    set(key: string, value: unknown) {
        this.logger.debug(`set '${key}' ${value}`)
        this.data.set(key, value)
    }

    list<V>(keyPrefix: string) {
        const values = []

        for (const [key, value] of this.data) {
            if (key.startsWith(keyPrefix)) {
                values.push(value as V)
            }
        }

        return values
    }
}
