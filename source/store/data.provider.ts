import { Provider } from '@nestjs/common'

export const DATA = Symbol('DATA')

export const DataProvider = {
    provide: DATA,
    useValue: new Map<string, unknown>(),
} as Provider<Map<string, unknown>>
