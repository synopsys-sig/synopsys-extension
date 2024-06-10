import {
  getWorkSpaceDirectory,
  getTempDir,
  parseToBoolean,
  isPullRequestEvent,
} from "./synopsys-task/utility";
import { SynopsysBridge } from "./synopsys-task/synopsys-bridge";
import * as taskLib from "azure-pipelines-task-lib/task";
import * as constants from "./synopsys-task/application-constant";
import * as inputs from "./synopsys-task/input";
import {
  uploadDiagnostics,
  uploadSarifResultAsArtifact,
} from "./synopsys-task/diagnostics";
import { showLogForDeprecatedInputs } from "./synopsys-task/input";
import { AzurePrResponse } from "./synopsys-task/model/azure";

export async function run() {
  console.log("Synopsys Task started...");
  const tempDir = getTempDir();
  taskLib.debug(`tempDir: ${tempDir}`);
  const workSpaceDir = getWorkSpaceDirectory();
  taskLib.debug(`workSpaceDir: ${workSpaceDir}`);
  let azurePrResponse: AzurePrResponse | undefined;
  try {
    const sb = new SynopsysBridge();

    showLogForDeprecatedInputs();
    // Prepare tool commands
    const command: string = await sb.prepareCommand(tempDir);
    let bridgePath = "";
    if (!inputs.ENABLE_NETWORK_AIRGAP) {
      bridgePath = await sb.downloadAndExtractBridge(tempDir);
    } else {
      console.log(
        "Network air gap is enabled, skipping synopsys-bridge download."
      );
      bridgePath = await sb.getSynopsysBridgePath();
    }

    // Execute prepared commands
    await sb.executeBridgeCommand(bridgePath, getWorkSpaceDirectory(), command);
  } catch (error: any) {
    throw error;
  } finally {
    if (parseToBoolean(inputs.BLACKDUCK_REPORTS_SARIF_CREATE)) {
      console.log("BLACKDUCK_REPORTS_SARIF_CREATE is enabled");
      uploadSarifResultAsArtifact(
        constants.DEFAULT_BLACKDUCK_SARIF_GENERATOR_DIRECTORY,
        inputs.BLACKDUCK_REPORTS_SARIF_FILE_PATH
      );
    }

    if (parseToBoolean(inputs.POLARIS_REPORTS_SARIF_CREATE)) {
      console.log("POLARIS_REPORTS_SARIF_CREATE is enabled");
      uploadSarifResultAsArtifact(
        constants.DEFAULT_POLARIS_SARIF_GENERATOR_DIRECTORY,
        inputs.POLARIS_REPORTS_SARIF_FILE_PATH
      );
    }

    if (parseToBoolean(inputs.INCLUDE_DIAGNOSTICS)) {
      uploadDiagnostics(workSpaceDir);
    }
  }

  console.log("Synopsys Task workflow execution completed");
}

export function logBridgeExitCodes(message: string): string {
  const exitCode = message.trim().slice(-1);
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
