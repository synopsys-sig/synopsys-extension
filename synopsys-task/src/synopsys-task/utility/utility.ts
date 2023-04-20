import * as fs from "fs";
import * as os from "os";
import path from "path";
import { APPLICATION_NAME } from "../application-constants";
import * as toolLib from "azure-pipelines-tool-lib";
import * as taskLib from "azure-pipelines-task-lib/task";
import { validateBridgeUrl } from "../validators";
var https = require("https");

export function cleanUrl(url: string): string {
  if (url && url.endsWith("/")) {
    return url.slice(0, url.length - 1);
  }
  return url;
}

export async function createTempDir(): Promise<string> {
  const appPrefix = APPLICATION_NAME;

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), appPrefix));
  taskLib.debug("tempDir::::::::::::::::::tempDir" + tempDir);

  return tempDir;
}

export interface DownloadFileResponse {
  filePath: string;
  fileName: string;
}

export async function downloadBridgeFromURL(
  destFilePath: string,
  url: string
): Promise<DownloadFileResponse> {
  return new Promise((resolve, reject) => {
    let downloadFileResp: DownloadFileResponse = {
      filePath: "",
      fileName: "",
    };

    let fileNameFromUrl = "";
    taskLib.debug("url:" + url);
    if (fs.lstatSync(destFilePath).isDirectory()) {
      fileNameFromUrl = url.substring(url.lastIndexOf("/") + 1);
      destFilePath = path.join(destFilePath, fileNameFromUrl || "bridge.zip");
      taskLib.debug("destFilePath:" + destFilePath);
      taskLib.debug("fileNameFromUrl:" + fileNameFromUrl);
    }
    const file = fs.createWriteStream(destFilePath);

    const request = https.get(url, (response: any) => {
      if (response.statusCode !== 200) {
        fs.unlink(destFilePath, () => {
          reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        });
        return;
      }
      downloadFileResp = {
        filePath: destFilePath,
        fileName: fileNameFromUrl,
      };
      response.pipe(file);
    });

    // The destination stream is ended by the time it's called
    file.on("finish", () => resolve(downloadFileResp));

    request.on("error", (err: any) => {
      fs.unlink(destFilePath, () => reject(err));
    });

    file.on("error", (err) => {
      fs.unlink(destFilePath, () => reject(err));
    });

    request.end();
  });
}

export function getRemoteFile(
  destFilePath: string,
  url: string,
  extractedZipPath: string
): Promise<DownloadFileResponse> {
  if (url == null || url.length === 0) {
    throw new Error("URL cannot be empty");
  }

  let tempDir = destFilePath;
  if (!validateBridgeUrl(url)) {
    throw new Error("Invalid URL");
  }

  try {
    let fileNameFromUrl = "";
    if (fs.lstatSync(destFilePath).isDirectory()) {
      fileNameFromUrl = url.substring(url.lastIndexOf("/") + 1);
      destFilePath = path.join(destFilePath, fileNameFromUrl || "bridge.zip");
    }
    taskLib.debug("destfilePath:::" + destFilePath);
    const fileWriteStream = fs.createWriteStream(destFilePath);
    const downloadFileResp: DownloadFileResponse = {
      filePath: destFilePath,
      fileName: fileNameFromUrl,
    };
    const toolPath = https.get(url, function (response: any) {
      response.pipe(fileWriteStream);
      taskLib.debug("Downloading.............................");
      // after download completed close filestream
      fileWriteStream.on("finish", () => {
        taskLib.debug("Download Completed");
        fileWriteStream.close();
        taskLib.debug(
          "extractZippedFilePath::::::::::-------------" + extractedZipPath
        );
        extractZipped(destFilePath, extractedZipPath, tempDir);
      });
    });

    taskLib.debug("Downloading............................." + toolPath);
    taskLib.debug(
      "Downloading............................." + downloadFileResp
    );
    return Promise.resolve(downloadFileResp);
  } catch (error) {
    throw error;
  }
}

export function extractZipped(
  zippedfilepath: string,
  destinationPath: string,
  tempDir: string
): Promise<boolean> {
  taskLib.debug("Extraction started");
  taskLib.debug("zippedfilepath:" + zippedfilepath);
  taskLib.debug("Extraction started:destinationPath" + destinationPath);
  if (zippedfilepath == null || zippedfilepath.length === 0) {
    return Promise.reject(new Error("File does not exist"));
  }

  //Extract file name from file with full path
  if (destinationPath == null || destinationPath.length === 0) {
    return Promise.reject(new Error("No destination directory found"));
  }
  taskLib.debug("Extraction started");
  try {
    toolLib.extractZip(zippedfilepath, destinationPath).then(
      (value) => {
        taskLib.debug("Success::::::::" + value); // Success!
        taskLib.debug("Extraction DONE.");
        fs.readdir(destinationPath, (err, files) => {
          files.forEach((file) => {
            taskLib.debug("filesname::::::::::" + file);

            const osName: string = process.platform;
            if (osName === "darwin" || osName === "linux") {
              try {
                taskLib.debug("bridgeExecutablePath:" + "/synopsys-bridge");
                taskLib.exec(destinationPath + "/synopsys-bridge", "--help");
              } catch (errorObject) {
                throw errorObject;
              }
            } else if (osName === "win32") {
              try {
                taskLib.debug("bridgeExecutablePath:" + "/synopsys-bridge");
                taskLib.exec(destinationPath + "synopsys-bridge.exe", "--help");
              } catch (errorObject) {
                throw errorObject;
              }
            }
          });
          cleanupTempDir(tempDir);
          try {
            fs.statSync(tempDir);
            taskLib.debug("file or directory exists");
          } catch (err) {
            //if (err.code === 'ENOENT') {
            taskLib.error("file or directory does not exist");
            //}
          }
        });
      },
      (reason) => {
        taskLib.error("reason" + reason);
      }
    );

    return Promise.resolve(true);
  } catch (error) {
    taskLib.debug("error:" + taskLib.debug("Extraction complete."));
    return Promise.reject(error);
  }
}

export async function cleanupTempDir(tempDir: string): Promise<void> {
  taskLib.debug("cleaning up tempDir:" + tempDir);
  if (tempDir && fs.existsSync(tempDir)) {
    await taskLib.rmRF(tempDir);
  }
}

export function checkIfGithubHostedAndLinux(): boolean {
  return (
    String(process.env["RUNNER_NAME"]).includes("Hosted Agent") &&
    (process.platform === "linux" || process.platform === "darwin")
  );
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
