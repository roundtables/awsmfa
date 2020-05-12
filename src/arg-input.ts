import { docopt } from 'docopt'
const AWS = require('aws-sdk')

import { enquireUser } from './prompts/user'
import { enquireProfile } from './prompts/profile'
import { enquireMfaARN } from './prompts/mfa-arn'
import { enquireMfaToken } from './prompts/enquireMfaToken'
import { enquireProfileLocation } from './prompts/resolve-shared-credentials'

const resolveArgs = async (clidoc, metaOptions) => {
    const cliArgs = docopt(clidoc, metaOptions)
    let allSet = false

    for (const key of Object.keys(cliArgs)) {
        cliArgs[key.replace('--', '')] = cliArgs[key]
        cliArgs[key.replace(/[\<\>]/g, '')] = cliArgs[key]
    }
    let { user, profileSharedFile, profile, mfaARN, mfaCode } = cliArgs
    if (!!profile && !!mfaARN && !!mfaCode) {
        allSet = true
    }

    if (!profile && !user) {
        user = await enquireUser()
    }
    if (!profile) {
        const homepath = process.platform === 'win32' ? process.env.HOMEPATH : process.env.HOME
        const inputProfileFile = process.env.AWS_SHARED_CREDENTIALS_FILE || `${homepath}/.aws/credentials`
        profileSharedFile = await enquireProfileLocation(inputProfileFile)
        profile = await enquireProfile(profileSharedFile)
    }

    try {
        AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile, filename: profileSharedFile })
    } catch (e) {
        process.env.AWS_SDK_LOAD_CONFIG = '1'
        AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile, filename: profileSharedFile })
    }

    if (!mfaARN) {
        mfaARN = await enquireMfaARN(AWS, profile, user, profileSharedFile)
    }
    if (!mfaCode) {
        mfaCode = await enquireMfaToken()
    }
    return {
        ...cliArgs,
        user,
        profile,
        profileSharedFile,
        mfaARN,
        mfaCode,
        allSet,
        AWS
    }
}

export { resolveArgs }