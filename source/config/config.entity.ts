import { LogLevel } from '@nestjs/common'
import { Type } from 'class-transformer'
import {
    ArrayMaxSize,
    ArrayMinSize,
    ArrayUnique,
    IsEnum,
    IsIn,
    IsInt,
    IsOptional,
    IsSemVer,
    IsString,
    Min,
    ValidateNested,
} from 'class-validator'
import { Team } from '../teams/team.entity'
import { Environment } from './environment.enum'

export class Config {
    @IsEnum(Environment)
    environment!: Environment

    @IsOptional()
    @IsString()
    logFile!: string | null

    @ArrayUnique()
    @IsIn(['debug', 'verbose', 'log', 'warn', 'error'], { each: true })
    logLevels!: LogLevel[]

    @IsInt()
    @IsOptional()
    @Min(1)
    pointsToWin!: number | null

    @IsInt()
    port!: number

    @ArrayMaxSize(2)
    @ArrayMinSize(2)
    @ArrayUnique<Team>((team) => team.name)
    @Type(() => Team)
    @ValidateNested({ each: true })
    teams!: Team[]

    @IsSemVer()
    version!: string
}

export type ConfigFile = {
    [key in Environment]: Config
}
