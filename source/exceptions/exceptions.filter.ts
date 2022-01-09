import { ArgumentsHost, Catch } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import { LoggerService } from '../logger/logger.service'

@Catch()
export class ExceptionsFilter extends BaseExceptionFilter {
    constructor(private readonly logger: LoggerService) {
        super()
        this.logger.setup(this.constructor.name)
    }

    catch(exception: unknown, host: ArgumentsHost) {
        const isError = exception instanceof Error
        const stack = isError ? exception.stack : undefined
        const firstAtLine = /^.+?at (.+?)\..+$/s
        const { 1: context } = stack?.match(firstAtLine) ?? { 1: null }

        if (context) {
            this.logger.setContext(context)
        }

        this.logger.error(exception)
        super.catch(exception, host)
    }
}
