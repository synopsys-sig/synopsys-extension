import * as path from "path";
import * as taskLib from "azure-pipelines-task-lib/task";
import { HttpClient } from "typed-rest-client/HttpClient";

import { SynopsysToolsParameter } from "./tools-parameter";
import {
  validatePolarisInputs,
  validateScanTypes,
  validateBridgeUrl,
  validateCoverityInputs,
} from "./validator";

import * as constants from "./application-constant";

import * as inputs from "./input";
import { checkIfPathExists, extractZipped, getRemoteFile } from "./utility";
import fs, { readFileSync } from "fs";
import { DownloadFileResponse } from "./model/download-file-response";
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
      "https://sig-repo.synopsys.com/artifactory/bds-integrations-release/com/synopsys/integration/synopsys-bridge";
    this.bridgeUrlPattern = this.bridgeArtifactoryURL.concat(
      "/$version/synopsys-bridge-$version-$platform.zip "
    );
  }

  async extractBridge(fileInfo: DownloadFileResponse): Promise<string> {
    const extractZippedFilePath: string =
      inputs.SYNOPSYS_BRIDGE_PATH || this.getBridgeDefaultPath();

    // Clear the existing bridge, if available
    if (fs.existsSync(extractZippedFilePath)) {
      await taskLib.rmRF(extractZippedFilePath);
    }

    await extractZipped(fileInfo.filePath, extractZippedFilePath);

    return Promise.resolve(extractZippedFilePath);
  }

  async executeBridgeCommand(
    executablePath: string,
    workspace: string,
    command: string
  ): Promise<number> {
    const osName: string = process.platform;
    let executable = "";
    taskLib.debug("extractedPath: ".concat(executablePath));

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
  }

  async prepareCommand(tempDir: string): Promise<string> {
    try {
      let formattedCommand = "";
      const invalidParams: string[] = validateScanTypes();

      if (invalidParams.length === 2) {
        return Promise.reject(
          new Error(
            "Requires at least one scan type: ("
              .concat(constants.POLARIS_SERVER_URL_KEY)
              .concat(",")
              .concat(constants.COVERITY_URL_KEY)
              .concat(")")
          )
        );
      }

      const commandFormatter = new SynopsysToolsParameter(tempDir);

      // validating and preparing command for polaris
      const polarisErrors: string[] = validatePolarisInputs();
      if (polarisErrors.length === 0 && inputs.POLARIS_SERVER_URL) {
        formattedCommand = formattedCommand.concat(
          commandFormatter.getFormattedCommandForPolaris()
        );
      }

      // validating and preparing command for coverity
      const coverityErrors: string[] = validateCoverityInputs();
      if (coverityErrors.length === 0 && inputs.COVERITY_URL) {
        const coverityCommandFormatter = new SynopsysToolsParameter(tempDir);
        formattedCommand = formattedCommand.concat(
          coverityCommandFormatter.getFormattedCommandForCoverity()
        );
      }

      let validationErrors: string[] = [];
      validationErrors = validationErrors.concat(polarisErrors, coverityErrors);

      if (formattedCommand.length === 0) {
        return Promise.reject(new Error(validationErrors.join(",")));
      }

      if (validationErrors.length > 0) {
        console.log(new Error(validationErrors.join(",")));
      }

      console.log("Formatted command is - ".concat(formattedCommand));
      return Promise.resolve(formattedCommand);
    } catch (e) {
      const errorObject = e as Error;
      taskLib.debug(
        errorObject.stack === undefined ? "" : errorObject.stack.toString()
      );
      return Promise.reject(errorObject);
    }
  }

  async validateBridgeVersion(version: string): Promise<boolean> {
    const versions = await this.getAllAvailableBridgeVersions();
    return Promise.resolve(versions.indexOf(version.trim()) !== -1);
  }

  async downloadBridge(tempDir: string): Promise<string> {
    if (
      inputs.BRIDGE_DOWNLOAD_VERSION &&
      (await this.checkIfSynopsysBridgeVersionExists(
        inputs.BRIDGE_DOWNLOAD_VERSION
      ))
    ) {
      return Promise.resolve(this.bridgeExecutablePath);
    }

    try {
      const bridgeUrl = await this.getBridgeUrl();

      if (bridgeUrl !== undefined) {
        const downloadBridge = await getRemoteFile(tempDir, bridgeUrl);
        console.info("Download of Synopsys Bridge completed");
        // Extracting bridge
        await this.extractBridge(downloadBridge);
        return downloadBridge.filePath;
      }
      return this.bridgeExecutablePath;
    } catch (error) {
      taskLib.debug("error:" + error);
      return Promise.reject(new Error("Bridge could not be downloaded"));
    }
  }

  async getBridgeUrl(): Promise<string | undefined> {
    let bridgeUrl: string;
    if (inputs.BRIDGE_DOWNLOAD_URL) {
      bridgeUrl = inputs.BRIDGE_DOWNLOAD_URL;

      if (!validateBridgeUrl(inputs.BRIDGE_DOWNLOAD_URL)) {
        return Promise.reject(new Error("Invalid URL"));
      }

      // To check whether bridge already exists with same version mentioned in bridge url
      const versionInfo = bridgeUrl.match(".*synopsys-bridge-([0-9.]*).*");
      if (versionInfo) {
        if (await this.checkIfSynopsysBridgeVersionExists(versionInfo[0])) {
          console.info(
            "Skipping download as same Synopsys Bridge version found"
          );
          return Promise.resolve("");
        }
      }

      console.info("Downloading and configuring Synopsys Bridge");
      console.info("Bridge URL is - ".concat(bridgeUrl));
    } else if (inputs.BRIDGE_DOWNLOAD_VERSION) {
      if (await this.validateBridgeVersion(inputs.BRIDGE_DOWNLOAD_VERSION)) {
        bridgeUrl = this.getVersionUrl(
          inputs.BRIDGE_DOWNLOAD_VERSION.trim()
        ).trim();
      } else {
        return Promise.reject(
          new Error("Provided bridge version not found in artifactory")
        );
      }
    } else {
      console.info(
        "Checking for latest version of Bridge to download and configure"
      );
      const latestVersion = await this.getLatestVersion();
      bridgeUrl = this.getVersionUrl(latestVersion).trim();
    }
    return bridgeUrl;
  }

  async checkIfSynopsysBridgeVersionExists(
    bridgeVersion: string
  ): Promise<boolean> {
    let synopsysBridgePath = inputs.SYNOPSYS_BRIDGE_PATH;
    const osName = process.platform;
    let versionFilePath: string;
    let versionFileExists: boolean;

    if (!synopsysBridgePath) {
      console.info("Looking for synopsys bridge in default path");
      synopsysBridgePath = this.getBridgeDefaultPath();
    }

    if (osName === "win32") {
      this.bridgeExecutablePath = synopsysBridgePath.concat(
        "\\synopsys-bridge.exe"
      );
      versionFilePath = synopsysBridgePath.concat("\\versions.txt");
      versionFileExists = checkIfPathExists(versionFilePath);
    } else {
      this.bridgeExecutablePath = synopsysBridgePath.concat("/synopsys-bridge");
      versionFilePath = synopsysBridgePath.concat("/versions.txt");
      versionFileExists = checkIfPathExists(versionFilePath);
    }

    if (versionFileExists && this.bridgeExecutablePath) {
      console.debug("Bridge executable found at ".concat(synopsysBridgePath));
      console.debug("Version file found at ".concat(synopsysBridgePath));
      if (await this.checkIfVersionExists(bridgeVersion, versionFilePath)) {
        return Promise.resolve(true);
      }
    } else {
      console.info(
        "Bridge executable and version file could not be found at ".concat(
          synopsysBridgePath
        )
      );
    }
    return Promise.resolve(false);
  }

  async getAllAvailableBridgeVersions(): Promise<string[]> {
    let htmlResponse = "";

    const httpClient = new HttpClient("synopsys-action");
    const httpResponse = await httpClient.get(this.bridgeArtifactoryURL, {
      Accept: "text/html",
    });
    htmlResponse = await httpResponse.readBody();

    const domParser = new DomParser();
    const doms = domParser.parseFromString(htmlResponse);
    const elems = doms.getElementsByTagName("a"); //querySelectorAll('a')
    const versionArray: string[] = [];

    if (elems != null) {
      for (const el of elems) {
        const content = el.textContent;
        if (content != null) {
          const v = content.match("^[0-9]+.[0-9]+.[0-9]+");

          if (v != null && v.length === 1) {
            versionArray.push(v[0]);
          }
        }
      }
    }
    return versionArray;
  }

  async getLatestVersion(): Promise<string> {
    const versionArray: string[] = await this.getAllAvailableBridgeVersions();
    let latestVersion = "0.0.0";

    for (const version of versionArray) {
      if (
        version.localeCompare(latestVersion, undefined, {
          numeric: true,
          sensitivity: "base",
        }) === 1
      ) {
        latestVersion = version;
      }
    }

    console.info("Available latest version is - ".concat(latestVersion));

    return latestVersion;
  }

  async checkIfVersionExists(
    bridgeVersion: string,
    bridgeVersionFilePath: string
  ): Promise<boolean> {
    try {
      const contents = readFileSync(bridgeVersionFilePath, "utf-8");
      return contents.includes(
        "Synopsys Bridge Package: ".concat(bridgeVersion)
      );
    } catch (e) {
      console.info(
        "Error reading version file content: ".concat((e as Error).message)
      );
    }
    return false;
  }

  private getBridgeDefaultPath(): string {
    let bridgeDefaultPath = "";
    const osName = process.platform;

    if (osName === "darwin") {
      bridgeDefaultPath = path.join(
        process.env["HOME"] as string,
        constants.SYNOPSYS_BRIDGE_DEFAULT_PATH_MAC
      );
    } else if (osName === "linux") {
      bridgeDefaultPath = path.join(
        process.env["HOME"] as string,
        constants.SYNOPSYS_BRIDGE_DEFAULT_PATH_LINUX
      );
    } else if (osName === "win32") {
      bridgeDefaultPath = path.join(
        process.env["USERPROFILE"] as string,
        constants.SYNOPSYS_BRIDGE_DEFAULT_PATH_WINDOWS
      );
    }
    taskLib.debug("bridgeDefaultPath:" + bridgeDefaultPath);
    return bridgeDefaultPath;
  }

  // Get bridge version url
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
