import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { TransformerGroups } from '../transformer-groups.enum'

export class Team {
    @ApiProperty()
    color!: string

    @ApiProperty()
    points!: number

    @Expose({ groups: [TransformerGroups.PRIVATE] })
    rivalGoalPin!: number

    toString() {
        return `[Team ${this.color} ${this.points}]`
    }
}
