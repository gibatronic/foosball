import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import dotenv from 'dotenv'
import { AppModule } from './app.module'
import { LoggerService } from './logger/logger.service'

dotenv.config()

async function bootstrap() {
    const { app, logger } = await createApp()

    try {
        await app.listen(process.env.PORT ?? 0)
    } catch (exception) {
        logger.error(exception)
        process.exitCode = 1
        return
    }

    await setupApp(app, logger)
}

async function createApp() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        bufferLogs: true,
    })

    const logger = app.get(LoggerService)
    logger.setContext('main')

    app.disable('x-powered-by')
    app.useLogger(logger)

    return { app, logger }
}

async function setupApp(app: NestExpressApplication, logger: LoggerService) {
    logger.log(`listening at ${await app.getUrl()}`)

    process.on('SIGTERM', async () => {
        logger.log('got termination signal, gracefully shutting down...')

        await app.close()
    })

    process.on('warning', (warning) => logger.warn(warning))
}

bootstrap()
