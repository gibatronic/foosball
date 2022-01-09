import {
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    UseInterceptors,
} from '@nestjs/common'
import {
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger'
import { ErrorResponse } from '../error-response.interface'
import { Team } from './team.entity'
import { TeamsService } from './teams.service'

@Controller('api/teams')
@ApiTags('Teams')
export class TeamsController {
    constructor(private readonly teamsService: TeamsService) {}

    @Get()
    @ApiOperation({ summary: 'List teams' })
    @ApiOkResponse({ type: [Team] })
    @UseInterceptors(ClassSerializerInterceptor)
    getTeams() {
        return this.teamsService.getTeams()
    }

    @Get(':color')
    @ApiOperation({ summary: 'Show a team' })
    @ApiOkResponse({ type: Team })
    @ApiNotFoundResponse({ type: ErrorResponse })
    @UseInterceptors(ClassSerializerInterceptor)
    getTeam(@Param('color') color: string) {
        return this.teamsService.getTeam(color)
    }

    @Get(':color/points')
    @ApiOperation({ summary: 'Show the points of a team' })
    @ApiOkResponse({
        content: { 'text/plain': { schema: { type: 'number' } } },
    })
    @ApiNotFoundResponse({ type: ErrorResponse })
    getTeamPoints(@Param('color') color: string) {
        return this.teamsService.getTeamPoints(color)
    }

    @Post(':color/points')
    @ApiOperation({ summary: 'Increment the points of a team by 1' })
    @ApiOkResponse({
        content: { 'text/plain': { schema: { type: 'number' } } },
    })
    @ApiNotFoundResponse({ type: ErrorResponse })
    @HttpCode(200)
    incrementTeamPoints(@Param('color') color: string) {
        return this.teamsService.incrementTeamPoints(color)
    }

    @Delete(':color/points')
    @ApiOperation({ summary: 'Decrement the points of a team by 1' })
    @ApiOkResponse({
        content: { 'text/plain': { schema: { type: 'number' } } },
    })
    @ApiNotFoundResponse({ type: ErrorResponse })
    decrementTeamPoints(@Param('color') color: string) {
        return this.teamsService.decrementTeamPoints(color)
    }

    @Post(':color/points/reset')
    @ApiOperation({
        summary: 'Resets the points of a team to 0',
        description:
            'Set the `color` path parameter to `all` to reset the points of both teams',
    })
    @ApiNoContentResponse({
        description: 'When resetting team points succeeds',
    })
    @ApiNotFoundResponse({ type: ErrorResponse })
    @HttpCode(204)
    resetTeamPoints(@Param('color') color: string) {
        return this.teamsService.resetTeamPoints(color)
    }
}
