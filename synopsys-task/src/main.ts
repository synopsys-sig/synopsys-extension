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
import { ErrorCode } from "./synopsys-task/enum/ErrorCodes";
import { BuildStatus } from "./synopsys-task/enum/BuildStatus";
import { equalsIgnoreCase } from "./synopsys-task/utility";

export async function run() {
  console.log("Synopsys Task started...");
  const tempDir = getTempDir();
  taskLib.debug(`tempDir: ${tempDir}`);
  const workSpaceDir = getWorkSpaceDirectory();
  taskLib.debug(`workSpaceDir: ${workSpaceDir}`);
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
    const result: number = await sb.executeBridgeCommand(
      bridgePath,
      getWorkSpaceDirectory(),
      command
    );
    // The statement set the exit code in the 'status' variable which can be used in the YAML file
    if (parseToBoolean(inputs.RETURN_STATUS)) {
      console.log(
        `##vso[task.setvariable variable=status;isoutput=true]${result}`
      );
    }

    if (result == ErrorCode.BRIDGE_BREAK_ENABLED) {
      if (equalsIgnoreCase(inputs.MARK_BUILD_STATUS, BuildStatus.Failed)) {
        taskLib.setResult(
          taskLib.TaskResult.Failed,
          "Marked the build as Failed"
        );
      } else if (
        equalsIgnoreCase(
          inputs.MARK_BUILD_STATUS,
          BuildStatus.SucceededWithIssues
        )
      ) {
        taskLib.setResult(
          taskLib.TaskResult.SucceededWithIssues,
          "Marked the build as SucceededWithIssues"
        );
      } else if (
        equalsIgnoreCase(inputs.MARK_BUILD_STATUS, BuildStatus.Succeeded)
      ) {
        taskLib.setResult(taskLib.TaskResult.Succeeded, "Marked the build as Succeeded");
      }
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

export function logExitCodes(message: string, exitCode: string): string {
  return constants.EXIT_CODE_MAP.has(exitCode)
    ? "Exit Code: " + exitCode + " " + constants.EXIT_CODE_MAP.get(exitCode)
    : "Undefined error from extension: "
        .concat(message)
        .concat(constants.SPACE)
        .concat(ErrorCode.UNDEFINED_ERROR_FROM_EXTENSION.toString());
}

export function getStatusFromError(errorObject: Error): string {
  return errorObject.message.trim().split(" ").pop() || "";
}

run().catch((error) => {
  if (error.message != undefined) {
    taskLib.error(error.message);
    const isReturnStatusEnabled = parseToBoolean(inputs.RETURN_STATUS);
    const status = getStatusFromError(error);

    // The statement set the exit code in the 'status' variable which can be used in the YAML file
    if (isReturnStatusEnabled) {
      console.log(
        `##vso[task.setvariable variable=status;isoutput=true]${status}`
      );
    }
    taskLib.setResult(
      taskLib.TaskResult.Failed,
      isReturnStatusEnabled
        ? "Workflow failed! ".concat(logExitCodes(error.message, status))
        : "Workflow failed!"
    );
  }
});
