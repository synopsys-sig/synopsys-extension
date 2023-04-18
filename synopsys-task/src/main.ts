import {cleanupTempDir, createTempDir} from './synopsys-task/utility/utility'
import {SynopsysBridge} from './synopsys-task/synopsys-bridge'
import * as constants from './synopsys-task/application-constants'
import * as fs from 'fs'
import * as path from 'path';
var https = require('https');
import * as os from 'os'
import * as taskLib from 'azure-pipelines-task-lib/task';
import * as toolLib from 'azure-pipelines-tool-lib/tool';

export async function run() {

  console.log('Synopsys Action started...')
  const tempDir = await createTempDir()
  let formattedCommand = ''

  try {
    const sb = new SynopsysBridge()
console.log("download bridge")
    // Download bridge
    sb.downloadBridge(tempDir)
    // Execute bridge command
    //return //await sb.executeBridgeCommand(formattedCommand, getWorkSpaceDirectory())
  } catch (error) {
    throw error
  } finally {
    
}
}

// export function logBridgeExitCodes(message: string): string {
//   var exitCode = message.trim().slice(-1)
//   return constants.EXIT_CODE_MAP.has(exitCode) ? 'Exit Code: ' + exitCode + ' ' + constants.EXIT_CODE_MAP.get(exitCode) : message
// }

run().catch(error => {
  if (error.message != undefined) {
   //setFailed('Workflow failed! '.concat(logBridgeExitCodes(error.message)))
  } else {
   // setFailed('Workflow failed! '.concat(logBridgeExitCodes(error)))
  }
})

