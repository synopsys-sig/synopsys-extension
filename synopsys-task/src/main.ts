import {
  getWorkSpaceDirectory,
  DownloadFileResponse,
  getTempDir,
} from "./synopsys-task/utility";
import { SynopsysBridge } from "./synopsys-task/synopsys-bridge";
import * as taskLib from "azure-pipelines-task-lib/task";
import * as constants from "./synopsys-task/application-constants";

export async function run() {
  console.log("Synopsys Action started...");
  const tempDir = getTempDir();
  try {
    const sb = new SynopsysBridge();

    // Prepare tool commands
    const command: string = await sb.prepareCommand(tempDir);

    // Download synopsys bridge
    const downloadedBridgeInfo: DownloadFileResponse = await sb.downloadBridge(
      tempDir
    );

    // Unzip bridge
    const bridgePath: string = await sb.extractBridge(downloadedBridgeInfo);

    // Execute prepared commands
    const response: any = await sb.executeBridgeCommand(
      bridgePath,
      getWorkSpaceDirectory(),
      command
    );
  } catch (error) {
    throw error;
  }

  console.log("Synopsys Action workflow execution completed");
}

export function logBridgeExitCodes(message: string): string {
  var exitCode = message.trim().slice(-1);
  return constants.EXIT_CODE_MAP.has(exitCode)
    ? "Exit Code: " + exitCode + " " + constants.EXIT_CODE_MAP.get(exitCode)
    : message;
}

run().catch((error) => {
  if (error.message != undefined) {
    taskLib.error(error.message);
    taskLib.setResult(
      taskLib.TaskResult.Failed,
      "Workflow failed! ".concat(logBridgeExitCodes(error.message))
    );
  }
});
