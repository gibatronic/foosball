import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import {
    ArrayMaxSize,
    ArrayMinSize,
    IsInt,
    IsNotEmpty,
    IsString,
    Max,
    Min,
} from 'class-validator'
import { TransformerGroups } from '../transformer-groups.enum'

export class Team {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name!: string

    @ApiProperty()
    @IsInt()
    points!: number

    @Expose({ groups: [TransformerGroups.INTERNAL] })
    @IsInt()
    @Max(40)
    @Min(1)
    rivalGoalPin!: number

    @ArrayMaxSize(3)
    @ArrayMinSize(3)
    @Expose({ groups: [TransformerGroups.INTERNAL] })
    @IsInt({ each: true })
    @Max(255, { each: true })
    @Min(0, { each: true })
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
