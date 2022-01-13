import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { TransformerGroups } from '../transformer-groups.enum'

export class Team {
    @ApiProperty()
    name!: string

    @ApiProperty()
    points!: number

    @Expose({ groups: [TransformerGroups.INTERNAL] })
    rivalGoalPin!: number

    @ApiProperty({ type: [Number] })
    @Expose({ groups: [TransformerGroups.INTERNAL] })
    color!: [number, number, number]

    @Expose({ groups: [TransformerGroups.EXTERNAL] })
    get colorAsHex() {
        return (
            '#' + this.color.map((component) => component.toString(16)).join('')
        )
    }

    @Expose({ groups: [TransformerGroups.EXTERNAL] })
    get colorForWeb() {
        return this.color.join(' ')
    }

    toString() {
        return `[Team '${this.name}' ${this.points}]`
    }
}
