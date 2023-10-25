import { Logger } from '@nestjs/common'
import { ConfigModule as ConfigBuilder } from '@nestjs/config'
import { plainToInstance } from 'class-transformer'
import { validateOrReject, ValidationError } from 'class-validator'
import { readFileSync } from 'fs'
import Joi from 'joi'
import yaml from 'js-yaml'
import { join } from 'path'
import { TransformerGroups } from '../transformer-groups.enum'
import { Config, ConfigFile } from './config.entity'
import { Environment } from './environment.enum'

const validationSchema = Joi.object({
    ENVIRONMENT: Joi.string()
        .required()
        .valid(...Object.keys(Environment)),

    PORT: Joi.number().required().min(0),
})

export const ConfigModule = ConfigBuilder.forRoot({
    cache: true,
    load: [loader],
    validationSchema,
})

function loader(): Config {
    const filename = 'config.yaml'
    const data = readFileSync(join(__dirname, filename), 'utf8')
    const config = yaml.load(data, { filename }) as ConfigFile

    const environment = process.env.ENVIRONMENT as Config['environment']
    const logFile = process.env.LOG_FILE ?? null
    const port = parseInt(process.env.PORT ?? '0', 10)
    const version = process.env.npm_package_version ?? ''

    const environmentConfig = plainToInstance(
        Config,
        {
            ...config[environment],
            environment,
            logFile,
            port,
            version,
        },
        {
            groups: [TransformerGroups.INTERNAL],
        },
    )

    validateOrReject(environmentConfig, {
        forbidNonWhitelisted: true,
        whitelist: true,
    }).catch((errors: ValidationError[]) => {
        if (environment === Environment.testing) {
            return;
        }

        const logger = new Logger('ConfigModule')

        for (const error of errors) {
            logger.error(error.toString().trim())
        }
    })

    return environmentConfig
}
