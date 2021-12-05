import { ConfigModule as ConfigBuilder } from '@nestjs/config'
import { readFileSync } from 'fs'
import Joi from 'joi'
import yaml from 'js-yaml'
import { join } from 'path'
import { Config } from './config.entity'

type ConfigWithoutEnvVar = Omit<Config, 'environment' | 'port'>

const validationSchema = Joi.object({
    ENVIRONMENT: Joi.string().required().valid('development', 'production'),
    PORT: Joi.number().required().min(0),
})

export const ConfigModule = ConfigBuilder.forRoot({
    cache: true,
    load: [loader],
    validationSchema,
})

function loader(): Config {
    const file = join(__dirname, 'config.yaml')

    const config = yaml.load(readFileSync(file, 'utf8')) as {
        development: ConfigWithoutEnvVar
        production: ConfigWithoutEnvVar
    }

    const environment = process.env.ENVIRONMENT as 'development' | 'production'

    return {
        environment,
        port: parseInt(process.env.PORT ?? '0', 10),
        ...config[environment],
    }
}
