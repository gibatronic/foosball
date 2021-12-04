import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { createAppTestingModule } from './create-app-testing-module'

describe('TeamsController (e2e)', () => {
    let app: INestApplication
    let data: Map<string, unknown>

    beforeEach(async () => {
        ;({ app, data } = await createAppTestingModule())

        await app.init()
    })

    afterAll(async () => {
        await app.close()
    })

    it('GET /api/teams', () => {
        data.set('team:cyan', {
            color: 'cyan',
            goals: 4,
        })

        data.set('team:yellow', {
            color: 'yellow',
            goals: 2,
        })

        return request(app.getHttpServer())
            .get('/api/teams')
            .expect(200)
            .expect([
                {
                    color: 'cyan',
                    goals: 4,
                },
                {
                    color: 'yellow',
                    goals: 2,
                },
            ])
    })

    it('GET /api/teams/{color} 200', () => {
        data.set('team:orange', {
            color: 'orange',
            goals: 42,
        })

        return request(app.getHttpServer())
            .get('/api/teams/orange')
            .expect(200)
            .expect({
                color: 'orange',
                goals: 42,
            })
    })

    it('GET /api/teams/{color} 404', () => {
        return request(app.getHttpServer()).get('/api/teams/orange').expect(404)
    })

    it('GET /api/teams/{color}/goals 200', () => {
        data.set('team:green', {
            color: 'green',
            goals: 69,
        })

        return request(app.getHttpServer())
            .get('/api/teams/green/goals')
            .expect(200)
            .expect('69')
    })

    it('GET /api/teams/{color}/goals 404', () => {
        return request(app.getHttpServer())
            .get('/api/teams/green/goals')
            .expect(404)
    })

    it('POST /api/teams/{color}/goals 200', () => {
        data.set('team:violet', {
            color: 'violet',
            goals: 11,
        })

        return request(app.getHttpServer())
            .post('/api/teams/violet/goals')
            .expect(200)
            .expect('12')
    })
})
