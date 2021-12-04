import { Controller, Get, HttpCode, Param, Post } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { Team } from './team.entity'
import { TeamsService } from './teams.service'

@Controller('api/teams')
@ApiTags('Teams')
export class TeamsController {
    constructor(private readonly teamsService: TeamsService) {}

    @Get()
    @ApiResponse({ type: [Team] })
    getTeams() {
        return this.teamsService.getTeams()
    }

    @Get(':color')
    @ApiResponse({ type: Team })
    getTeam(@Param('color') color: string) {
        return this.teamsService.getTeam(color)
    }

    @Get(':color/goals')
    @ApiResponse({ type: Number })
    getTeamGoals(@Param('color') color: string) {
        return this.teamsService.getTeamGoals(color)
    }

    @Post(':color/goals')
    @HttpCode(200)
    @ApiResponse({ type: Number })
    addTeamGoal(@Param('color') color: string) {
        return this.teamsService.addTeamGoal(color)
    }
}
