import {
  getWorkSpaceDirectory,
  getTempDir,
  parseToBoolean,
} from "./synopsys-task/utility";
import { SynopsysBridge } from "./synopsys-task/synopsys-bridge";
import * as taskLib from "azure-pipelines-task-lib/task";
import * as constants from "./synopsys-task/application-constant";
import * as inputs from "./synopsys-task/input";
import {
  uploadDiagnostics,
  uploadSarifResultAsArtifact,
} from "./synopsys-task/diagnostics";
import {
  AZURE_BUILD_REASON,
  AZURE_ENVIRONMENT_VARIABLES,
} from "./synopsys-task/model/azure";

export async function run() {
  console.log("Synopsys Task started...");
  const tempDir = getTempDir();
  const workSpaceDir = getWorkSpaceDirectory();
  try {
    const sb = new SynopsysBridge();

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
    //await sb.executeBridgeCommand(bridgePath, getWorkSpaceDirectory(), command);
    const exitCode = 2;
    console.log("Setting exit code in variable: exitStatus");
    console.log(
      "##vso[task.setvariable variable=exitStatus;isoutput=true]" + exitCode
    );
    console.log("Exit code is: " + exitCode);
    return exitCode;
  } catch (error: any) {
    throw error;
  } finally {
    if (
      parseToBoolean(inputs.BLACKDUCK_REPORTS_SARIF_CREATE) ||
      parseToBoolean(inputs.BLACKDUCK_REPORTS_SARIF_CREATE_CLASSIC_EDITOR)
    ) {
      const buildReason =
        taskLib.getVariable(AZURE_ENVIRONMENT_VARIABLES.AZURE_BUILD_REASON) ||
        "";
      if (buildReason !== AZURE_BUILD_REASON.PULL_REQUEST) {
        console.log("BLACKDUCK_REPORTS_SARIF_CREATE is enabled");
        uploadSarifResultAsArtifact(
          constants.DEFAULT_BLACKDUCK_SARIF_GENERATOR_DIRECTORY,
          inputs.BLACKDUCK_REPORTS_SARIF_FILE_PATH
        );
      }
    }

    if (
      parseToBoolean(inputs.POLARIS_REPORTS_SARIF_CREATE) ||
      parseToBoolean(inputs.POLARIS_REPORTS_SARIF_CREATE_CLASSIC_EDITOR)
    ) {
      const buildReason =
        taskLib.getVariable(AZURE_ENVIRONMENT_VARIABLES.AZURE_BUILD_REASON) ||
        "";
      if (buildReason !== AZURE_BUILD_REASON.PULL_REQUEST) {
        console.log("POLARIS_REPORTS_SARIF_CREATE is enabled");
        uploadSarifResultAsArtifact(
          constants.DEFAULT_POLARIS_SARIF_GENERATOR_DIRECTORY,
          inputs.POLARIS_REPORTS_SARIF_FILE_PATH
        );
      }
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
