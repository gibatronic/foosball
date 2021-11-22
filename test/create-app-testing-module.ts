import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from '../source/app.module'

export async function createAppTestingModule() {
    const module: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
    }).compile()

    const app = module.createNestApplication()

    return { app, module }
}
