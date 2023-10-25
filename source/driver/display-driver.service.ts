import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { exec as execCB } from 'node:child_process'
import { FileHandle, open } from 'node:fs/promises'
import { promisify } from 'node:util'
import { Config } from '../config/config.entity'
import { LoggerService } from '../logger/logger.service'

const exec = promisify(execCB)

@Injectable()
export class DisplayDriverService {
    private displayPort: FileHandle | null = null

    constructor(
        private readonly config: ConfigService<Config, true>,
        private readonly logger: LoggerService,
    ) {
        this.logger.setup(this.constructor.name)
    }

    async setup() {
        this.logger.debug('setup')

        const displayFQBN =
            this.config.get<Config['displayFQBN']>('displayFQBN')

        const displayPort = await this.getDisplayPort(displayFQBN)
        this.logger.debug(`found display at "${displayPort}"`)
        this.displayPort = await open(displayPort, 'r+')

        // wait for the display to send
        // a byte to signal being ready
        await this.displayPort.read()
        await this.wait(200)
    }

    async display(frame: Uint8Array) {
        if (this.displayPort === null) {
            throw new Error('dropping frame, display port is not open')
        }

        await this.displayPort.write(frame)
    }

    async getDisplayPort(displayFQBN: string) {
        const { stdout: output, stderr: error } = await exec(
            `arduino-cli board list |
            grep --max-count 1 '${displayFQBN}' |
            cut -d ' ' -f 1`,
        )

        if (error !== '') {
            throw new Error(`failed to find a display: ${error}`)
        }

        if (output === '') {
            throw new Error(`no display found with FQBN "${displayFQBN}"`)
        }

        return output.trim()
    }

    wait(milliseconds: number) {
        return new Promise<void>((resolve) => setTimeout(resolve, milliseconds))
    }

    async teardown() {
        this.logger.debug('teardown')

        if (this.displayPort === null) {
            return
        }

        await this.display(new Uint8Array(160))
        await this.wait(200)
        await this.displayPort.close()
    }
}
