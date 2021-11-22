import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { createAppTestingModule } from './create-app-testing-module'

describe('AppController (e2e)', () => {
    let app: INestApplication

    beforeEach(async () => {
        ;({ app } = await createAppTestingModule())

        await app.init()
    })

    afterAll(async () => {
        await app.close()
    })

    it('GET /', () => {
        return request(app.getHttpServer()).get('/').expect(404)
    })
})
