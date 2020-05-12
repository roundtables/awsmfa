const { Select } = require('enquirer')

export const enquireMfaARN = async (AWS, profile, user, profileSharedFile) => {
    const iam = new AWS.IAM({apiVersion: '2010-05-08'})
    try {
        const result = await iam.listMFADevices({
            UserName: user
        }).promise()
        const mfaDevices = result.MFADevices

        if (mfaDevices < 1) {
            console.error(`User has no MFA devices associated`)
            console.error('Create a device on https://console.aws.amazon.com/iam/home?region=us-east-2#/security_credentials')
            process.exit(1)
        }
        let mfaDevice = mfaDevices[0]
        if (mfaDevices.length === 1) {
            return mfaDevice.SerialNumber
        }
        if (mfaDevices.length > 1) {
            return Select({
                name: 'mfa_device',
                message: 'Select your MFA Device',
                choices: mfaDevices.map(device => device.SerialNumber)
            }).run()
        }
    } catch (e) {
        console.error('Could not get list of MFA devices', e)
        process.exit(1)
    }
}