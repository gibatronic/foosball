import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'

export class Team {
    @ApiProperty()
    color!: string

    @ApiProperty({
        minimum: 0,
    })
    @IsInt()
    goals!: number

    toString() {
        return `[Team ${this.color} ${this.goals}]`
    }
}
