import { spawn } from 'child_process'

export class NewProcess {
    constructor(private caller: string[]) {
    }

    spawn(newAwsSession, updateTitle: boolean, profile: string) {
        return new Promise((resolve, reject) => {
            const cmd = this.caller.shift()
            const args = this.caller

            if (updateTitle) {
                process.stdout.write('\u001b]0;')
                process.stdout.write(`${profile} expires ${newAwsSession.Expiration}`)
                process.stdout.write('\u0007')
                process.stdout.write('\u001b[?25h')
            }
            
            const stdio = [process.stdin, process.stdout, process.stderr]
            const reborn = spawn(cmd, args, { env: process.env, stdio, shell: true })
            reborn.once('exit', (code: number, signal: string) => {
                if (code === 0 || code === 1) {
                    resolve()
                } else {
                    reject(new Error(`Exit with error code: ${code} for ${cmd} ${args}`))
                }
            });
        })
    }
}