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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBridgeUrl = exports.isNullOrEmpty = exports.validateParameters = exports.validateBlackDuckInputs = exports.validateCoverityInputs = exports.validatePolarisInputs = exports.validateScanTypes = exports.validateBlackduckFailureSeverities = exports.validateCoverityInstallDirectoryParam = void 0;
const fs = __importStar(require("fs"));
const constants = __importStar(require("./application-constants"));
const inputs = __importStar(require("./inputs"));
function validateCoverityInstallDirectoryParam(installDir) {
    if (installDir == null || installDir.length === 0) {
        //error(`[${constants.COVERITY_INSTALL_DIRECTORY_KEY}] parameter for Coverity is missing`)
        console.log(`[${constants.COVERITY_INSTALL_DIRECTORY_KEY}] parameter for Coverity is missing`);
        return false;
    }
    if (!fs.existsSync(installDir)) {
        console.log(`[${constants.COVERITY_INSTALL_DIRECTORY_KEY}] parameter for Coverity is invalid`);
        //error(`[${constants.COVERITY_INSTALL_DIRECTORY_KEY}] parameter for Coverity is invalid`)
        return false;
    }
    return true;
}
exports.validateCoverityInstallDirectoryParam = validateCoverityInstallDirectoryParam;
function validateBlackduckFailureSeverities(severities) {
    if (severities == null || severities.length === 0) {
        //error('Provided value is not valid - BLACKDUCK_SCAN_FAILURE_SEVERITIES')
        console.log('Provided value is not valid - BLACKDUCK_SCAN_FAILURE_SEVERITIES');
        return false;
    }
    return true;
}
exports.validateBlackduckFailureSeverities = validateBlackduckFailureSeverities;
function validateScanTypes() {
    const paramsMap = new Map();
    paramsMap.set(constants.POLARIS_SERVER_URL_KEY, inputs.POLARIS_SERVER_URL);
    paramsMap.set(constants.COVERITY_URL_KEY, inputs.COVERITY_URL);
    paramsMap.set(constants.BLACKDUCK_URL_KEY, inputs.BLACKDUCK_URL);
    return isNullOrEmpty(paramsMap);
}
exports.validateScanTypes = validateScanTypes;
function validatePolarisInputs() {
    let errors = [];
    if (inputs.POLARIS_SERVER_URL) {
        const paramsMap = new Map();
        paramsMap.set(constants.POLARIS_ACCESS_TOKEN_KEY, inputs.POLARIS_ACCESS_TOKEN);
        paramsMap.set(constants.POLARIS_APPLICATION_NAME_KEY, inputs.POLARIS_APPLICATION_NAME);
        paramsMap.set(constants.POLARIS_PROJECT_NAME_KEY, inputs.POLARIS_PROJECT_NAME);
        paramsMap.set(constants.POLARIS_SERVER_URL_KEY, inputs.POLARIS_SERVER_URL);
        paramsMap.set(constants.POLARIS_ASSESSMENT_TYPES_KEY, inputs.POLARIS_ASSESSMENT_TYPES);
        errors = validateParameters(paramsMap, constants.POLARIS_KEY);
    }
    return errors;
}
exports.validatePolarisInputs = validatePolarisInputs;
function validateCoverityInputs() {
    let errors = [];
    if (inputs.COVERITY_URL) {
        const paramsMap = new Map();
        paramsMap.set(constants.COVERITY_USER_KEY, inputs.COVERITY_USER);
        paramsMap.set(constants.COVERITY_PASSPHRASE_KEY, inputs.COVERITY_PASSPHRASE);
        paramsMap.set(constants.COVERITY_URL_KEY, inputs.COVERITY_URL);
        paramsMap.set(constants.COVERITY_PROJECT_NAME_KEY, inputs.COVERITY_PROJECT_NAME);
        paramsMap.set(constants.COVERITY_STREAM_NAME_KEY, inputs.COVERITY_STREAM_NAME);
        errors = validateParameters(paramsMap, constants.COVERITY_KEY);
    }
    return errors;
}
exports.validateCoverityInputs = validateCoverityInputs;
function validateBlackDuckInputs() {
    let errors = [];
    if (inputs.BLACKDUCK_URL) {
        const paramsMap = new Map();
        paramsMap.set(constants.BLACKDUCK_URL_KEY, inputs.BLACKDUCK_URL);
        paramsMap.set(constants.BLACKDUCK_API_TOKEN_KEY, inputs.BLACKDUCK_API_TOKEN);
        errors = validateParameters(paramsMap, constants.BLACKDUCK_KEY);
    }
    return errors;
}
exports.validateBlackDuckInputs = validateBlackDuckInputs;
function validateParameters(params, toolName) {
    const invalidParams = isNullOrEmpty(params);
    const errors = [];
    if (invalidParams.length > 0) {
        errors.push(`[${invalidParams.join()}] - required parameters for ${toolName} is missing`);
    }
    return errors;
}
exports.validateParameters = validateParameters;
function isNullOrEmpty(params) {
    const invalidParams = [];
    for (const param of params.entries()) {
        if (param[1] == null || param[1].length === 0 || param[1].toString().includes(' ')) {
            invalidParams.push(param[0]);
        }
    }
    return invalidParams;
}
exports.isNullOrEmpty = isNullOrEmpty;
function validateBridgeUrl(url) {
    console.log("url:::url:::url:::url:::" + url.match('.*\\.(zip|ZIP)$'));
    if (!url.match('.*\\.(zip|ZIP)$')) {
        return false;
    }
    const osName = process.platform;
    console.log("osName:::" + osName);
    const fileNameComponent = url.substring(url.lastIndexOf('/'), url.length);
    if (osName === 'darwin') {
        return fileNameComponent.toLowerCase().includes('mac');
    }
    else if (osName === 'linux') {
        return fileNameComponent.toLowerCase().includes('linux');
    }
    else if (osName === 'win32') {
        return fileNameComponent.toLowerCase().includes('win');
    }
    else {
        return true;
        //Need to change to false
    }
}
exports.validateBridgeUrl = validateBridgeUrl;
