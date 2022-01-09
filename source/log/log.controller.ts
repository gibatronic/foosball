import { Controller, Get, Render, Res } from '@nestjs/common'
import {
    ApiExcludeEndpoint,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger'
import { Response } from 'express'
import { ErrorResponse } from '../exceptions/error-response.interface'
import { LogService } from './log.service'

@Controller()
@ApiTags('Log')
export class LogController {
    constructor(private readonly logService: LogService) {}

    @Get('api/log')
    @ApiOperation({ summary: 'Show logs' })
    @ApiOkResponse({
        description: 'Every line from `LOG_FILE`',
        content: { 'text/plain': { schema: { type: 'string' } } },
    })
    @ApiInternalServerErrorResponse({
        type: ErrorResponse,
        description: 'When `LOG_FILE` fails to open for reading and streaming',
    })
    async apiLog(@Res() response: Response) {
        const logStream = await this.logService.getLogStream()
        response.type('text')
        logStream.pipe(response)
    }

    @Get('log')
    @ApiExcludeEndpoint()
    @Render('log.view.hbs')
    viewLog() {
        return this.logService.getViewData()
    }
}
