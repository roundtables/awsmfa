const { Select } = require('enquirer')
import { existsSync } from 'fs'

export const enquireProfileLocation = (credentialsFileLocationInput): Promise<string> => {
    return new Promise((resolve) => {
        if(existsSync(credentialsFileLocationInput)) {
            resolve(credentialsFileLocationInput)
            return
        }
        return new Select({
            name: 'credentials_file',
            message: 'Could not find ~/.aws/credentials. Where is your credentials file',
            initial: '<I need to create one>',
            choices: ['<I need to create one>', '<I have one elsewhere>']
        }).run()
            .then(credentialsFileLocation => {
                if (credentialsFileLocation === '<I need to create one>') {
                    console.error('run `aws configure` before starting awsmfa again')
                    process.exit(1)
                }
                return credentialsFileLocation
            })
    })
}