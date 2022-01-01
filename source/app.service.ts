import { Injectable, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { join } from 'path'
import { Config } from './config/config.entity'
import { DriverService } from './driver/driver.service'
import { LoggerService } from './logger/logger.service'
import { TeamsService } from './teams/teams.service'

@Injectable()
export class AppService {
    constructor(
        private readonly config: ConfigService<Config, true>,
        private readonly driver: DriverService,
        private readonly logger: LoggerService,
        private readonly teams: TeamsService,
    ) {
        this.logger.setup(this.constructor.name)
    }

    async bootstrap(app: NestExpressApplication) {
        this.setupApp(app)
        this.setupSwagger(app)
        this.setupViews(app)
        this.driver.setup()

        await app.listen(this.config.get<Config['port']>('port'))
        this.logger.log(`listening at ${await app.getUrl()}`)

        process.on('SIGTERM', this.handleTerminateSignal(app))
        process.on('warning', (warning) => this.logger.warn(warning))
    }

    handleTerminateSignal(app: NestExpressApplication) {
        return async () => {
            this.logger.log(
                'got termination signal, gracefully shutting down...',
            )

            await app.close()
        }
    }

    setupApp(app: NestExpressApplication) {
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

        app.useLogger(this.logger)
        this.teams.addTeams(this.config.get<Config['teams']>('teams'))
    }

    setupSwagger(app: NestExpressApplication) {
        const documentBuilder = new DocumentBuilder()
            .setTitle('Foosball API')
            .setVersion(this.config.get<Config['version']>('version'))
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

    setupViews(app: NestExpressApplication) {
        const log = join(__dirname, 'log')

        app.setBaseViewsDir(log)
        app.useStaticAssets(log)
        app.setViewEngine('hbs')
    }
}
