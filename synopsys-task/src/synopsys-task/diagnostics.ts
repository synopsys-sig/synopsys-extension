import * as taskLib from "azure-pipelines-task-lib/task";
import * as constants from "./application-constant";
import * as path from "path";

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
