import { readFileSync, existsSync } from 'fs'
import { parse } from 'ini'
const { Select } = require('enquirer')


export const enquireProfile = async (credentialsFileLocation: string): Promise<{ credentialsFileLocation: string, profile: string }> => {
    try {
        const profileContents = parse(readFileSync(credentialsFileLocation, 'utf-8'))

        return new Select({
            name: 'profile',
            message: 'Pick the profile that will create the session',
            initial: process.env.AWS_PROFILE || '',
            choices: Object.keys(profileContents)
        }).run()
    } catch (e) {
        console.error('could not resolve profile', e)
        throw e
    }
}
