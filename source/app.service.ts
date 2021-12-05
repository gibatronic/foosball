import { Injectable, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Config } from './config/config.entity'
import { LoggerService } from './logger/logger.service'
import { TeamsService } from './teams/teams.service'

@Injectable()
export class AppService {
    constructor(
        private readonly config: ConfigService<Config, true>,
        private readonly logger: LoggerService,
        private readonly teams: TeamsService,
    ) {
        this.logger.setup(this.constructor.name)
    }

    async bootstrap(app: NestExpressApplication) {
        this.setUpApp(app)
        this.setUpSwagger(app)

        await app.listen(this.config.get('port'))
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

    setUpApp(app: NestExpressApplication) {
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
        this.teams.addTeams(this.config.get('teams'))
    }

    setUpSwagger(app: NestExpressApplication) {
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
}
