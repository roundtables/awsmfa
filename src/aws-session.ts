export const getAWSSession = async (AWS, mfaDeviceSerial, token) => {
    const sts = new AWS.STS({ apiVersion: '2011-06-15' })
    const params = {
        SerialNumber: `${mfaDeviceSerial}`,
        TokenCode: `${token}`
    }
    try {
        const result = await sts.getSessionToken(params).promise()

        return result.Credentials
    } catch (e) {
        console.error('Could not create session token', params)
        throw e
    }
}