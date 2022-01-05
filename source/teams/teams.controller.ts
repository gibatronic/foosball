import { Controller, Delete, Get, HttpCode, Param, Post } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { instanceToInstance } from 'class-transformer'
import { Team } from './team.entity'
import { TeamsService } from './teams.service'

@Controller('api/teams')
@ApiTags('Teams')
export class TeamsController {
    constructor(private readonly teamsService: TeamsService) {}

    @Get()
    @ApiOkResponse({ type: [Team], description: 'List teams' })
    getTeams() {
        return instanceToInstance(this.teamsService.getTeams())
    }

    @Get(':color')
    @ApiOkResponse({ type: Team, description: 'Show a team' })
    getTeam(@Param('color') color: string) {
        return instanceToInstance(this.teamsService.getTeam(color))
    }

    @Get(':color/points')
    @ApiOkResponse({
        description: 'Show the points of a team',
        content: { 'text/plain': { schema: { type: 'number' } } },
    })
    getTeamPoints(@Param('color') color: string) {
        return this.teamsService.getTeamPoints(color)
    }

    @Post(':color/points')
    @ApiOkResponse({
        description: 'Increment the points of a team',
        content: { 'text/plain': { schema: { type: 'number' } } },
    })
    @HttpCode(200)
    incrementTeamPoint(@Param('color') color: string) {
        return this.teamsService.incrementTeamPoint(color)
    }

    @Delete(':color/points')
    @ApiOkResponse({
        description: 'Decrement the points of a team',
        content: { 'text/plain': { schema: { type: 'number' } } },
    })
    decrementTeamPoint(@Param('color') color: string) {
        return this.teamsService.decrementTeamPoint(color)
    }
}
