import { blue } from 'chalk'

import { whoCalled } from '@roundtables/whocalled'
import { resolveArgs } from './arg-input'
import { getAWSSession } from './aws-session'
import { NewProcess } from './new-process'

const cliLogic = async (args) => {
    const clidoc = `
  Usage:
    awsmfa [--profile=<profile>] [--mfaARN=<mfaARN>] [--mfaCode=<mfacode>] [<command> [<args>...]]
    awsmfa -h | --help | --version
  `

  try {
    const { profile, mfaARN, AWS, mfaCode, allSet, command, args } =
        await resolveArgs(clidoc, { version: '1.0.0' })
    const newAwsSession = await getAWSSession(AWS, mfaARN, mfaCode)

    let processToCall = []
    if (!command) {
      // Call the shell that called awsmfa
      processToCall = await whoCalled()
    } else {
      processToCall.push(command)
      if (args.length) {
        processToCall.push(...args)
      }
    }
    const newProcess = new NewProcess(processToCall)

    if (!allSet) {
      console.log('Next time you can just type')
      console.log(blue(`awsmfa --profile=${profile} --mfaARN=${mfaARN} --mfaCode=<mfaCode>`))
    }

    try {
      await newProcess.beBornAgain(newAwsSession, profile)
    } catch (e) {
      console.error('rebirth failed', e)
    }
  } catch (e) {
    console.error('refusing to proceed', e)
  }
}

const cli = (args) => {
  return cliLogic(args)
}

export { cli }
