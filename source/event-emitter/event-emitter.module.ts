import { EventEmitterModule as EventEmitterBuilder } from '@nestjs/event-emitter'

export const EventEmitterModule = EventEmitterBuilder.forRoot({
    global: true,
})
