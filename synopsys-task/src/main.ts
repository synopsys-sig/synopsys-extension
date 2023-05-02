import { getWorkSpaceDirectory, getTempDir } from "./synopsys-task/utility";
import { SynopsysBridge } from "./synopsys-task/synopsys-bridge";
import * as taskLib from "azure-pipelines-task-lib/task";
import * as constants from "./synopsys-task/application-constant";

export async function run() {
  console.log("Synopsys Extension started...");
  const tempDir = getTempDir();
  try {
    const sb = new SynopsysBridge();

    // Prepare tool commands
    const command: string = await sb.prepareCommand(tempDir);

    // Download synopsys bridge
    const bridgePath = await sb.downloadBridge(tempDir);

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
