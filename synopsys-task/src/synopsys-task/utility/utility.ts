import * as fs from "fs";
import * as os from "os";
import path from "path";
import {
  APPLICATION_NAME,
  SYNOPSYS_BRIDGE_ZIP_FILE_NAME,
} from "../application-constants";
import * as toolLib from "azure-pipelines-tool-lib";
import * as taskLib from "azure-pipelines-task-lib/task";
import { validateBridgeUrl } from "../validators";
import * as process from "process";
var https = require("https");

export function cleanUrl(url: string): string {
  if (url && url.endsWith("/")) {
    return url.slice(0, url.length - 1);
  }
  return url;
}

export function getTempDir(): string {
  return process.env["AGENT_TEMPDIRECTORY"] || "";
}

export interface DownloadFileResponse {
  filePath: string;
  fileName: string;
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
    Promise.reject(new Error("URL cannot be empty"));
  }

  if (!validateBridgeUrl(url)) {
    return Promise.reject(new Error("Invalid URL"));
  }

  try {
    let fileNameFromUrl = "";
    if (fs.lstatSync(destFilePath).isDirectory()) {
      fileNameFromUrl = url.substring(url.lastIndexOf("/") + 1);
      destFilePath = path.join(
        destFilePath,
        fileNameFromUrl || SYNOPSYS_BRIDGE_ZIP_FILE_NAME
      );
    }

    const toolPath = await toolLib.downloadTool(url, destFilePath);
    const downloadFileResp: DownloadFileResponse = {
      filePath: toolPath,
      fileName: fileNameFromUrl,
    };

    return Promise.resolve(downloadFileResp);
  } catch (error) {
    throw error;
  }
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
