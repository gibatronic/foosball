import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { createAppTestingModule } from './create-app-testing-module'

describe('TeamsController (e2e)', () => {
    let app: INestApplication

    beforeEach(async () => {
        ;({ app } = await createAppTestingModule())

        await app.init()
    })

    afterAll(async () => {
        await app.close()
    })

    it('GET /api/log', () => {
        return request(app.getHttpServer())
            .get('/api/log')
            .expect(200)
            .expect('content-type', /text/)
    })

    it('GET /log', () => {
        return request(app.getHttpServer())
            .get('/log')
            .expect(200)
            .expect('content-type', /html/)
    })
})
