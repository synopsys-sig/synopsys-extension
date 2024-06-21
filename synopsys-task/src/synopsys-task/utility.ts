import path from "path";
import * as constants from "./application-constant";
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
import { TaskResult } from "azure-pipelines-task-lib/task";
import {
  AZURE_BUILD_REASON,
  AZURE_ENVIRONMENT_VARIABLES,
  AzurePrResponse,
} from "./model/azure";
import { ErrorCode } from "./enum/ErrorCodes";
import { BuildStatus } from "./enum/BuildStatus";

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
    return Promise.reject(
      new Error(
        "File does not exist"
          .concat(constants.SPACE)
          .concat(ErrorCode.FILE_DOES_NOT_EXIST.toString())
      )
    );
  }

  // Extract file name from file with full path
  if (destinationPath == null || destinationPath.length === 0) {
    return Promise.reject(
      new Error(
        "No destination directory found"
          .concat(constants.SPACE)
          .concat(ErrorCode.NO_DESTINATION_DIRECTORY.toString())
      )
    );
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
    return Promise.reject(
      new Error(
        "URL cannot be empty"
          .concat(constants.SPACE)
          .concat(ErrorCode.SYNOPSYS_BRIDGE_URL_CANNOT_BE_EMPTY.toString())
      )
    );
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
        !NON_RETRY_HTTP_CODES.has(Number(getStatusCode(error.message))) ||
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
  return Promise.reject(
    "Synopsys bridge download has been failed"
      .concat(constants.SPACE)
      .concat(ErrorCode.SYNOPSYS_BRIDGE_DOWNLOAD_FAILED.toString())
  );
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

export function isBoolean(value: string | boolean | undefined): boolean {
  if (
    value !== undefined &&
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
    throw new Error(
      "Workspace directory could not be located"
        .concat(constants.SPACE)
        .concat(ErrorCode.WORKSPACE_DIRECTORY_NOT_FOUND.toString())
    );
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

// Global variable to check PR events for uploading SARIF files in main.ts, reducing the need for current code refactoring
export let IS_PR_EVENT = false;

export function isPullRequestEvent(
  azurePrResponse: AzurePrResponse | undefined
): boolean {
  const buildReason =
    taskLib.getVariable(AZURE_ENVIRONMENT_VARIABLES.AZURE_BUILD_REASON) || "";
  IS_PR_EVENT =
    buildReason === AZURE_BUILD_REASON.PULL_REQUEST ||
    (azurePrResponse?.pullRequestId !== undefined &&
      azurePrResponse.pullRequestId > 0);
  return IS_PR_EVENT;
}

export function extractBranchName(branchName: string): string {
  const prefix = "refs/heads/";

  if (!branchName.startsWith(prefix)) {
    return branchName;
  }

  return branchName.substring(prefix.length);
}

export function getStatusCode(str: string) {
  const words = str.split(" ");
  return words.length < 2 ? str : words[words.length - 2];
}

export function equalsIgnoreCase(a: string, b: string): boolean {
  return a.toLowerCase() === b.toLowerCase();
}

export function getMappedTaskResult(
  buildStatus: string
): TaskResult | undefined {
  if (equalsIgnoreCase(buildStatus, BuildStatus.Succeeded)) {
    return TaskResult.Succeeded;
  } else if (equalsIgnoreCase(buildStatus, BuildStatus.SucceededWithIssues)) {
    return TaskResult.SucceededWithIssues;
  } else if (equalsIgnoreCase(buildStatus, BuildStatus.Failed)) {
    return TaskResult.Failed;
  } else {
    return undefined;
  }
}
