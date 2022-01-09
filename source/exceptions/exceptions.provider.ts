import { APP_FILTER } from '@nestjs/core'
import { ExceptionsFilter } from './exceptions.filter'

export const ExceptionsProvider = {
    provide: APP_FILTER,
    useClass: ExceptionsFilter,
}
