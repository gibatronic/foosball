import { Provider } from '@nestjs/common'
import { DATA_PROVIDER } from './constants'

export const DataProvider = {
    provide: DATA_PROVIDER,
    useValue: new Map<string, unknown>(),
} as Provider<Map<string, unknown>>
