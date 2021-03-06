import { docopt } from 'docopt'
const AWS = require('aws-sdk')

import { enquireProfile } from './prompts/profile'
import { enquireMfaARN } from './prompts/mfa-arn'
import { enquireMfaToken } from './prompts/enquireMfaToken'
import { enquireProfileLocation } from './prompts/resolve-shared-credentials'
import {enquireRegion} from './prompts/region'

const resolveArgs = async (clidoc, metaOptions) => {
    const cliArgs = docopt(clidoc, metaOptions)
    let allSet = false

    for (const key of Object.keys(cliArgs)) {
        cliArgs[key.replace('--', '')] = cliArgs[key]
        cliArgs[key.replace(/[\<\>]/g, '')] = cliArgs[key]
    }
    let { profileSharedFile, profile, mfaARN, mfaCode, withECRLogin, region } = cliArgs
    if (!!profile && !!mfaARN) {
        allSet = true
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
        mfaARN = await enquireMfaARN(AWS, profile, profileSharedFile)
    }

    if (!region) {
        region = await enquireRegion()
    }

    if (!mfaCode) {
        mfaCode = await enquireMfaToken()
    }

    return {
        ...cliArgs,
        profile,
        profileSharedFile,
        mfaARN,
        mfaCode,
        allSet,
        region,
        withECRLogin,
        AWS
    }
}

export { resolveArgs }