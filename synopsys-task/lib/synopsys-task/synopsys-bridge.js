"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SynopsysBridge = void 0;
const path = __importStar(require("path"));
const application_constants_1 = require("./application-constants");
const inputs = __importStar(require("./inputs"));
const download_utility_1 = require("./utility/download-utility");
const tools_parameter_1 = require("./tools-parameter");
const validators_1 = require("./validators");
class SynopsysBridge {
    constructor() {
        this.WINDOWS_PLATFORM = 'win64';
        this.LINUX_PLATFORM = 'linux64';
        this.MAC_PLATFORM = 'macosx';
        this.bridgeExecutablePath = '';
        this.bridgeArtifactoryURL = 'https://sig-repo.synopsys.com/artifactory/bds-integrations-release/com/synopsys/integration/synopsys-bridge/';
        this.bridgeUrlPattern = this.bridgeArtifactoryURL.concat('/$version/synopsys-bridge-$version-$platform.zip ');
    }
    getBridgeDefaultPath() {
        let bridgeDefaultPath = '';
        const osName = process.platform;
        if (osName === 'darwin') {
            bridgeDefaultPath = path.join(process.env['HOME'], application_constants_1.SYNOPSYS_BRIDGE_DEFAULT_PATH_MAC);
        }
        else if (osName === 'linux') {
            bridgeDefaultPath = path.join(process.env['HOME'], application_constants_1.SYNOPSYS_BRIDGE_DEFAULT_PATH_LINUX);
        }
        else if (osName === 'win32') {
            bridgeDefaultPath = path.join(process.env['USERPROFILE'], application_constants_1.SYNOPSYS_BRIDGE_DEFAULT_PATH_WINDOWS);
        }
        return bridgeDefaultPath;
    }
    prepareCommand(tempDir) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let formattedCommand = '';
                const invalidParams = (0, validators_1.validateScanTypes)();
                const polarisCommandFormatter = new tools_parameter_1.SynopsysToolsParameter(tempDir);
                formattedCommand = formattedCommand.concat(polarisCommandFormatter.getFormattedCommandForPolaris());
                // if (invalidParams.length === 3) {
                //   return Promise.reject(new Error('Requires at least one scan type: ('.concat(constants.POLARIS_SERVER_URL_KEY).concat(',').concat(constants.COVERITY_URL_KEY).concat(',').concat(constants.BLACKDUCK_URL_KEY).concat(')')))
                // }
                // // validating and preparing command for polaris
                // const polarisErrors: string[] = validatePolarisInputs()
                // if (polarisErrors.length === 0 && inputs.POLARIS_SERVER_URL) {
                //   const polarisCommandFormatter = new SynopsysToolsParameter(tempDir)
                //   formattedCommand = formattedCommand.concat(polarisCommandFormatter.getFormattedCommandForPolaris())
                // }
                // // validating and preparing command for coverity
                // const coverityErrors: string[] = validateCoverityInputs()
                // if (coverityErrors.length === 0 && inputs.COVERITY_URL) {
                //   const coverityCommandFormatter = new SynopsysToolsParameter(tempDir)
                //   formattedCommand = formattedCommand.concat(coverityCommandFormatter.getFormattedCommandForCoverity())
                // }
                // // validating and preparing command for blackduck
                // const blackduckErrors: string[] = validateBlackDuckInputs()
                // if (blackduckErrors.length === 0 && inputs.BLACKDUCK_URL) {
                //   const blackDuckCommandFormatter = new SynopsysToolsParameter(tempDir)
                //   formattedCommand = formattedCommand.concat(blackDuckCommandFormatter.getFormattedCommandForBlackduck())
                // }
                // let validationErrors: string[] = []
                // validationErrors = validationErrors.concat(polarisErrors)
                // validationErrors = validationErrors.concat(coverityErrors)
                // validationErrors = validationErrors.concat(blackduckErrors)
                // if (formattedCommand.length === 0) {
                //   return Promise.reject(new Error(validationErrors.join(',')))
                // }
                // if (validationErrors.length > 0) {
                //   console.log(new Error(validationErrors.join(',')))
                // }
                console.log('Formatted command is - '.concat(formattedCommand));
                return formattedCommand;
            }
            catch (e) {
                const errorObject = e;
                // await cleanupTempDir(tempDir)
                console.log(errorObject.stack === undefined ? '' : errorObject.stack.toString());
                return Promise.reject(errorObject.message);
            }
        });
    }
    downloadBridge(tempDir) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("downloadBridge:::" + tempDir);
                console.log("downloadBridge:::New" + tempDir);
                let bridgeUrl = '';
                let bridgeVersion = '';
                const BRIDGE_DOWNLOAD_VERSION = inputs.BRIDGE_DOWNLOAD_VERSION !== undefined ? inputs.BRIDGE_DOWNLOAD_VERSION : "";
                bridgeUrl = inputs.SYNOPSYS_BRIDGE_PATH !== undefined ? inputs.SYNOPSYS_BRIDGE_PATH : "";
                console.log("BRIDGE_DOWNLOAD_URL:::" + bridgeUrl);
                bridgeVersion = BRIDGE_DOWNLOAD_VERSION;
                const downloadResponse = yield (0, download_utility_1.getRemoteFile)(tempDir, bridgeUrl);
                console.log("downloadResponse.fileName" + downloadResponse.fileName);
                console.log("downloadResponse.filePath" + downloadResponse.filePath);
                const extractZippedFilePath = inputs.SYNOPSYS_BRIDGE_PATH || this.getBridgeDefaultPath();
                console.log("extractZippedFilePath::::::::::---------------stat-" + extractZippedFilePath);
                yield (0, download_utility_1.extractZipped)(downloadResponse.filePath, extractZippedFilePath);
            }
            catch (error) {
                console.log("error:" + error);
            }
        });
    }
    getVersionUrl(version) {
        const osName = process.platform;
        let bridgeDownloadUrl = this.bridgeUrlPattern.replace('$version', version);
        bridgeDownloadUrl = bridgeDownloadUrl.replace('$version', version);
        if (osName === 'darwin') {
            bridgeDownloadUrl = bridgeDownloadUrl.replace('$platform', this.MAC_PLATFORM);
        }
        else if (osName === 'linux') {
            bridgeDownloadUrl = bridgeDownloadUrl.replace('$platform', this.LINUX_PLATFORM);
        }
        else if (osName === 'win32') {
            bridgeDownloadUrl = bridgeDownloadUrl.replace('$platform', this.WINDOWS_PLATFORM);
        }
        return bridgeDownloadUrl;
    }
}
exports.SynopsysBridge = SynopsysBridge;
