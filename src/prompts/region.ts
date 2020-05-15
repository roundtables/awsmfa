const { Select } = require('enquirer')

const regions = [
    'us-east-2', 'us-east-1', 'us-west-1', 'us-west-2',
    'af-south-1',
    'ap-east-1', 'ap-south-1', 'ap-northeast-3', 'ap-northeast-2', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1',
    'ca-central-1',
    'cn-north-1', 'cn-northwest-1',
    'eu-central-1', 'eu-west-1', 'eu-west-2', 'eu-south-1', 'eu-west-3', 'eu-north-1',
    'me-south-1',
    'sa-east-1',
    'us-gov-east-1', 'us-gov-west-1'
]

export const enquireRegion = async (): Promise<string> => {
    try {
        return new Select({
            name: 'region',
            message: 'Pick the region for this session',
            initial: process.env.AWS_DEFAULT_REGION || '',
            choices: regions
        }).run()
    } catch (e) {
        console.error('could not resolve profile', e)
        throw e
    }
}
