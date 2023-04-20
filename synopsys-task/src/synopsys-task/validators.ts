import * as fs from 'fs'
import * as constants from './application-constants'
import * as inputs from './inputs'
import * as taskLib from 'azure-pipelines-task-lib/task';


export function validateParameters(params: Map<string, string>, toolName: string): string[] {
  const invalidParams: string[] = isNullOrEmpty(params)
  const errors: string[] = []
  if (invalidParams.length > 0) {
    errors.push(`[${invalidParams.join()}] - required parameters for ${toolName} is missing`)
  }
  return errors
}

export function isNullOrEmpty(params: Map<string, string>): string[] {
  const invalidParams: string[] = []
  for (const param of params.entries()) {
    if (param[1] == null || param[1].length === 0 || param[1].toString().includes(' ')) {
      invalidParams.push(param[0])
    }
  }
  return invalidParams
}

export function validateBridgeUrl(url: string): boolean {
   taskLib.debug("url:::url:::url:::url:::" + url.match('.*\\.(zip|ZIP)$'))
  if (!url.match('.*\\.(zip|ZIP)$')) {
    return false
  }
  const osName = process.platform
   taskLib.debug("osName:::" + osName)
  const fileNameComponent = url.substring(url.lastIndexOf('/'), url.length)
  if (osName === 'darwin') {
    return fileNameComponent.toLowerCase().includes('mac')
  } else if (osName === 'linux') {
    return fileNameComponent.toLowerCase().includes('linux')
  } else if (osName === 'win32') {
    return fileNameComponent.toLowerCase().includes('win')
  } else {
    return true
    //Need to change to false
  }
}
