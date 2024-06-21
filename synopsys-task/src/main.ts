import {
  getMappedTaskResult,
  getTempDir,
  getWorkSpaceDirectory,
  IS_PR_EVENT,
  parseToBoolean,
} from "./synopsys-task/utility";
import { SynopsysBridge } from "./synopsys-task/synopsys-bridge";
import * as taskLib from "azure-pipelines-task-lib/task";
import { TaskResult } from "azure-pipelines-task-lib/task";
import * as constants from "./synopsys-task/application-constant";
import * as inputs from "./synopsys-task/input";
import { showLogForDeprecatedInputs } from "./synopsys-task/input";
import {
  uploadDiagnostics,
  uploadSarifResultAsArtifact,
} from "./synopsys-task/diagnostics";
import { AzurePrResponse } from "./synopsys-task/model/azure";
import { ErrorCode } from "./synopsys-task/enum/ErrorCodes";

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
    const result: number = await sb.executeBridgeCommand(
      bridgePath,
      getWorkSpaceDirectory(),
      command
    );
    console.log("Result ==============: ", result);
    // The statement set the exit code in the 'status' variable which can be used in the YAML file
    if (parseToBoolean(inputs.RETURN_STATUS)) {
      console.log(
        `##vso[task.setvariable variable=status;isoutput=true]${result}`
      );
    }
  } catch (error: any) {
    throw error;
  } finally {
    if (parseToBoolean(inputs.BLACKDUCK_REPORTS_SARIF_CREATE)) {
      if (!IS_PR_EVENT) {
        console.log("BLACKDUCK_REPORTS_SARIF_CREATE is enabled");
        uploadSarifResultAsArtifact(
          constants.DEFAULT_BLACKDUCK_SARIF_GENERATOR_DIRECTORY,
          inputs.BLACKDUCK_REPORTS_SARIF_FILE_PATH
        );
      }
    }

    if (parseToBoolean(inputs.POLARIS_REPORTS_SARIF_CREATE)) {
      if (!IS_PR_EVENT) {
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

function markBuildStatusIfIssuesArePresent(
  status: string,
  taskResult: TaskResult,
  errorMessage: string,
  isReturnStatusEnabled: boolean
) {
  if (status == ErrorCode.BRIDGE_BREAK_ENABLED.toString()) {
    console.log(
      `Marking build status as ${taskResult} since issues are present`
    );
    if (taskResult === TaskResult.Failed) {
      taskLib.setResult(
        taskLib.TaskResult.Failed,
        isReturnStatusEnabled
          ? "Workflow failed! ".concat(logExitCodes(errorMessage, status))
          : "Workflow failed! ".concat(errorMessage)
      );
    } else {
      taskLib.setResult(
        taskResult,
        "Marked build status as ".concat(taskResult.toString())
      );
    }
  } else {
    console.log(
      `Marking build status as ${taskResult} is ignored since exit code is: ${status}`
    );
  }
}

run().catch((error) => {
  if (error.message != undefined) {
    const isReturnStatusEnabled = parseToBoolean(inputs.RETURN_STATUS);
    const status = getStatusFromError(error);

    // The statement set the exit code in the 'status' variable which can be used in the YAML file
    if (isReturnStatusEnabled) {
      console.log(
        `##vso[task.setvariable variable=status;isoutput=true]${status}`
      );
    }

    taskLib.error(error.message);

    const taskResult: TaskResult | undefined = getMappedTaskResult(
      inputs.MARK_BUILD_STATUS
    );

    if (taskResult) {
      markBuildStatusIfIssuesArePresent(
        status,
        taskResult,
        error.message,
        isReturnStatusEnabled
      );
    } else {
      taskLib.setResult(
        taskLib.TaskResult.Failed,
        isReturnStatusEnabled
          ? "Workflow failed! ".concat(logExitCodes(error.message, status))
          : "Workflow failed! ".concat(error.message)
      );
    }
  }
});
