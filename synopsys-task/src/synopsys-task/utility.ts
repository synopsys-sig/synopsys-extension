import path from "path";
import { SYNOPSYS_BRIDGE_ZIP_FILE_NAME } from "./application-constant";
import * as toolLib from "azure-pipelines-tool-lib";
import * as process from "process";
import { DownloadFileResponse } from "./model/download-file-response";
import * as taskLib from "azure-pipelines-task-lib/task";
import { setTimeout } from "timers/promises";
import { RETRY_COUNT } from "./input";

export function cleanUrl(url: string): string {
  if (url && url.endsWith("/")) {
    return url.slice(0, url.length - 1);
  }
  return url;
}

export function getTempDir(): string {
  return process.env["AGENT_TEMPDIRECTORY"] || "";
}

export async function extractZipped(
  file: string,
  destinationPath: string
): Promise<boolean> {
  if (file == null || file.length === 0) {
    return Promise.reject(new Error("File does not exist"));
  }

  //Extract file name from file with full path
  if (destinationPath == null || destinationPath.length === 0) {
    return Promise.reject(new Error("No destination directory found"));
  }

  try {
    await toolLib.extractZip(file, destinationPath);
    return Promise.resolve(true);
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function getRemoteFile(
  destFilePath: string,
  url: string
): Promise<DownloadFileResponse> {
  if (url == null || url.length === 0) {
    return Promise.reject(new Error("URL cannot be empty"));
  }

  let fileNameFromUrl = "";
  if (taskLib.stats(destFilePath).isDirectory()) {
    fileNameFromUrl = url.substring(url.lastIndexOf("/") + 1);
    destFilePath = path.join(
      destFilePath,
      fileNameFromUrl || SYNOPSYS_BRIDGE_ZIP_FILE_NAME
    );
  }

  let retryCount = Number(RETRY_COUNT);
  let downloadStatus = false;
  while (retryCount > 0 && !downloadStatus) {
    try {
      const toolPath = await toolLib.downloadTool(url, destFilePath);
      const downloadFileResp: DownloadFileResponse = {
        filePath: toolPath,
        fileName: fileNameFromUrl,
      };
      downloadStatus = true;
      return Promise.resolve(downloadFileResp);
    } catch (error) {
      await setTimeout(2500);
      retryCount--;
      console.warn(
        "Synopsys bridge download has been failed, retries left: " + retryCount
      );
    }
  }
  return Promise.reject("Synopsys bridge download has been failed");
}

export function parseToBoolean(value: string | boolean): boolean {
  if (
    value !== null &&
    value !== "" &&
    (value.toString().toLowerCase() === "true" || value === true)
  ) {
    return true;
  }
  return false;
}

export function getWorkSpaceDirectory(): string {
  const repoLocalPath: string | undefined =
    process.env["BUILD_REPOSITORY_LOCALPATH"];

  if (repoLocalPath !== undefined) {
    return repoLocalPath;
  } else {
    throw new Error("Workspace directory could not be located");
  }
}
