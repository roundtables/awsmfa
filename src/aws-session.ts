export const getAWSSession = async (AWS, mfaDeviceSerial, token, account, role) => {
    const sts = new AWS.STS({ apiVersion: '2011-06-15' })
    let params: any = {
        SerialNumber: `${mfaDeviceSerial}`,
        TokenCode: `${token}`
    }
    try {
        if (role || account) {
            let roleArn = role
            if (!role) {
                roleArn = `arn:aws:iam::${account}:role/OrganizationAccountAccessRole`
            } else {
                if (!role.match(/[\u0009\u000A\u000D\u0020-\u007E\u0085\u00A0-\uD7FF\uE000-\uFFFD\u10000-\u10FFFF]+/)) {
                    roleArn = `arn:aws:iam::${account}:role/${role}`
                }
            }

            const possibleDurations = [43200, 10400, 5200, 3600]
            for (durationAttempt of possibleDurations) {
                try {
                    params = {
                        ...params,
                        RoleArn: roleArn,
                        RoleSessionName: `awsmfa-${role}`,
                        DurationSeconds: 43200
                    }
                    const result = await sts.assumeRole(params).promise()
        
                    return { ...result.Credentials, roleArn }
                }
                catch (e) {
                    if(e.message !== 'The requested DurationSeconds exceeds the MaxSessionDuration set for this role') {
                        throw e
                    }
                    // Just try a lower duration
                    // TODO: Query what the maximum duration for the role is or make it an input parameter
                }
            }
            
        } else {
            const result = await sts.getSessionToken(params).promise()

            return result.Credentials
        }
    } catch (e) {
        console.error('Could not create session token', params)
        throw e
    }
}