import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import fs, { createReadStream } from 'fs'
import { access } from 'fs/promises'
import { Config } from '../config/config.entity'
import { LoggerService } from '../logger/logger.service'
import { LogViewData } from './log.entity'

@Injectable()
export class LogService {
    constructor(
        private readonly config: ConfigService<Config, true>,
        private readonly logger: LoggerService,
    ) {
        this.logger.setup(this.constructor.name)
    }

    getViewData(): LogViewData {
        this.logger.debug(`getViewData`)

        return {
            version: this.config.get<Config['version']>('version'),
        }
    }

    async getLogStream() {
        this.logger.debug(`getLogStream`)
        const logFile = this.config.get<Config['logFile']>('logFile')

        if (logFile === null) {
            throw new InternalServerErrorException('No log file configured')
        }

        try {
            await access(logFile, fs.constants.W_OK)
        } catch (exception) {
            throw new InternalServerErrorException(
                `Unable to read log file '${logFile}'`,
            )
        }

        let logStream

        try {
            logStream = createReadStream(logFile)
        } catch (exception) {
            throw new InternalServerErrorException(
                `Unable to stream log file ${logFile}`,
            )
        }

        return logStream
    }
}
