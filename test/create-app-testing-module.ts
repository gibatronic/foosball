jest.mock('rpio')
jest.mock('../source/logger/logger.service')
jest.mock('../source/driver/display-driver.service.ts')

import { NestExpressApplication } from '@nestjs/platform-express'
import { Test, TestingModule } from '@nestjs/testing'
import { plainToInstance } from 'class-transformer'
import { AppModule } from '../source/app.module'
import { AppService } from '../source/app.service'
import { DATA_PROVIDER } from '../source/store/constants'
import { Team } from '../source/teams/team.entity'
import { TransformerGroups } from '../source/transformer-groups.enum'

export async function createAppTestingModule() {
    const data = new Map<string, unknown>()

    const module: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
    })
        .overrideProvider(DATA_PROVIDER)
        .useValue(data)
        .compile()

    const app = module.createNestApplication<NestExpressApplication>()
    await app.get(AppService).bootstrap(app)
    return { app, data, module }
}

export function createFakeTeam(plain: Partial<Team> = {}) {
    const team = plainToInstance(
        Team,
        {
            name: 'team',
            points: 4,
            rivalGoalPin: 8,
            color: [15, 16, 23],
            ...plain,
        } as Team,
        {
            groups: [TransformerGroups.INTERNAL],
        },
    )

    return team
}
