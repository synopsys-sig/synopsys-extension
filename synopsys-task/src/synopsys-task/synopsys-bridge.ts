import * as path from "path";
import * as taskLib from "azure-pipelines-task-lib/task";
import * as toolLib from "azure-pipelines-tool-lib";

import {
  SYNOPSYS_BRIDGE_DEFAULT_PATH_LINUX,
  SYNOPSYS_BRIDGE_DEFAULT_PATH_MAC,
  SYNOPSYS_BRIDGE_DEFAULT_PATH_WINDOWS,
} from "./application-constants";

import { SynopsysToolsParameter } from "./tools-parameter";
import {
  validatePolarisInputs,
  validateScanTypes,
  validateBridgeUrl,
} from "./validators";

import * as constants from "./application-constants";

import * as inputs from "./inputs";
import {
  DownloadFileResponse,
  extractZipped,
  getRemoteFile,
} from "./utility/utility";
import DomParser from "dom-parser";
import fs from "fs";

export class SynopsysBridge {
  bridgeExecutablePath: string;
  bridgeArtifactoryURL: string;
  bridgeUrlPattern: string;
  WINDOWS_PLATFORM = "win64";
  LINUX_PLATFORM = "linux64";
  MAC_PLATFORM = "macosx";

  constructor() {
    this.bridgeExecutablePath = "";
    this.bridgeArtifactoryURL =
      "https://sig-repo.synopsys.com/artifactory/bds-integrations-release/com/synopsys/integration/synopsys-bridge/";
    this.bridgeUrlPattern = this.bridgeArtifactoryURL.concat(
      "/$version/synopsys-bridge-$version-$platform.zip "
    );
  }

  private getBridgeDefaultPath(): string {
    let bridgeDefaultPath = "";
    const osName = process.platform;

    if (osName === "darwin") {
      bridgeDefaultPath = path.join(
        process.env["HOME"] as string,
        SYNOPSYS_BRIDGE_DEFAULT_PATH_MAC
      );
    } else if (osName === "linux") {
      bridgeDefaultPath = path.join(
        process.env["HOME"] as string,
        SYNOPSYS_BRIDGE_DEFAULT_PATH_LINUX
      );
    } else if (osName === "win32") {
      bridgeDefaultPath = path.join(
        process.env["USERPROFILE"] as string,
        SYNOPSYS_BRIDGE_DEFAULT_PATH_WINDOWS
      );
    }
    taskLib.debug("bridgeDefaultPath:" + bridgeDefaultPath);
    return bridgeDefaultPath;
  }

  async extractBridge(fileInfo: DownloadFileResponse): Promise<string> {
    const extractZippedFilePath: string =
      inputs.SYNOPSYS_BRIDGE_PATH || this.getBridgeDefaultPath();

    // Clear the existing bridge, if available
    if (fs.existsSync(extractZippedFilePath)) {
      await taskLib.rmRF(extractZippedFilePath);
    }

    await extractZipped(path.join(fileInfo.filePath), extractZippedFilePath);

    return Promise.resolve(extractZippedFilePath);
  }

  async executeBridgeCommand(
    executablePath: string,
    workspace: string,
    command: string
  ): Promise<number> {
    const osName: string = process.platform;
    let executable: string = "";
    taskLib.debug("extractedPath:" + executablePath);

    if (osName === "darwin" || osName === "linux") {
      executable = path.join(
        executablePath,
        constants.SYNOPSYS_BRIDGE_EXECUTABLE_MAC_LINUX
      );
    } else if (osName === "win32") {
      executable = path.join(
        executablePath,
        constants.SYNOPSYS_BRIDGE_EXECUTABLE_WINDOWS
      );
    }

    try {
      return await taskLib.exec(executable, command, { cwd: workspace });
    } catch (errorObject) {
      taskLib.debug("errorObject:" + errorObject);
      throw errorObject;
    }
    return -1;
  }

  async prepareCommand(tempDir: string): Promise<string> {
    try {
      let formattedCommand = "";
      const invalidParams: string[] = validateScanTypes();

      if (invalidParams.length === 3) {
        return Promise.reject(
          new Error(
            "Requires at least one scan type: ("
              .concat(constants.POLARIS_SERVER_URL_KEY)
              .concat(")")
          )
        );
      }

      // validating and preparing command for polaris
      const polarisErrors: string[] = validatePolarisInputs();
      if (polarisErrors.length === 0 && inputs.POLARIS_SERVER_URL) {
        const polarisCommandFormatter = new SynopsysToolsParameter(tempDir);
        formattedCommand = formattedCommand.concat(
          polarisCommandFormatter.getFormattedCommandForPolaris()
        );
      }

      let validationErrors: string[] = [];
      validationErrors = validationErrors.concat(polarisErrors);

      if (formattedCommand.length === 0) {
        return Promise.reject(new Error(validationErrors.join(",")));
      }

      if (validationErrors.length > 0) {
        console.log(new Error(validationErrors.join(",")));
      }

      console.log("Formatted command is - ".concat(formattedCommand));
      return formattedCommand;
    } catch (e) {
      const errorObject = e as Error;
      taskLib.debug(
        errorObject.stack === undefined ? "" : errorObject.stack.toString()
      );
      return Promise.reject(errorObject.message);
    }
  }

  async downloadBridge(tempDir: string): Promise<DownloadFileResponse> {
    try {
      let bridgeUrl: string = "";
      if (inputs.BRIDGE_DOWNLOAD_URL) {
        console.log("Downloading and configuring Synopsys Bridge");
        console.log("Bridge URL is - ".concat(bridgeUrl));
        bridgeUrl = inputs.BRIDGE_DOWNLOAD_URL;

        if (!validateBridgeUrl(bridgeUrl)) {
          return Promise.reject(new Error("Invalid URL"));
        }
      } else {
        // TODO: Download bridge latest version
      }
      const downloadBridge: DownloadFileResponse = await getRemoteFile(
        tempDir,
        bridgeUrl
      );
      return Promise.resolve(downloadBridge);
    } catch (error) {
      taskLib.debug("error:" + error);
      return Promise.reject(new Error("Bridge could not be downloaded"));
    }

    console.log("Download of Synopsys Bridge completed");
  }
}
