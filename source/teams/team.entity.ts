import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { TransformerGroups } from '../transformer-groups.enum'

export class Team {
    @ApiProperty()
    name!: string

    @ApiProperty({ type: [Number] })
    color!: [number, number, number]

    @ApiProperty()
    points!: number

    @Expose({ groups: [TransformerGroups.INTERNAL] })
    rivalGoalPin!: number

    get colorForWeb() {
        return this.color.join(' ')
    }

    toString() {
        return `[Team ${this.name} ${this.points}]`
    }
}
