import path from "path";
import {
  NON_RETRY_HTTP_CODES,
  RETRY_COUNT,
  RETRY_DELAY,
  SYNOPSYS_BRIDGE_ZIP_FILE_NAME,
} from "./application-constant";
import * as toolLib from "azure-pipelines-tool-lib";
import * as process from "process";
import { DownloadFileResponse } from "./model/download-file-response";
import * as taskLib from "azure-pipelines-task-lib/task";

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

  // Extract file name from file with full path
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

  let retryCount = RETRY_COUNT;
  do {
    try {
      const toolPath = await toolLib.downloadTool(url, destFilePath);
      return {
        filePath: toolPath,
        fileName: fileNameFromUrl,
      };
    } catch (error: any) {
      if (retryCount == 0) {
        throw error;
      }
      const retry: boolean = await checkRetry(error["httpStatusCode"]);
      if (retry) {
        await sleep(RETRY_DELAY);
        retryCount--;
        console.info(
          "Synopsys bridge download has been failed, retries left: " +
            retryCount
        );
      } else {
        retryCount = 0;
      }
    }
  } while (retryCount >= 0);
  return Promise.reject("Synopsys bridge download has been failed");
}

export async function checkRetry(
  httpStatusCode: number | undefined
): Promise<boolean> {
  const retryHttpCodes: string[] = NON_RETRY_HTTP_CODES.split(",");
  if (
    httpStatusCode != undefined &&
    retryHttpCodes.find((e) => e === String(httpStatusCode)) == undefined
  ) {
    return true;
  }
  return false;
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

export function sleep(duration: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}
