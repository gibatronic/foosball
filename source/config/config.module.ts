import { ConfigModule as ConfigBuilder } from '@nestjs/config'
import { readFileSync } from 'fs'
import Joi from 'joi'
import yaml from 'js-yaml'
import { join } from 'path'
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

    return {
        ...config[environment],
        environment,
        logFile,
        port,
        version,
    }
}
