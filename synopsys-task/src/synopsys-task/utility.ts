import path from "path";
import {
  NON_RETRY_HTTP_CODES,
  RETRY_COUNT,
  RETRY_DELAY_IN_MILLISECONDS,
  SYNOPSYS_BRIDGE_ZIP_FILE_NAME,
} from "./application-constant";
import * as toolLib from "azure-pipelines-tool-lib";
import * as toolLibLocal from "../synopsys-task/download-tool";
import * as process from "process";
import { DownloadFileResponse } from "./model/download-file-response";
import * as taskLib from "azure-pipelines-task-lib/task";
import * as constants from "./application-constant";
import { AZURE_BUILD_REASON, AZURE_ENVIRONMENT_VARIABLES } from "./model/azure";

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

  let retryCountLocal = RETRY_COUNT;
  let retryDelay = RETRY_DELAY_IN_MILLISECONDS;
  do {
    try {
      const toolPath = await toolLibLocal.downloadTool(url, destFilePath);
      return {
        filePath: toolPath,
        fileName: fileNameFromUrl,
      };
    } catch (err) {
      const error = err as Error;
      if (retryCountLocal == 0) {
        throw error;
      }

      if (
        !NON_RETRY_HTTP_CODES.has(Number(error.message)) ||
        error.message.includes("did not match downloaded file size")
      ) {
        console.info(
          "Synopsys Bridge download has been failed, Retries left: "
            .concat(String(retryCountLocal))
            .concat(", Waiting: ")
            .concat(String(retryDelay / 1000))
            .concat(" Seconds")
        );
        await sleep(retryDelay);
        retryDelay = retryDelay * 2;
        retryCountLocal--;
      } else {
        retryCountLocal = 0;
      }
    }
  } while (retryCountLocal >= 0);
  return Promise.reject("Synopsys bridge download has been failed");
}

export function parseToBoolean(value: string | boolean | undefined): boolean {
  if (
    value &&
    value !== "" &&
    (value.toString().toLowerCase() === "true" || value === true)
  ) {
    return true;
  }
  return false;
}

export function isBoolean(value: string | boolean): boolean {
  if (
    value !== null &&
    value !== "" &&
    (value.toString().toLowerCase() === "true" ||
      value === true ||
      value.toString().toLowerCase() === "false" ||
      value === false)
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

export function getDefaultSarifReportPath(
  sarifReportDirectory: string,
  appendFilePath: boolean
): string {
  const pwd = getWorkSpaceDirectory();
  return !appendFilePath
    ? path.join(pwd, constants.BRIDGE_LOCAL_DIRECTORY, sarifReportDirectory)
    : path.join(
        pwd,
        constants.BRIDGE_LOCAL_DIRECTORY,
        sarifReportDirectory,
        constants.SARIF_DEFAULT_FILE_NAME
      );
}

export function filterEmptyData(data: object) {
  return JSON.parse(JSON.stringify(data), (key, value) =>
    value === null ||
    value === "" ||
    value === 0 ||
    value.length === 0 ||
    (typeof value === "object" && Object.keys(value).length === 0)
      ? undefined
      : value
  );
}

export function isPullRequestEvent(): boolean {
  const buildReason =
    taskLib.getVariable(AZURE_ENVIRONMENT_VARIABLES.AZURE_BUILD_REASON) || "";
  return buildReason === AZURE_BUILD_REASON.PULL_REQUEST;
}
