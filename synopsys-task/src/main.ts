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
import {
  AZURE_BUILD_REASON,
  AZURE_ENVIRONMENT_VARIABLES,
} from "./synopsys-task/model/azure";
import { RETURN_STATUS } from "./synopsys-task/input";

export async function run() {
  console.log("Synopsys Task started...");
  const tempDir = getTempDir();
  taskLib.debug(`tempDir: ${tempDir}`);
  const workSpaceDir = getWorkSpaceDirectory();
  taskLib.debug(`workSpaceDir: ${workSpaceDir}`);
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
    const result: number = await sb.executeBridgeCommand(
      bridgePath,
      getWorkSpaceDirectory(),
      command
    );

    if (parseToBoolean(inputs.RETURN_STATUS)) {
      console.log(
        `##vso[task.setvariable variable=status;isoutput=true]${result}`
      );
    }
  } catch (error: any) {
    throw error;
  } finally {
    const isPullRequest = isPullRequestEvent();
    if (parseToBoolean(inputs.BLACKDUCK_REPORTS_SARIF_CREATE)) {
      if (!isPullRequest) {
        console.log("BLACKDUCK_REPORTS_SARIF_CREATE is enabled");
        uploadSarifResultAsArtifact(
          constants.DEFAULT_BLACKDUCK_SARIF_GENERATOR_DIRECTORY,
          inputs.BLACKDUCK_REPORTS_SARIF_FILE_PATH
        );
      }
    }

    if (parseToBoolean(inputs.POLARIS_REPORTS_SARIF_CREATE)) {
      if (!isPullRequest) {
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

export function logBridgeExitCodes(message: string, exitCode: string): string {
  return constants.EXIT_CODE_MAP.has(exitCode)
    ? "Exit Code: " + exitCode + " " + constants.EXIT_CODE_MAP.get(exitCode)
    : "Undefined error from extension: " + message + constants.SPACE + "999";
}

run().catch((error) => {
  if (error.message != undefined) {
    taskLib.error(error.message);
    const isReturnStatus = parseToBoolean(inputs.RETURN_STATUS);
    const status = error.message.trim().split(" ").pop() || "";
    if (isReturnStatus) {
      console.log(
        `##vso[task.setvariable variable=status;isoutput=true]${status}`
      );
    }
    taskLib.setResult(
      taskLib.TaskResult.Failed,
      isReturnStatus
        ? "Workflow failed! ".concat(logBridgeExitCodes(error.message, status))
        : "Workflow failed!"
    );
  }
});
