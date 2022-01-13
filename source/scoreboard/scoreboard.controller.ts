import { Controller, Get, HttpCode, Render, Sse } from '@nestjs/common'
import { ApiExcludeEndpoint } from '@nestjs/swagger'
import { ScoreboardService } from './scoreboard.service'

@Controller()
export class ScoreboardController {
    constructor(private readonly scoreboardService: ScoreboardService) {}

    @Get()
    @ApiExcludeEndpoint()
    @Render('scoreboard.view.hbs')
    viewScoreboard() {
        return this.scoreboardService.getViewData()
    }

    @Sse('event-stream')
    @ApiExcludeEndpoint()
    streamEvents() {
        return this.scoreboardService.streamEvents()
    }

    @Get('favicon.ico')
    @ApiExcludeEndpoint()
    @HttpCode(204)
    noop() {
        return
    }
}
