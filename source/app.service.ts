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
        this.logger.verbose('oh hi')
    }

    async bootstrap(app: NestExpressApplication) {
        this.setupApp(app)
        this.setupSwagger(app)
        this.setupViews(app)
        this.driver.setup()

        await app.listen(this.config.get<Config['port']>('port'))
        this.logger.log(`listening at ${await app.getUrl()}`)

        process.on('SIGTERM', () => this.handleTerminateSignal(app))
        process.on('warning', (warning) => this.logger.warn(warning))
    }

    async handleTerminateSignal(app: NestExpressApplication) {
        this.logger.log('got termination signal, gracefully shutting down...')
        this.driver.teardown()
        await app.close()
        this.logger.verbose('doei')
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

                    // must never be enabled because it fails to handle booleans
                    // https://github.com/typestack/class-transformer/issues/550
                    enableImplicitConversion: false,
                },
            }),
        )

        app.useLogger(this.logger)
        this.teams.setTeams(this.config.get<Config['teams']>('teams'))
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
        const folders = ['log', 'scoreboard']
        const paths = folders.map((folder) => join(__dirname, folder))

        app.setBaseViewsDir(paths)
        app.setViewEngine('hbs')
    }
}
