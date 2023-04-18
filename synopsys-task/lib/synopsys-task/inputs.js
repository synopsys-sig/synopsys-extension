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
exports.GITHUB_TOKEN = exports.BLACKDUCK_AUTOMATION_PRCOMMENT = exports.BLACKDUCK_AUTOMATION_FIXPR = exports.BLACKDUCK_SCAN_FAILURE_SEVERITIES = exports.BLACKDUCK_SCAN_FULL = exports.BLACKDUCK_INSTALL_DIRECTORY = exports.BLACKDUCK_API_TOKEN = exports.BLACKDUCK_URL = exports.COVERITY_AUTOMATION_PRCOMMENT = exports.COVERITY_BRANCH_NAME = exports.COVERITY_REPOSITORY_NAME = exports.COVERITY_POLICY_VIEW = exports.COVERITY_INSTALL_DIRECTORY = exports.COVERITY_STREAM_NAME = exports.COVERITY_PROJECT_NAME = exports.COVERITY_PASSPHRASE = exports.COVERITY_USER = exports.COVERITY_URL = exports.POLARIS_SERVER_URL = exports.POLARIS_ASSESSMENT_TYPES = exports.POLARIS_PROJECT_NAME = exports.POLARIS_APPLICATION_NAME = exports.POLARIS_ACCESS_TOKEN = exports.BRIDGE_DOWNLOAD_VERSION = exports.BRIDGE_DOWNLOAD_URL = exports.SYNOPSYS_BRIDGE_PATH = exports.SAMPLE_URL = void 0;
const taskLib = __importStar(require("azure-pipelines-task-lib/task"));
const constants = __importStar(require("./application-constants"));
exports.SAMPLE_URL = taskLib.getInput('samplestring');
exports.SYNOPSYS_BRIDGE_PATH = taskLib.getInput('bridge_download_url');
//Bridge download url
exports.BRIDGE_DOWNLOAD_URL = taskLib.getInput('bridge_download_url');
exports.BRIDGE_DOWNLOAD_VERSION = taskLib.getInput('bridge_download_version');
// Polaris related inputs
exports.POLARIS_ACCESS_TOKEN = taskLib.getInput(constants.POLARIS_ACCESS_TOKEN_KEY);
exports.POLARIS_APPLICATION_NAME = taskLib.getInput(constants.POLARIS_APPLICATION_NAME_KEY);
exports.POLARIS_PROJECT_NAME = taskLib.getInput(constants.POLARIS_PROJECT_NAME_KEY);
exports.POLARIS_ASSESSMENT_TYPES = taskLib.getInput(constants.POLARIS_ASSESSMENT_TYPES_KEY);
exports.POLARIS_SERVER_URL = taskLib.getInput(constants.POLARIS_SERVER_URL_KEY);
// Coverity related inputs
exports.COVERITY_URL = taskLib.getInput(constants.COVERITY_URL_KEY);
exports.COVERITY_USER = taskLib.getInput(constants.COVERITY_USER_KEY);
exports.COVERITY_PASSPHRASE = taskLib.getInput(constants.COVERITY_PASSPHRASE_KEY);
exports.COVERITY_PROJECT_NAME = taskLib.getInput(constants.COVERITY_PROJECT_NAME_KEY);
exports.COVERITY_STREAM_NAME = taskLib.getInput(constants.COVERITY_STREAM_NAME_KEY);
exports.COVERITY_INSTALL_DIRECTORY = taskLib.getInput(constants.COVERITY_INSTALL_DIRECTORY_KEY);
exports.COVERITY_POLICY_VIEW = taskLib.getInput(constants.COVERITY_POLICY_VIEW_KEY);
exports.COVERITY_REPOSITORY_NAME = taskLib.getInput(constants.COVERITY_REPOSITORY_NAME_KEY);
exports.COVERITY_BRANCH_NAME = taskLib.getInput(constants.COVERITY_BRANCH_NAME_KEY);
exports.COVERITY_AUTOMATION_PRCOMMENT = taskLib.getInput(constants.COVERITY_AUTOMATION_PRCOMMENT_KEY);
// Blackduck related inputs
exports.BLACKDUCK_URL = taskLib.getInput(constants.BLACKDUCK_URL_KEY);
exports.BLACKDUCK_API_TOKEN = taskLib.getInput(constants.BLACKDUCK_API_TOKEN_KEY);
exports.BLACKDUCK_INSTALL_DIRECTORY = taskLib.getInput(constants.BLACKDUCK_INSTALL_DIRECTORY_KEY);
exports.BLACKDUCK_SCAN_FULL = taskLib.getInput(constants.BLACKDUCK_SCAN_FULL_KEY);
exports.BLACKDUCK_SCAN_FAILURE_SEVERITIES = taskLib.getInput(constants.BLACKDUCK_SCAN_FAILURE_SEVERITIES_KEY);
exports.BLACKDUCK_AUTOMATION_FIXPR = taskLib.getInput(constants.BLACKDUCK_AUTOMATION_FIXPR_KEY);
exports.BLACKDUCK_AUTOMATION_PRCOMMENT = taskLib.getInput(constants.BLACKDUCK_AUTOMATION_PRCOMMENT_KEY);
exports.GITHUB_TOKEN = taskLib.getInput(constants.GITHUB_TOKEN_KEY);
