import { cleanupTempDir, createTempDir } from "./synopsys-task/utility/utility";
import { SynopsysBridge } from "./synopsys-task/synopsys-bridge";
import * as taskLib from "azure-pipelines-task-lib/task";

export async function run() {
  console.log(
    "Synopsys Action started..Synopsys Action started..Synopsys Action started..Synopsys Action started.."
  );
  taskLib.debug("Synopsys Action started...");
  const tempDir = await createTempDir();
  try {
    const sb = new SynopsysBridge();
    // taskLib.debug("download bridge")
    const bridgeDownload: any = await sb.downloadBridge(tempDir);
    // taskLib.debug("downloadBridge:" +bridgeDownload.filePath)
    const extractedPath: any = await sb.extractBridge(bridgeDownload.filePath);
    // taskLib.debug("extractBridge:" + JSON.stringify(extractedPath))
    const execCommand: any = await sb.executeBridgeCommand(extractedPath);
    if (execCommand != -1) {
      await cleanupTempDir(extractedPath);
    }
    // taskLib.debug("executeBridgeCommand:" + JSON.stringify(execCommand))
  } catch (error) {
    taskLib.error("download bridge" + error);
    throw error;
  } finally {
    taskLib.debug("finally executed");
  }
}

run().catch((error) => {
  if (error.message != undefined) {
    taskLib.error(error.message);
    //setFailed('Workflow failed! '.concat(logBridgeExitCodes(error.message)))
  } else {
    // setFailed('Workflow failed! '.concat(logBridgeExitCodes(error)))
  }
});
