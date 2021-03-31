import { Writable } from 'stream'
import { spawn, StdioOptions } from 'child_process'

export const dockerLoginWithECR = async (AWS) => {
    const ecr = new AWS.ECR()

    const {authorizationData: authDataList} = await ecr.getAuthorizationToken().promise()
    if (authDataList.length === 0) {
        console.log('Could not find any authorization tokens')
    }
    const authorizationData = authDataList[0]
    let base64Data = Buffer.from(authorizationData.authorizationToken, 'base64')
    let clearData = base64Data.toString('ascii')
    const [user, password] = clearData.split(':')

    const childArgs = ['login', '-u', user, '--password-stdin', authorizationData.proxyEndpoint]
    const stdio: StdioOptions = ['pipe', process.stdout, process.stderr]
    await new Promise(async (resolve, reject) => {
        process.stdout.write('(Docker) ')
        const dockerLogin = spawn('docker', childArgs, {env: process.env, stdio, shell: true})
        await streamWrite(dockerLogin.stdin, password)
        await streamEnd(dockerLogin.stdin)
        dockerLogin.once('exit', (code: number, signal: string) => {
            if (code === 0) {
                resolve()
            } else {
                reject(new Error(`Docker login exit with error code: ${code} `))
            }
        });
    })
}

function streamWrite(
    stream: Writable,
    chunk: string | Buffer | Uint8Array,
    encoding = 'utf8' as BufferEncoding): Promise<void> {
    return new Promise((resolve, reject) => {
        const errListener = (err: Error) => {
            stream.removeListener('error', errListener);
            reject(err);
        };
        stream.addListener('error', errListener);
        const callback = () => {
            stream.removeListener('error', errListener);
            resolve();
        };
        stream.write(chunk, encoding, callback);
    });
}

function streamEnd(stream: Writable): Promise<void> {
    return new Promise((resolve, reject) => {
        const errListener = (err: Error) => {
            stream.removeListener('error', errListener);
            reject(err);
        };
        stream.addListener('error', errListener);
        const callback = () => {
            stream.removeListener('error', errListener);
            resolve();
        };
        stream.end(callback)
    });
}