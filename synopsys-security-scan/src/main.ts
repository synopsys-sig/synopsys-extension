import {
  getWorkSpaceDirectory,
  getTempDir,
} from "./synopsys-security-scan/utility";
import { SynopsysBridge } from "./synopsys-security-scan/synopsys-bridge";
import * as taskLib from "azure-pipelines-task-lib/task";
import * as constants from "./synopsys-security-scan/application-constant";
import * as inputs from "./synopsys-security-scan/input";
import { uploadDiagnostics } from "./synopsys-security-scan/diagnostics";
import { parseToBoolean } from "./synopsys-security-scan/utility";

export async function run() {
  console.log("Synopsys Security Scan started...");
  const tempDir = getTempDir();
  const workSpaceDir = getWorkSpaceDirectory();
  try {
    const sb = new SynopsysBridge();

    // Prepare tool commands
    const command: string = await sb.prepareCommand(tempDir);

    // Download synopsys bridge
    const bridgePath = await sb.downloadAndExtractBridge(tempDir);

    // Execute prepared commands
    const response: any = await sb.executeBridgeCommand(
      bridgePath,
      workSpaceDir,
      command
    );
  } catch (error) {
    throw error;
  } finally {
    if (parseToBoolean(inputs.INCLUDE_DIAGNOSTICS)) {
      uploadDiagnostics(workSpaceDir);
    }
  }

  console.log("Synopsys Security Scan workflow execution completed");
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
