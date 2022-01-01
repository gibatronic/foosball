import {
    Controller,
    Get,
    HttpStatus,
    InternalServerErrorException,
    Render,
    Res,
} from '@nestjs/common'
import {
    ApiExcludeEndpoint,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiTags,
} from '@nestjs/swagger'
import { Response } from 'express'
import { LogService } from './log.service'

@Controller()
@ApiTags('Log')
export class LogController {
    constructor(private readonly logService: LogService) {}

    @Get('api/log')
    @ApiOkResponse({ description: 'Every line from `LOG_FILE`' })
    @ApiInternalServerErrorResponse({
        description: 'When `LOG_FILE` fails to open for reading and streaming',
    })
    async apiLog(@Res() response: Response) {
        let logStream

        try {
            logStream = await this.logService.getLogStream()
        } catch (exception) {
            let description

            if (exception instanceof Error) {
                description = exception.message
            } else {
                description = JSON.stringify(exception)
            }

            response
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(
                    new InternalServerErrorException(description).getResponse(),
                )

            return
        }

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
