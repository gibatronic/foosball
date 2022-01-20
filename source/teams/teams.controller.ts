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
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger'
import { ErrorResponse } from '../exceptions/error-response.interface'
import { Team } from './team.entity'
import { TeamsService } from './teams.service'

@Controller('api/teams')
@ApiTags('Teams')
@UseInterceptors(ClassSerializerInterceptor)
export class TeamsController {
    constructor(private readonly teamsService: TeamsService) {}

    @Get()
    @ApiOperation({ summary: 'List teams' })
    @ApiOkResponse({ type: [Team] })
    getTeams() {
        return this.teamsService.getTeams()
    }

    @Get(':name')
    @ApiOperation({ summary: 'Show a team' })
    @ApiOkResponse({ type: Team })
    @ApiNotFoundResponse({ type: ErrorResponse })
    getTeam(@Param('name') name: string) {
        return this.teamsService.getTeam(name)
    }

    @Post(':name/points')
    @ApiOperation({ summary: 'Increment the points of a team by 1' })
    @ApiOkResponse({ type: Team })
    @ApiNotFoundResponse({ type: ErrorResponse })
    @HttpCode(200)
    incrementTeamPoints(@Param('name') name: string) {
        return this.teamsService.incrementTeamPoints(name)
    }

    @Delete(':name/points')
    @ApiOperation({ summary: 'Decrement the points of a team by 1' })
    @ApiOkResponse({ type: Team })
    @ApiNotFoundResponse({ type: ErrorResponse })
    decrementTeamPoints(@Param('name') name: string) {
        return this.teamsService.decrementTeamPoints(name)
    }

    @Post('points/reset')
    @ApiOperation({ summary: 'Resets the points of all teams to 0' })
    @ApiOkResponse({ type: [Team] })
    @HttpCode(200)
    resetTeamsPoints() {
        return this.teamsService.resetTeamsPoints()
    }
}
