import { Controller, Get, Render } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger'

@Controller()
@ApiTags('Log')
export class LogController {
    constructor(public readonly config: ConfigService) {}

    @Get('api/log')
    apiLog() {
        return []
    }

    @Get('log')
    @Render('log.view.hbs')
    @ApiExcludeEndpoint()
    viewLog() {
        return {
            version: this.config.get('version'),
        }
    }
}
