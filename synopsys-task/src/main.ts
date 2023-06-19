import { getWorkSpaceDirectory, getTempDir } from "./synopsys-task/utility";
import { SynopsysBridge } from "./synopsys-task/synopsys-bridge";
import * as taskLib from "azure-pipelines-task-lib/task";
import * as constants from "./synopsys-task/application-constant";
import * as inputs from "./synopsys-task/input";
import { uploadDiagnostics } from "./synopsys-task/diagnostics";
import { parseToBoolean } from "./synopsys-task/utility";

export async function run() {
  console.log("Synopsys Task started...");
  const tempDir = getTempDir();
  const workSpaceDir = getWorkSpaceDirectory();
  try {
    const sb = new SynopsysBridge();
    // Prepare tool commands
    const command: string = await sb.prepareCommand(tempDir);
    let bridgePath = "";
    if (!inputs.ENABLE_NETWORK_AIR_GAP) {
      bridgePath = await sb.downloadAndExtractBridge(tempDir);
    } else {
      taskLib.debug(
        "Since network air gap is enabled, bypassing the download bridge."
      );
    }

    // Download synopsys bridge

    console.log("bridgePath:" + bridgePath);
    // Execute prepared commands
    const response: any = await sb.executeBridgeCommand(
      bridgePath,
      "/Users/kirann",
      command
    );
  } catch (error) {
    throw error;
  } finally {
    if (parseToBoolean(inputs.INCLUDE_DIAGNOSTICS)) {
      uploadDiagnostics(workSpaceDir);
    }
  }

  console.log("Synopsys Task workflow execution completed");
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
