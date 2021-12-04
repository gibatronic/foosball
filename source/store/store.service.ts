import { Inject, Injectable } from '@nestjs/common'
import { LoggerService } from '../logger/logger.service'
import { DATA } from './data.provider'

@Injectable()
export class StoreService {
    constructor(
        private readonly logger: LoggerService,

        @Inject(DATA)
        private readonly data: Map<string, unknown>,
    ) {
        this.logger.setContext(this.constructor.name)
    }

    public get<V>(key: string) {
        this.logger.debug(`get '${key}'`)
        return (this.data.get(key) as V) ?? null
    }

    public set(key: string, value: unknown) {
        this.logger.debug(`set '${key}' ${value}`)
        this.data.set(key, value)
    }

    public list<V>(prefix: string) {
        const values = [] as V[]

        for (const [key, value] of this.data) {
            if (key.startsWith(prefix)) {
                values.push(value as V)
            }
        }

        return values
    }
}
