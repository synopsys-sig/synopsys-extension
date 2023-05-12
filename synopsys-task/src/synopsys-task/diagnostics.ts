import * as taskLib from "azure-pipelines-task-lib/task";
import * as constants from "./application-constant";

export async function uploadDiagnostics(workspaceDir: string) {
  try {
    const uploadArtifactPath = workspaceDir.concat(getBridgeDiagnosticsFolder());
    let isBridgeDirectoryExists = false;
    isBridgeDirectoryExists = taskLib.exist(uploadArtifactPath);
    if (isBridgeDirectoryExists) {
      await taskLib.uploadArtifact(
        constants.UPLOAD_ARTIFACT_NAEME,
        uploadArtifactPath,
        constants.UPLOAD_ARTIFACT_NAEME
      );
    }
  } catch (error) {
    throw(error)
  }
  
}

function getBridgeDiagnosticsFolder(): string {
  if (process.platform === "win32") {
    return "\\.bridge";
  } else {
    return "/.bridge";
  }
}
