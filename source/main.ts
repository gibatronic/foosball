import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { Configuration } from './config/configuration'
import { LoggerService } from './logger/logger.service'
import { TeamsService } from './teams/teams.service'

async function createApp() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        bufferLogs: true,
    })

    const config = app.get<ConfigService<Configuration, true>>(ConfigService)
    const logger = await app.resolve(LoggerService)

    logger.setContext('main')
    logger.setLogLevels(config.get('logLevels'))

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

    return { app, config, logger }
}

async function main() {
    const { app, config, logger } = await createApp()

    setUpSwagger(app)
    setUpTeams(app, config)
    await setUpApp(app, config, logger)
}

async function setUpApp(
    app: NestExpressApplication,
    config: ConfigService<Configuration, true>,
    logger: LoggerService,
) {
    await app.listen(config.get('port'))
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

function setUpTeams(
    app: NestExpressApplication,
    config: ConfigService<Configuration, true>,
) {
    const teams = app.get(TeamsService)
    teams.addTeams(config.get('teams'))
}

main()
