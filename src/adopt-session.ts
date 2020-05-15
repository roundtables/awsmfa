import { EnvironmentCredentials } from 'aws-sdk'

export const adoptSession = async (AWS, region, mfaARN, mfaCode, newAwsSession, profile) => {
    AWS.config.update({region: region})
    const ecrCredsParams: any = {
        SerialNumber: mfaARN,
        TokenCode: mfaCode
    }
    if (newAwsSession.RoleArn) {
        ecrCredsParams.RoleArn = newAwsSession.RoleArn
        ecrCredsParams.RoleSessionName = newAwsSession.RoleSessionName
    }

    const {
        AccessKeyId: AWS_ACCESS_KEY_ID,
        SecretAccessKey: AWS_SECRET_ACCESS_KEY,
        SessionToken: AWS_SESSION_TOKEN
    } = newAwsSession

    process.env = {
        ...process.env,
        AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY,
        AWS_SESSION_TOKEN,
        AWS_DEFAULT_REGION: region ? region : undefined,
        AWS_PROFILE: profile
    }

    AWS.config.credentials = new EnvironmentCredentials('AWS')
}