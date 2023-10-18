import * as taskLib from "azure-pipelines-task-lib/task";
import * as constants from "./application-constant";
import * as path from "path";
import * as inputs from "./input";
import { SARIF_UPLOAD_FOLDER_ARTIFACT_NAME } from "./application-constant";

export function uploadDiagnostics(workspaceDir: string) {
  const uploadArtifactPath = path.join(
    workspaceDir,
    constants.BRIDGE_DIAGNOSTICS_FOLDER
  );
  let isBridgeDirectoryExists = false;
  isBridgeDirectoryExists = taskLib.exist(uploadArtifactPath);
  if (isBridgeDirectoryExists) {
    taskLib.uploadArtifact(
      constants.UPLOAD_FOLDER_ARTIFACT_NAME,
      uploadArtifactPath,
      constants.UPLOAD_FOLDER_ARTIFACT_NAME
    );
  }
}

export function uploadSarifResultAsArtifact(workspaceDir: string) {
  const uploadArtifactPath = inputs.REPORTS_SARIF_FILE_PATH.trim()
    ? inputs.REPORTS_SARIF_FILE_PATH.trim()
    : path.join(
        workspaceDir,
        constants.BRIDGE_DIAGNOSTICS_FOLDER,
        constants.BRIDGE_SARIF_GENERATOR_FOLDER
      );
  console.log("uploadSarifResultAsArtifact :: start");
  let isBridgeDirectoryExists = false;
  isBridgeDirectoryExists = taskLib.exist(uploadArtifactPath);
  console.log("isBridgeDirectoryExists ::" + isBridgeDirectoryExists);
  if (isBridgeDirectoryExists) {
    taskLib.uploadArtifact(
      constants.SARIF_UPLOAD_FOLDER_ARTIFACT_NAME,
      uploadArtifactPath,
      constants.SARIF_UPLOAD_FOLDER_ARTIFACT_NAME
    );
  }
  console.log("uploadSarifResultAsArtifact :: end");
}
