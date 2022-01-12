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
                    name: 'amethyst',
                    color: [155, 89, 182],
                    points: 7,
                },
                {
                    name: 'emerald',
                    color: [46, 204, 113],
                    points: 8,
                },
            ])
    })

    it('GET /api/teams/{name} 200', () => {
        data.set('team:orange', {
            name: 'orange',
            color: '#FFA500',
            points: 42,
        })

        return request(app.getHttpServer())
            .get('/api/teams/orange')
            .expect(200)
            .expect({
                name: 'orange',
                color: '#FFA500',
                points: 42,
            })
    })

    it('GET /api/teams/{name} 404', () => {
        return request(app.getHttpServer()).get('/api/teams/orange').expect(404)
    })

    it('POST /api/teams/{name}/points 200', () => {
        data.set('team:violet', {
            name: 'violet',
            color: '#8F00FF',
            points: 11,
        })

        return request(app.getHttpServer())
            .post('/api/teams/violet/points')
            .expect(200)
            .expect({
                name: 'violet',
                color: '#8F00FF',
                points: 12,
            })
    })

    it('DELETE /api/teams/{name}/points 200', () => {
        data.set('team:violet', {
            name: 'violet',
            color: '#8F00FF',
            points: 11,
        })

        return request(app.getHttpServer())
            .delete('/api/teams/violet/points')
            .expect(200)
            .expect({
                name: 'violet',
                color: '#8F00FF',
                points: 10,
            })
    })

    it('DELETE /api/teams/{name}/points 200', () => {
        data.set('team:olive', {
            name: 'olive',
            color: '#808000',
            points: 0,
        })

        return request(app.getHttpServer())
            .delete('/api/teams/olive/points')
            .expect(200)
            .expect({
                name: 'olive',
                color: '#808000',
                points: 0,
            })
    })

    it('POST /api/teams/{name}/points/reset 200', () => {
        data.set('team:beige', {
            name: 'beige',
            color: '#F5F5DC',
            points: 4,
        })

        return request(app.getHttpServer())
            .post('/api/teams/beige/points/reset')
            .expect(200)
            .expect({
                name: 'beige',
                color: '#F5F5DC',
                points: 0,
            })
    })
})
