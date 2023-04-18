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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SynopsysToolsParameter = void 0;
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const validators_1 = require("./validators");
const inputs = __importStar(require("./inputs"));
const blackduck_1 = require("./input-data/blackduck");
const constants = __importStar(require("./application-constants"));
const utility_1 = require("./utility/utility");
class SynopsysToolsParameter {
    constructor(tempDir) {
        this.tempDir = tempDir;
    }
    getFormattedCommandForPolaris() {
        let command = '';
        const assessmentTypeArray = [];
        const assessmentTypesInput = inputs.POLARIS_ASSESSMENT_TYPES;
        if (assessmentTypesInput != null && assessmentTypesInput.length > 0) {
            try {
                // converting provided assessmentTypes to uppercase
                const assessmentTypes = assessmentTypesInput.toUpperCase().split(',');
                for (const assessmentType of assessmentTypes) {
                    const regEx = new RegExp('^[a-zA-Z]+$');
                    if (assessmentType.trim().length > 0 && regEx.test(assessmentType.trim())) {
                        assessmentTypeArray.push(assessmentType.trim());
                    }
                }
            }
            catch (error) {
                throw new Error('Invalid value for '.concat(constants.POLARIS_ASSESSMENT_TYPES_KEY));
            }
        }
        const polData = {
            data: {
                polaris: {
                    accesstoken: inputs.POLARIS_ACCESS_TOKEN === undefined ? "" : inputs.POLARIS_ACCESS_TOKEN,
                    serverUrl: inputs.POLARIS_SERVER_URL === undefined ? "" : inputs.POLARIS_SERVER_URL,
                    application: { name: inputs.POLARIS_APPLICATION_NAME === undefined ? "" : inputs.POLARIS_APPLICATION_NAME },
                    project: { name: inputs.POLARIS_PROJECT_NAME === undefined ? "" : inputs.POLARIS_PROJECT_NAME },
                    assessment: { types: assessmentTypeArray }
                }
            }
        };
        const inputJson = JSON.stringify(polData);
        const stateFilePath = path_1.default.join(this.tempDir, SynopsysToolsParameter.POLARIS_STATE_FILE_NAME);
        fs.writeFileSync(stateFilePath, inputJson);
        //debug('Generated state json file at - '.concat(stateFilePath))
        //debug('Generated state json file content is - '.concat(inputJson))
        console.log('Generated state json file at - '.concat(stateFilePath));
        console.log('Generated state json file content is - '.concat(inputJson));
        console.log('Generated state json file at - '.concat(stateFilePath));
        console.log('Generated state json file content is - '.concat(inputJson));
        command = SynopsysToolsParameter.STAGE_OPTION.concat(SynopsysToolsParameter.SPACE).concat(SynopsysToolsParameter.POLARIS_STAGE).concat(SynopsysToolsParameter.SPACE).concat(SynopsysToolsParameter.STATE_OPTION).concat(SynopsysToolsParameter.SPACE).concat(stateFilePath).concat(SynopsysToolsParameter.SPACE);
        return command;
    }
    getFormattedCommandForCoverity() {
        let command = '';
        const covData = {
            data: {
                coverity: {
                    connect: {
                        user: { name: inputs.COVERITY_USER == undefined ? "" : inputs.COVERITY_USER, password: inputs.COVERITY_PASSPHRASE == undefined ? "" : inputs.COVERITY_PASSPHRASE },
                        url: inputs.COVERITY_URL == undefined ? "" : inputs.COVERITY_URL,
                        project: { name: inputs.COVERITY_PROJECT_NAME == undefined ? "" : inputs.COVERITY_PROJECT_NAME },
                        stream: { name: inputs.COVERITY_STREAM_NAME == undefined ? "" : inputs.COVERITY_STREAM_NAME }
                    },
                    automation: {}
                },
                project: {}
            }
        };
        if (inputs.COVERITY_INSTALL_DIRECTORY) {
            const osName = process.platform;
            if (osName === 'win32') {
                (0, validators_1.validateCoverityInstallDirectoryParam)(inputs.COVERITY_INSTALL_DIRECTORY);
            }
            covData.data.coverity.install = { directory: inputs.COVERITY_INSTALL_DIRECTORY };
        }
        if (inputs.COVERITY_POLICY_VIEW) {
            covData.data.coverity.connect.policy = { view: inputs.COVERITY_POLICY_VIEW };
        }
        if (inputs.COVERITY_REPOSITORY_NAME) {
            covData.data.project.repository = { name: inputs.COVERITY_REPOSITORY_NAME };
        }
        if (inputs.COVERITY_BRANCH_NAME) {
            covData.data.project.branch = { name: inputs.COVERITY_BRANCH_NAME };
        }
        const COVERITY_AUTOMATION_PRCOMMENT = inputs.COVERITY_AUTOMATION_PRCOMMENT != undefined ? inputs.COVERITY_AUTOMATION_PRCOMMENT : "";
        if ((0, utility_1.parseToBoolean)(COVERITY_AUTOMATION_PRCOMMENT)) {
            //info('Coverity Automation comment is enabled')
            console.log('Coverity Automation comment is enabled');
            covData.data.github = this.getGithubRepoInfo();
            covData.data.coverity.automation.prcomment = true;
        }
        else {
            covData.data.coverity.automation.prcomment = false;
        }
        const inputJson = JSON.stringify(covData);
        const stateFilePath = path_1.default.join(this.tempDir, SynopsysToolsParameter.COVERITY_STATE_FILE_NAME);
        fs.writeFileSync(stateFilePath, inputJson);
        console.log('Generated state json file at - '.concat(stateFilePath));
        console.log('Generated state json file content is - '.concat(inputJson));
        command = SynopsysToolsParameter.STAGE_OPTION.concat(SynopsysToolsParameter.SPACE).concat(SynopsysToolsParameter.COVERITY_STAGE).concat(SynopsysToolsParameter.SPACE).concat(SynopsysToolsParameter.STATE_OPTION).concat(SynopsysToolsParameter.SPACE).concat(stateFilePath).concat(SynopsysToolsParameter.SPACE);
        return command;
    }
    getFormattedCommandForBlackduck() {
        const failureSeverities = [];
        if (inputs.BLACKDUCK_SCAN_FAILURE_SEVERITIES != null && inputs.BLACKDUCK_SCAN_FAILURE_SEVERITIES.length > 0) {
            try {
                const failureSeveritiesInput = inputs.BLACKDUCK_SCAN_FAILURE_SEVERITIES;
                if (failureSeveritiesInput != null && failureSeveritiesInput.length > 0) {
                    const failureSeveritiesArray = failureSeveritiesInput.toUpperCase().split(',');
                    for (const failureSeverity of failureSeveritiesArray) {
                        if (failureSeverity.trim().length > 0) {
                            failureSeverities.push(failureSeverity.trim());
                        }
                    }
                }
            }
            catch (error) {
                throw new Error('Invalid value for '.concat(constants.BLACKDUCK_SCAN_FAILURE_SEVERITIES_KEY));
            }
        }
        let command = '';
        const blackduckData = {
            data: {
                blackduck: {
                    url: inputs.BLACKDUCK_URL == undefined ? "" : inputs.BLACKDUCK_URL,
                    token: inputs.BLACKDUCK_API_TOKEN == undefined ? "" : inputs.BLACKDUCK_API_TOKEN,
                    automation: {}
                }
            }
        };
        if (inputs.BLACKDUCK_INSTALL_DIRECTORY) {
            blackduckData.data.blackduck.install = { directory: inputs.BLACKDUCK_INSTALL_DIRECTORY };
        }
        if (inputs.BLACKDUCK_SCAN_FULL) {
            let scanFullValue = false;
            if (inputs.BLACKDUCK_SCAN_FULL.toLowerCase() === 'true' || inputs.BLACKDUCK_SCAN_FULL.toLowerCase() === 'false') {
                scanFullValue = inputs.BLACKDUCK_SCAN_FULL.toLowerCase() === 'true';
            }
            else {
                throw new Error('Missing boolean value for '.concat(constants.BLACKDUCK_SCAN_FULL_KEY));
            }
            blackduckData.data.blackduck.scan = { full: scanFullValue };
        }
        if (failureSeverities && failureSeverities.length > 0) {
            (0, validators_1.validateBlackduckFailureSeverities)(failureSeverities);
            const failureSeverityEnums = [];
            for (const failureSeverity of failureSeverities) {
                if (!Object.values(blackduck_1.BLACKDUCK_SCAN_FAILURE_SEVERITIES).includes(failureSeverity)) {
                    throw new Error('Invalid value for '.concat(constants.BLACKDUCK_SCAN_FAILURE_SEVERITIES_KEY));
                }
                else {
                    failureSeverityEnums.push(blackduck_1.BLACKDUCK_SCAN_FAILURE_SEVERITIES[failureSeverity]);
                }
            }
            if (blackduckData.data.blackduck.scan) {
                blackduckData.data.blackduck.scan.failure = { severities: failureSeverityEnums };
            }
            else {
                blackduckData.data.blackduck.scan = { failure: { severities: failureSeverityEnums } };
            }
        }
        const BLACKDUCK_AUTOMATION_FIXPR = inputs.BLACKDUCK_AUTOMATION_FIXPR === undefined ? "" : inputs.BLACKDUCK_AUTOMATION_FIXPR;
        // Check and put environment variable for fix pull request
        if ((0, utility_1.parseToBoolean)(BLACKDUCK_AUTOMATION_FIXPR)) {
            console.log('Blackduck Automation Fix PR is enabled');
            blackduckData.data.github = this.getGithubRepoInfo();
            blackduckData.data.blackduck.automation.fixpr = true;
        }
        else {
            // Disable fix pull request for adapters
            blackduckData.data.blackduck.automation.fixpr = false;
        }
        const BLACKDUCK_AUTOMATION_PRCOMMENT = inputs.BLACKDUCK_AUTOMATION_PRCOMMENT === undefined ? "" : inputs.BLACKDUCK_AUTOMATION_PRCOMMENT;
        if ((0, utility_1.parseToBoolean)(BLACKDUCK_AUTOMATION_PRCOMMENT)) {
            console.log('Blackduck Automation comment is enabled');
            blackduckData.data.github = this.getGithubRepoInfo();
            blackduckData.data.blackduck.automation.prcomment = true;
        }
        else {
            blackduckData.data.blackduck.automation.prcomment = false;
        }
        const inputJson = JSON.stringify(blackduckData);
        const stateFilePath = path_1.default.join(this.tempDir, SynopsysToolsParameter.BD_STATE_FILE_NAME);
        fs.writeFileSync(stateFilePath, inputJson);
        console.log('Generated state json file at - '.concat(stateFilePath));
        console.log('Generated state json file content is - '.concat(inputJson));
        command = SynopsysToolsParameter.STAGE_OPTION.concat(SynopsysToolsParameter.SPACE).concat(SynopsysToolsParameter.BLACKDUCK_STAGE).concat(SynopsysToolsParameter.SPACE).concat(SynopsysToolsParameter.STATE_OPTION).concat(SynopsysToolsParameter.SPACE).concat(stateFilePath).concat(SynopsysToolsParameter.SPACE);
        return command;
    }
    getGithubRepoInfo() {
        const githubToken = inputs.GITHUB_TOKEN;
        const githubRepo = process.env[blackduck_1.FIXPR_ENVIRONMENT_VARIABLES.GITHUB_REPOSITORY];
        const githubRepoName = githubRepo !== undefined ? githubRepo.substring(githubRepo.indexOf('/') + 1, githubRepo.length).trim() : '';
        const githubBranchName = process.env[blackduck_1.FIXPR_ENVIRONMENT_VARIABLES.GITHUB_REF_NAME];
        const githubRef = process.env[blackduck_1.FIXPR_ENVIRONMENT_VARIABLES.GITHUB_REF];
        // pr number will be part of "refs/pull/<pr_number>/merge"
        // if there is manual run without raising pr then GITHUB_REF will return refs/heads/branch_name
        const githubPrNumber = githubRef !== undefined ? githubRef.split('/')[2].trim() : '';
        const githubRepoOwner = process.env[blackduck_1.FIXPR_ENVIRONMENT_VARIABLES.GITHUB_REPOSITORY_OWNER];
        if (githubToken == null) {
            throw new Error('Missing required github token for fix pull request/automation comment');
        }
        const BLACKDUCK_AUTOMATION_PRCOMMENT = inputs.BLACKDUCK_AUTOMATION_PRCOMMENT === undefined ? "" : inputs.BLACKDUCK_AUTOMATION_PRCOMMENT;
        const COVERITY_AUTOMATION_PRCOMMENT = inputs.COVERITY_AUTOMATION_PRCOMMENT === undefined ? "" : inputs.COVERITY_AUTOMATION_PRCOMMENT;
        if (((0, utility_1.parseToBoolean)(BLACKDUCK_AUTOMATION_PRCOMMENT) || (0, utility_1.parseToBoolean)(COVERITY_AUTOMATION_PRCOMMENT)) && isNaN(Number(githubPrNumber))) {
            throw new Error('Coverity/Blackduck automation PR comment can only be triggered on a pull request.');
        }
        // This condition is required as per ts-lint as these fields may have undefined as well
        if (githubRepoName != null && githubBranchName != null && githubRepoOwner != null) {
            return this.setGithubData(githubToken, githubRepoName, githubRepoOwner, githubBranchName, githubPrNumber);
        }
        return undefined;
    }
    setGithubData(githubToken, githubRepoName, githubRepoOwner, githubBranchName, githubPrNumber) {
        const githubData = {
            user: {
                token: githubToken
            },
            repository: {
                name: githubRepoName,
                owner: {
                    name: githubRepoOwner
                },
                pull: {},
                branch: {
                    name: githubBranchName
                }
            }
        };
        if (githubPrNumber != null) {
            githubData.repository.pull.number = Number(githubPrNumber);
        }
        return githubData;
    }
}
SynopsysToolsParameter.STAGE_OPTION = '--stage';
SynopsysToolsParameter.STATE_OPTION = '--state';
SynopsysToolsParameter.POLARIS_STAGE = 'polaris';
SynopsysToolsParameter.POLARIS_STATE_FILE_NAME = 'polaris_input.json';
SynopsysToolsParameter.COVERITY_STATE_FILE_NAME = 'coverity_input.json';
SynopsysToolsParameter.BD_STATE_FILE_NAME = 'bd_input.json';
// Coverity parameters
SynopsysToolsParameter.COVERITY_STAGE = 'connect';
SynopsysToolsParameter.SPACE = ' ';
// Blackduck parameters
SynopsysToolsParameter.BLACKDUCK_STAGE = 'blackduck';
exports.SynopsysToolsParameter = SynopsysToolsParameter;
