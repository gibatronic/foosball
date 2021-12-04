jest.mock('../source/logger/logger.service')

import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from '../source/app.module'
import { DATA } from '../source/store/data.provider'

export async function createAppTestingModule() {
    const data = new Map<string, unknown>()

    const module: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
    })
        .overrideProvider(DATA)
        .useValue(data)
        .compile()

    const app = module.createNestApplication()

    return { app, data, module }
}
