import { spawn } from 'child_process'

export class NewProcess {
    constructor(private caller: string[]) {
    }

    beBornAgain(newAwsSession, updateTitle: boolean, profile: string) {
        return new Promise((resolve, reject) => {
            const cmd = this.caller.shift()
            const args = this.caller

            const {
                AccessKeyId: AWS_ACCESS_KEY_ID,
                SecretAccessKey: AWS_SECRET_ACCESS_KEY,
                SessionToken: AWS_SESSION_TOKEN
            } = newAwsSession

            const sessionedEnv = {
                ...process.env,
                AWS_ACCESS_KEY_ID,
                AWS_SECRET_ACCESS_KEY,
                AWS_SESSION_TOKEN,
                AWS_PROFILE: profile
            }

            process.stdout.write('\u001b]0;')
            process.stdout.write(`${profile} expires ${newAwsSession.Expiration}`)
            process.stdout.write('\u0007')
            const stdio = [process.stdin, process.stdout, process.stderr]
            const reborn = spawn(cmd, args, { env: sessionedEnv, stdio, shell: true })
            reborn.once('exit', (code: number, signal: string) => {
                if (code === 0) {
                    resolve()
                } else {
                    reject(new Error(`Exit with error code: ${code} for ${cmd} ${args}`))
                }
            });
        })
    }
}