import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import dotenv from 'dotenv'
import { AppModule } from './app.module'
import { LoggerService } from './logger/logger.service'
import { TeamsService } from './teams/teams.service'

dotenv.config()

async function main() {
    const { app, logger } = await createApp()

    setUpSwagger(app)
    setUpTeams(app)

    try {
        await app.listen(process.env.PORT ?? 0)
    } catch (exception) {
        logger.error(exception)
        process.exitCode = 1
        return
    }

    await setUpApp(app, logger)
}

async function createApp() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        bufferLogs: true,
    })

    const logger = await app.resolve(LoggerService)
    logger.setContext('main')
    // @todo logger.setLogLevels(???)

    app.disable('x-powered-by')
    app.useGlobalPipes(
        new ValidationPipe({
            forbidNonWhitelisted: true,
            forbidUnknownValues: true,
            transform: true,
            transformOptions: {
                exposeDefaultValues: true,
            },
        }),
    )
    app.useLogger(logger)

    return { app, logger }
}

async function setUpApp(app: NestExpressApplication, logger: LoggerService) {
    logger.log(`listening at ${await app.getUrl()}`)

    process.on('SIGTERM', async () => {
        logger.log('got termination signal, gracefully shutting down...')

        await app.close()
    })

    process.on('warning', (warning) => logger.warn(warning))
}

function setUpSwagger(app: NestExpressApplication) {
    const documentBuilder = new DocumentBuilder()
        .setTitle('Foosball API')
        .setVersion(process.env.npm_package_version ?? '')
        .build()

    const document = SwaggerModule.createDocument(app, documentBuilder)

    SwaggerModule.setup('api', app, document, {
        customSiteTitle: 'Foosball API',
        swaggerOptions: {
            deepLinking: false,
            defaultModelRendering: 'model',
            defaultModelsExpandDepth: -1,
        },
    })
}

function setUpTeams(app: NestExpressApplication) {
    const teamsService = app.get(TeamsService)

    teamsService.addTeam({
        color: 'blue',
        goals: 0,
    })

    teamsService.addTeam({
        color: 'red',
        goals: 0,
    })
}

main()
