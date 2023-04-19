import {cleanupTempDir, createTempDir} from './synopsys-task/utility/utility'
import {SynopsysBridge} from './synopsys-task/synopsys-bridge'


export async function run() {

  console.log('Synopsys Action started...')
  const tempDir = await createTempDir()
  let formattedCommand = ''

  try {
    const sb = new SynopsysBridge()
    console.log("download bridge")
    // Download bridge
    sb.downloadBridge(tempDir)
  
  } catch (error) {
    throw error
  } finally {
    console.log("finally executed")
}
}

run().catch(error => {
  if (error.message != undefined) {
    console.log(error.message)
   //setFailed('Workflow failed! '.concat(logBridgeExitCodes(error.message)))
  } else {
   
   // setFailed('Workflow failed! '.concat(logBridgeExitCodes(error)))
  }
})

