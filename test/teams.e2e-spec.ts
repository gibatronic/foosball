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
        return request(app.getHttpServer())
            .get('/api/teams')
            .expect(200)
            .expect([
                {
                    color: 'crimson',
                    points: 7,
                },
                {
                    color: 'moccasin',
                    points: 8,
                },
            ])
    })

    it('GET /api/teams/{color} 200', () => {
        data.set('team:orange', {
            color: 'orange',
            points: 42,
        })

        return request(app.getHttpServer())
            .get('/api/teams/orange')
            .expect(200)
            .expect({
                color: 'orange',
                points: 42,
            })
    })

    it('GET /api/teams/{color} 404', () => {
        return request(app.getHttpServer()).get('/api/teams/orange').expect(404)
    })

    it('GET /api/teams/{color}/points 200', () => {
        data.set('team:green', {
            color: 'green',
            points: 69,
        })

        return request(app.getHttpServer())
            .get('/api/teams/green/points')
            .expect(200)
            .expect('69')
    })

    it('GET /api/teams/{color}/points 404', () => {
        return request(app.getHttpServer())
            .get('/api/teams/green/points')
            .expect(404)
    })

    it('POST /api/teams/{color}/points 200', () => {
        data.set('team:violet', {
            color: 'violet',
            points: 11,
        })

        return request(app.getHttpServer())
            .post('/api/teams/violet/points')
            .expect(200)
            .expect('12')
    })
})
