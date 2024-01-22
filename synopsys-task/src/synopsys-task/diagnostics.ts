import * as taskLib from "azure-pipelines-task-lib/task";
import * as constants from "./application-constant";
import * as path from "path";
import * as inputs from "./input";
import { getDefaultSarifReportPath } from "./utility";

export function uploadDiagnostics(workspaceDir: string) {
  const uploadArtifactPath = path.join(
    workspaceDir,
    constants.BRIDGE_LOCAL_DIRECTORY
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

export function uploadSarifResultAsArtifact(
  defaultSarifReportDirectory: string,
  userSarifFilePath: string
) {
  const sarifFilePath = userSarifFilePath
    ? userSarifFilePath
    : getDefaultSarifReportPath(defaultSarifReportDirectory, true);

  console.log("uploadSarifResultAsArtifact :: start");
  let isSarifReportDirectoryExists = false;
  isSarifReportDirectoryExists = taskLib.exist(sarifFilePath);
  console.log("isBridgeDirectoryExists ::" + isSarifReportDirectoryExists);
  if (isSarifReportDirectoryExists) {
    taskLib.uploadArtifact(
      constants.SARIF_UPLOAD_FOLDER_ARTIFACT_NAME,
      sarifFilePath,
      constants.SARIF_UPLOAD_FOLDER_ARTIFACT_NAME
    );
  }
  console.log("uploadSarifResultAsArtifact :: end");
}
