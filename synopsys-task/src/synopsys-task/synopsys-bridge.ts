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
} from "./validators";

import * as constants from "./application-constants";

import * as inputs from "./inputs";
import { downloadBridgeFromURL, cleanupTempDir } from "./utility/utility";
import DomParser from "dom-parser";

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

  async extractBridge(tempDir: string): Promise<string> {
    const bridgeDefaultPath = this.getBridgeDefaultPath();
    const extractzip: any = await toolLib.extractZip(
      tempDir,
      bridgeDefaultPath
    );
    taskLib.debug("extractzip" + extractzip);

    return Promise.resolve(bridgeDefaultPath);
  }

  async executeBridgeCommand(extractedPath: any): Promise<number> {
    const osName: string = process.platform;
    if (osName === "darwin" || osName === "linux" || osName === "win32") {
      try {
        taskLib.debug("extractedPath:" + extractedPath);
        taskLib.filePathSupplied(extractedPath);
        //  console.log("path.join(extractedPath, " + path.join(extractedPath, "synopsys-bridge"))
        // taskLib.which(path.join(extractedPath, "synopsys-bridge"),true)
        return taskLib.exec(
          path.join(extractedPath, "synopsys-bridge"),
          "--help"
        );
      } catch (errorObject) {
        taskLib.error("errorObject:" + errorObject);
        throw errorObject;
      }
    }
    return -1;
  }

  async prepareCommand(tempDir: string): Promise<string> {
    try {
      let formattedCommand = "";
      const invalidParams: string[] = validateScanTypes();
      const polarisCommandFormatter = new SynopsysToolsParameter(tempDir);
      formattedCommand = formattedCommand.concat(
          polarisCommandFormatter.getFormattedCommandForPolaris()
      );

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
      console.log(
          errorObject.stack === undefined ? "" : errorObject.stack.toString()
      );
      return Promise.reject(errorObject.message);
    } finally {
      await cleanupTempDir(tempDir);
    }
  }

  async downloadBridge(tempDir: string) {
    try {
      taskLib.debug("downloadBridge:::" + tempDir);
      let bridgeUrl = "";
      let bridgeVersion = "";
      //const BRIDGE_DOWNLOAD_VERSION = inputs.BRIDGE_DOWNLOAD_VERSION !== undefined ? inputs.BRIDGE_DOWNLOAD_VERSION : "";
      bridgeUrl =
        inputs.BRIDGE_DOWNLOAD_URL !== undefined
          ? inputs.BRIDGE_DOWNLOAD_URL
          : "";
      taskLib.debug("BRIDGE_DOWNLOAD_URL:::" + bridgeUrl);
      //  bridgeVersion = BRIDGE_DOWNLOAD_VERSION
      const downloadBridge: any = await downloadBridgeFromURL(
        tempDir,
        bridgeUrl
      );
      return downloadBridge;
    } catch (error) {
      taskLib.debug("error:" + error);
    }
  }

  getVersionUrl(version: string): string {
    const osName = process.platform;

    let bridgeDownloadUrl = this.bridgeUrlPattern.replace("$version", version);
    bridgeDownloadUrl = bridgeDownloadUrl.replace("$version", version);
    if (osName === "darwin") {
      bridgeDownloadUrl = bridgeDownloadUrl.replace(
        "$platform",
        this.MAC_PLATFORM
      );
    } else if (osName === "linux") {
      bridgeDownloadUrl = bridgeDownloadUrl.replace(
        "$platform",
        this.LINUX_PLATFORM
      );
    } else if (osName === "win32") {
      bridgeDownloadUrl = bridgeDownloadUrl.replace(
        "$platform",
        this.WINDOWS_PLATFORM
      );
    }

    return bridgeDownloadUrl;
  }
}
