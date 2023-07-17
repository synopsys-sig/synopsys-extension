import * as path from "path";
import * as taskLib from "azure-pipelines-task-lib/task";
import { HttpClient } from "typed-rest-client/HttpClient";

import { SynopsysToolsParameter } from "./tools-parameter";
import {
  validatePolarisInputs,
  validateScanTypes,
  validateBridgeUrl,
  validateCoverityInputs,
  validateBlackDuckInputs,
} from "./validator";

import * as constants from "./application-constant";

import * as inputs from "./input";
import { extractZipped, getRemoteFile, parseToBoolean } from "./utility";
import { readFileSync } from "fs";
import { DownloadFileResponse } from "./model/download-file-response";
import DomParser from "dom-parser";
import { SCAN_TYPE } from "./input";

export class SynopsysBridge {
  bridgeExecutablePath: string;
  bridgeArtifactoryURL: string;
  bridgeUrlPattern: string;
  bridgeUrlLatestPattern: string;
  WINDOWS_PLATFORM = "win64";
  LINUX_PLATFORM = "linux64";
  MAC_PLATFORM = "macosx";

  constructor() {
    this.bridgeExecutablePath = "";
    this.bridgeArtifactoryURL =
      "https://sig-repo.synopsys.com/artifactory/bds-integrations-release/com/synopsys/integration/synopsys-bridge";
    this.bridgeUrlPattern = this.bridgeArtifactoryURL.concat(
      "/$version/synopsys-bridge-$version-$platform.zip"
    );
    this.bridgeUrlLatestPattern = this.bridgeArtifactoryURL.concat(
      "/latest/synopsys-bridge-$platform.zip"
    );
  }

