import {green} from 'chalk'

import {whoCalled} from '@roundtables/whocalled'
import {resolveArgs} from './arg-input'
import {getAWSSession} from './aws-session'
import {NewProcess} from './new-process'
import {adoptSession} from './adopt-session'
import {dockerLoginWithECR} from './docker-login-with-ecr'

const cliLogic = async (args) => {
    const clidoc = `
  Usage:
    awsmfa [--profile=<profile>] [--mfaARN=<mfaARN>] [--mfaCode=<mfacode>] [--account=<account>] [--role=<role>] [--region=<region>] [--withECRLogin] [<command> [<args>...]]
    awsmfa -h | --help | --version
  `

  try {
    const { profile, mfaARN, AWS, mfaCode, allSet, account, role, command, args, region, withECRLogin } =
        await resolveArgs(clidoc, { version: '1.2.0' })
    const newAwsSession = await getAWSSession(AWS, mfaARN, mfaCode, account, role)

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

    if (!allSet) {
      console.log('Next time you can just type')
      let additionalOptions = ''
      if (withECRLogin) additionalOptions += '--withECRLogin '
      if (region) additionalOptions += `--region=${region} `
      if (newAwsSession.roleArn) additionalOptions += `--role=${newAwsSession.roleArn} `
      console.log(green(`awsmfa --profile=${profile} --mfaARN=${mfaARN} ${additionalOptions}`))
    }

    await adoptSession(AWS, region, mfaARN, mfaCode, newAwsSession, profile)

    if (withECRLogin) {
      await dockerLoginWithECR(AWS)
    }

    try {
      const newProcess = new NewProcess(processToCall)
      await newProcess.spawn(newAwsSession, !allSet, profile)
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
