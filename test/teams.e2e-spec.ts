import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import {
    createAppTestingModule,
    createFakeTeam,
} from './create-app-testing-module'

describe('TeamsController (e2e)', () => {
    let app: INestApplication
    let data: Map<string, unknown>

    beforeAll(async () => {
        ;({ app, data } = await createAppTestingModule())

        await app.init()
    })

    beforeEach(() => {
        data.clear()
    })

    afterAll(async () => {
        await app.close()
    })

    it('GET /api/teams', () => {
        const teamA = createFakeTeam({ name: 'team-a' })
        const teamB = createFakeTeam({ name: 'team-b' })

        data.set(`team:${teamA.name}`, teamA)
        data.set(`team:${teamB.name}`, teamB)

        return request(app.getHttpServer())
            .get('/api/teams')
            .expect(200)
            .expect([
                { name: teamA.name, points: teamA.points },
                { name: teamB.name, points: teamB.points },
            ])
    })

    it('GET /api/teams/{name} 200', () => {
        const team = createFakeTeam()
        data.set(`team:${team.name}`, team)

        return request(app.getHttpServer())
            .get(`/api/teams/${team.name}`)
            .expect(200)
            .expect({ name: team.name, points: team.points })
    })

    it('GET /api/teams/{name} 404', () => {
        return request(app.getHttpServer()).get('/api/teams/orange').expect(404)
    })

    it('POST /api/teams/{name}/points 200', () => {
        const team = createFakeTeam({ points: 4 })
        data.set(`team:${team.name}`, team)

        return request(app.getHttpServer())
            .post(`/api/teams/${team.name}/points`)
            .expect(200)
            .expect({ name: team.name, points: 5 })
    })

    it('DELETE /api/teams/{name}/points 200', () => {
        const team = createFakeTeam({ points: 4 })
        data.set(`team:${team.name}`, team)

        return request(app.getHttpServer())
            .delete(`/api/teams/${team.name}/points`)
            .expect(200)
            .expect({ name: team.name, points: 3 })
    })

    it('DELETE /api/teams/{name}/points 200', () => {
        const team = createFakeTeam({ points: 0 })
        data.set(`team:${team.name}`, team)

        return request(app.getHttpServer())
            .delete(`/api/teams/${team.name}/points`)
            .expect(200)
            .expect({ name: team.name, points: 0 })
    })

    it('POST /api/teams/{name}/points/reset 200', () => {
        const team = createFakeTeam({ points: 4 })
        data.set(`team:${team.name}`, team)

        return request(app.getHttpServer())
            .post(`/api/teams/${team.name}/points/reset`)
            .expect(200)
            .expect({ name: team.name, points: 0 })
    })
})
