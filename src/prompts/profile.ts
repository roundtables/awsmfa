import { readFileSync, existsSync } from 'fs'
import { parse } from 'ini'
const { Select } = require('enquirer')


export const enquireProfile = async (credentialsFileLocation: string): Promise<string> => {
    try {
        const profileContents = parse(readFileSync(credentialsFileLocation, 'utf-8'))

        const profiles = Object.keys(profileContents)
        if (profiles.length === 1) {
            return profiles[0]
        }

        return new Select({
            name: 'profile',
            message: 'Pick the profile that will create the session',
            initial: process.env.AWS_PROFILE || '',
            choices: profiles
        }).run()
    } catch (e) {
        console.error('could not resolve profile', e)
        throw e
    }
}
