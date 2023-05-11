import * as taskLib from "azure-pipelines-task-lib/task";
import * as constants from "./application-constant";

export async function uploadDiagnostics(workspaceDir: string) {
  const uploadArtifactPath = workspaceDir.concat(getBridgeDiagnosticsFolder());
  await taskLib.uploadArtifact(
    constants.UPLOAD_ARTIFACT_NAEME,
    uploadArtifactPath,
    constants.UPLOAD_ARTIFACT_NAEME
  );
}

function getBridgeDiagnosticsFolder(): string {
  if (process.platform === "win32") {
    return "\\.bridge";
  } else {
    return "/.bridge";
  }
}
