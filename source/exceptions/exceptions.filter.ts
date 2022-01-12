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
        this.logger.error(exception)
        super.catch(exception, host)
    }
}
