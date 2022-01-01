jest.mock('../source/logger/logger.service')

import { NestExpressApplication } from '@nestjs/platform-express'
import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from '../source/app.module'
import { AppService } from '../source/app.service'
import { DATA } from '../source/store/data.provider'

export async function createAppTestingModule() {
    const data = new Map<string, unknown>()

    const module: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
    })
        .overrideProvider(DATA)
        .useValue(data)
        .compile()

    const app = module.createNestApplication<NestExpressApplication>()
    await app.get(AppService).bootstrap(app)
    return { app, data, module }
}