  async extractBridge(fileInfo: DownloadFileResponse): Promise<string> {
    const extractZippedFilePath: string =
      inputs.SYNOPSYS_BRIDGE_INSTALL_DIRECTORY_KEY ||
      this.getBridgeDefaultPath();

    // Clear the existing bridge, if available
    if (taskLib.exist(extractZippedFilePath)) {
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

    executable = await this.setBridgeExecutablePath(osName, executablePath);
    try {
      if (inputs.ENABLE_NETWORK_AIR_GAP) {
        if (inputs.SYNOPSYS_BRIDGE_INSTALL_DIRECTORY_KEY) {
          if (!taskLib.exist(inputs.SYNOPSYS_BRIDGE_INSTALL_DIRECTORY_KEY)) {
            throw new Error("Synopsys Bridge Install Directory does not exist");
          }
          executable = await this.setBridgeExecutablePath(
            osName,
            inputs.SYNOPSYS_BRIDGE_INSTALL_DIRECTORY_KEY
          );
          if (!taskLib.exist(executable)) {
            throw new Error(
              "Bridge executable file could not be found at".concat(executable)
            );
          }
        } else {
          if (!taskLib.exist(inputs.SYNOPSYS_BRIDGE_INSTALL_DIRECTORY_KEY)) {
            throw new Error("Synopsys Default Bridge path does not exist");
          }
          executable = await this.setBridgeExecutablePath(
            osName,
            this.getBridgeDefaultPath()
          );
          if (!taskLib.exist(executable)) {
            throw new Error(
              "Bridge executable file could not be found at".concat(executable)
            );
          }
        }
      }
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

      if (invalidParams.length === 3) {
        return Promise.reject(
          new Error(
            "Requires at least one scan type: ("
              .concat(constants.POLARIS_SERVER_URL_KEY)
              .concat(",")
              .concat(constants.COVERITY_URL_KEY)
              .concat(",")
              .concat(constants.BLACKDUCK_URL_KEY)
              .concat(")")
          )
        );
      }

      let classicEditorErrors: string[] = [];
      let polarisErrors: string[] = [];
      let coverityErrors: string[] = [];
      let blackduckErrors: string[] = [];

      if (SCAN_TYPE.length > 0) {
        // To support single scan using Classic Editor
        [formattedCommand, classicEditorErrors] =
          this.formatCommandForClassicEditor(formattedCommand, tempDir);
      } else {
        // To support multi-scan using YAML
        [formattedCommand, polarisErrors] = this.preparePolarisCommand(
          formattedCommand,
          tempDir
        );
        [formattedCommand, coverityErrors] = this.prepareBlackduckCommand(
          formattedCommand,
          tempDir
        );
        [formattedCommand, blackduckErrors] = this.prepareCoverityCommand(
          formattedCommand,
          tempDir
        );
      }

      let validationErrors: string[] = [];
      validationErrors = validationErrors.concat(
        polarisErrors,
        coverityErrors,
        blackduckErrors,
        classicEditorErrors
      );

      if (formattedCommand.length === 0) {
        return Promise.reject(new Error(validationErrors.join(",")));
      }

      if (validationErrors.length > 0) {
        console.log(new Error(validationErrors.join(",")));
      }

      if (parseToBoolean(inputs.INCLUDE_DIAGNOSTICS)) {
        formattedCommand = formattedCommand
          .concat(SynopsysToolsParameter.SPACE)
          .concat(SynopsysToolsParameter.DIAGNOSTICS_OPTION);
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

  private formatCommandForClassicEditor(
    formattedCommand: string,
    tempDir: string
  ): [string, string[]] {
    let errors: string[] = [];
    if (SCAN_TYPE == "polaris") {
      [formattedCommand, errors] = this.preparePolarisCommand(
        formattedCommand,
        tempDir
      );
    } else if (SCAN_TYPE == "blackduck") {
      [formattedCommand, errors] = this.prepareBlackduckCommand(
        formattedCommand,
        tempDir
      );
    } else if (SCAN_TYPE == "coverity") {
      [formattedCommand, errors] = this.prepareCoverityCommand(
        formattedCommand,
        tempDir
      );
    }
    return [formattedCommand, errors];
  }

  private preparePolarisCommand(
    formattedCommand: string,
    tempDir: string
  ): [string, string[]] {
    // validating and preparing command for polaris
    const polarisErrors: string[] = validatePolarisInputs();
    const commandFormatter = new SynopsysToolsParameter(tempDir);
    if (polarisErrors.length === 0 && inputs.POLARIS_SERVER_URL) {
      formattedCommand = formattedCommand.concat(
        commandFormatter.getFormattedCommandForPolaris()
      );
    }
    return [formattedCommand, polarisErrors];
  }

  private prepareCoverityCommand(
    formattedCommand: string,
    tempDir: string
  ): [string, string[]] {
    // validating and preparing command for coverity
    const coverityErrors: string[] = validateCoverityInputs();
    if (coverityErrors.length === 0 && inputs.COVERITY_URL) {
      const coverityCommandFormatter = new SynopsysToolsParameter(tempDir);
      formattedCommand = formattedCommand.concat(
        coverityCommandFormatter.getFormattedCommandForCoverity()
      );
    }
    return [formattedCommand, coverityErrors];
  }

  private prepareBlackduckCommand(
    formattedCommand: string,
    tempDir: string
  ): [string, string[]] {
    const blackduckErrors: string[] = validateBlackDuckInputs();
    if (blackduckErrors.length === 0 && inputs.BLACKDUCK_URL) {
      const blackDuckCommandFormatter = new SynopsysToolsParameter(tempDir);
      formattedCommand = formattedCommand.concat(
        blackDuckCommandFormatter.getFormattedCommandForBlackduck()
      );
    }
    return [formattedCommand, blackduckErrors];
  }

  async validateBridgeVersion(version: string): Promise<boolean> {
    const versions = await this.getAllAvailableBridgeVersions();
    return Promise.resolve(versions.indexOf(version.trim()) !== -1);
  }

  async downloadAndExtractBridge(tempDir: string): Promise<string> {
    try {
      const bridgeUrl = await this.getBridgeUrl();

      if (bridgeUrl != "" && bridgeUrl != null) {
        const downloadBridge: DownloadFileResponse = await getRemoteFile(
          tempDir,
          bridgeUrl
        );
        console.info("Download of Synopsys Bridge completed");
        // Extracting bridge
        return await this.extractBridge(downloadBridge);
      }
      if (
        inputs.BRIDGE_DOWNLOAD_VERSION &&
        (await this.checkIfSynopsysBridgeVersionExists(
          inputs.BRIDGE_DOWNLOAD_VERSION
        ))
      ) {
        return Promise.resolve(this.bridgeExecutablePath);
      }
      return this.bridgeExecutablePath;
    } catch (e) {
      const errorObject = (e as Error).message;
      if (
        errorObject.includes("404") ||
        errorObject.toLowerCase().includes("invalid url")
      ) {
        return Promise.reject(
          new Error(
            "Provided Bridge url is not valid for the configured ".concat(
              process.platform,
              " runner"
            )
          )
        );
      } else if (errorObject.toLowerCase().includes("empty")) {
        return Promise.reject(new Error("Provided Bridge URL cannot be empty"));
      } else {
        return Promise.reject(new Error(errorObject));
      }
    }
  }

  async getBridgeUrl(): Promise<string | undefined> {
    let bridgeUrl: string;
    let version = "";
    if (inputs.BRIDGE_DOWNLOAD_URL) {
      bridgeUrl = inputs.BRIDGE_DOWNLOAD_URL;

      if (!validateBridgeUrl(inputs.BRIDGE_DOWNLOAD_URL)) {
        return Promise.reject(new Error("Invalid URL"));
      }
      // To check whether bridge already exists with same version mentioned in bridge url
      const versionsArray = bridgeUrl.match(".*synopsys-bridge-([0-9.]*).*");
      if (versionsArray) {
        version = versionsArray[1];
      }
    } else if (inputs.BRIDGE_DOWNLOAD_VERSION) {
      if (await this.validateBridgeVersion(inputs.BRIDGE_DOWNLOAD_VERSION)) {
        bridgeUrl = this.getVersionUrl(
          inputs.BRIDGE_DOWNLOAD_VERSION.trim()
        ).trim();
        version = inputs.BRIDGE_DOWNLOAD_VERSION;
      } else {
        return Promise.reject(
          new Error("Provided bridge version not found in artifactory")
        );
      }
    } else {
      console.info(
        "Checking for latest version of Bridge to download and configure"
      );
      const latestVersion = await this.getVersionFromLatestURL();
      if (latestVersion === "") {
        bridgeUrl = this.getLatestVersionUrl();
        taskLib.debug(
          "Checking for latest version of Bridge to download and configure" +
            bridgeUrl
        );
        if (!bridgeUrl.includes("latest")) {
          throw new Error("Invalid artifactory latest url");
        }
        version = "latest";
      } else {
        taskLib.debug("Found latest version:" + latestVersion);
        bridgeUrl = this.getVersionUrl(latestVersion).trim();
        version = latestVersion;
      }
    }

    if (version != "") {
      if (await this.checkIfSynopsysBridgeVersionExists(version)) {
        console.info("Skipping download as same Synopsys Bridge version found");
        return Promise.resolve("");
      }
    }

    console.info("Downloading and configuring Synopsys Bridge");
    console.info("Bridge URL is - ".concat(bridgeUrl));
    return bridgeUrl;
  }

  async checkIfSynopsysBridgeVersionExists(
    bridgeVersion: string
  ): Promise<boolean> {
    let synopsysBridgePath = inputs.SYNOPSYS_BRIDGE_INSTALL_DIRECTORY_KEY;
    const osName = process.platform;
    let versionFilePath: string;

    if (!synopsysBridgePath) {
      console.info("Looking for synopsys bridge in default path");
      synopsysBridgePath = this.getBridgeDefaultPath();
    }

    this.bridgeExecutablePath = synopsysBridgePath;

    if (osName === "win32") {
      versionFilePath = synopsysBridgePath.concat("\\versions.txt");
    } else {
      versionFilePath = synopsysBridgePath.concat("/versions.txt");
    }

    if (taskLib.exist(versionFilePath)) {
      taskLib.debug("Bridge executable found at ".concat(synopsysBridgePath));
      taskLib.debug("Version file found at ".concat(synopsysBridgePath));
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

    const httpClient = new HttpClient("synopsys-task");
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

  async getSynopsysBridgePath(): Promise<string> {
    let synopsysBridgePath = inputs.SYNOPSYS_BRIDGE_INSTALL_DIRECTORY_KEY;

    if (!synopsysBridgePath) {
      synopsysBridgePath = this.getBridgeDefaultPath();
    }
    return synopsysBridgePath;
  }

  async getVersionFromLatestURL(): Promise<string> {
    try {
      const latestVersionsUrl = this.bridgeArtifactoryURL.concat(
        "/latest/versions.txt"
      );
      const httpClient = new HttpClient("");
      const httpResponse = await httpClient.get(latestVersionsUrl, {
        Accept: "text/html",
      });
      if (httpResponse.message.statusCode === 200) {
        const htmlResponse = (await httpResponse.readBody()).trim();
        const lines = htmlResponse.split("\n");
        for (const line of lines) {
          if (line.includes("Synopsys Bridge Package")) {
            const newerVersion = line.split(":")[1].trim();
            return newerVersion;
          }
        }
      } else {
        taskLib.error(
          "Unable to retrieve the most recent version from Artifactory URL"
        );
      }
    } catch (e) {
      taskLib.error(
        "Error reading version file content: ".concat((e as Error).message)
      );
    }
    return "";
  }

  getBridgeDefaultPath(): string {
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

  getLatestVersionUrl(): string {
    const osName = process.platform;
    let bridgeDownloadUrl = this.bridgeUrlLatestPattern;
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

  async setBridgeExecutablePath(
    osName: string,
    filePath: string
  ): Promise<string> {
    if (osName === "win32") {
      this.bridgeExecutablePath = path.join(
        filePath,
        constants.SYNOPSYS_BRIDGE_EXECUTABLE_WINDOWS
      );
    } else if (osName === "darwin" || osName === "linux") {
      this.bridgeExecutablePath = path.join(
        filePath,
        constants.SYNOPSYS_BRIDGE_EXECUTABLE_MAC_LINUX
      );
    }
    return this.bridgeExecutablePath;
  }
}
