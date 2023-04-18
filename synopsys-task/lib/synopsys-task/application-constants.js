"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXIT_CODE_MAP = exports.GITHUB_TOKEN_KEY = exports.BLACKDUCK_AUTOMATION_PRCOMMENT_KEY = exports.BLACKDUCK_AUTOMATION_FIXPR_KEY = exports.BLACKDUCK_SCAN_FAILURE_SEVERITIES_KEY = exports.BLACKDUCK_SCAN_FULL_KEY = exports.BLACKDUCK_INSTALL_DIRECTORY_KEY = exports.BLACKDUCK_API_TOKEN_KEY = exports.BLACKDUCK_URL_KEY = exports.POLARIS_SERVER_URL_KEY = exports.POLARIS_ASSESSMENT_TYPES_KEY = exports.POLARIS_PROJECT_NAME_KEY = exports.POLARIS_APPLICATION_NAME_KEY = exports.POLARIS_ACCESS_TOKEN_KEY = exports.COVERITY_AUTOMATION_PRCOMMENT_KEY = exports.COVERITY_BRANCH_NAME_KEY = exports.COVERITY_REPOSITORY_NAME_KEY = exports.COVERITY_POLICY_VIEW_KEY = exports.COVERITY_INSTALL_DIRECTORY_KEY = exports.COVERITY_STREAM_NAME_KEY = exports.COVERITY_PROJECT_NAME_KEY = exports.COVERITY_PASSPHRASE_KEY = exports.COVERITY_USER_KEY = exports.COVERITY_URL_KEY = exports.BLACKDUCK_KEY = exports.POLARIS_KEY = exports.COVERITY_KEY = exports.APPLICATION_NAME = exports.SYNOPSYS_BRIDGE_DEFAULT_PATH_LINUX = exports.SYNOPSYS_BRIDGE_DEFAULT_PATH_WINDOWS = exports.SYNOPSYS_BRIDGE_DEFAULT_PATH_MAC = void 0;
exports.SYNOPSYS_BRIDGE_DEFAULT_PATH_MAC = '/synopsys-bridge'; //Path will be in home
exports.SYNOPSYS_BRIDGE_DEFAULT_PATH_WINDOWS = '\\synopsys-bridge';
exports.SYNOPSYS_BRIDGE_DEFAULT_PATH_LINUX = '/synopsys-bridge';
exports.APPLICATION_NAME = 'synopsys-extension';
// Scan Types
exports.COVERITY_KEY = 'coverity';
exports.POLARIS_KEY = 'polaris';
exports.BLACKDUCK_KEY = 'blackduck';
// Coverity
exports.COVERITY_URL_KEY = 'coverity_url';
exports.COVERITY_USER_KEY = 'coverity_user';
exports.COVERITY_PASSPHRASE_KEY = 'coverity_passphrase';
exports.COVERITY_PROJECT_NAME_KEY = 'coverity_project_name';
exports.COVERITY_STREAM_NAME_KEY = 'coverity_stream_name';
exports.COVERITY_INSTALL_DIRECTORY_KEY = 'coverity_install_directory';
exports.COVERITY_POLICY_VIEW_KEY = 'coverity_policy_view';
exports.COVERITY_REPOSITORY_NAME_KEY = 'coverity_repository_name';
exports.COVERITY_BRANCH_NAME_KEY = 'coverity_branch_name';
exports.COVERITY_AUTOMATION_PRCOMMENT_KEY = 'coverity_automation_prcomment';
// Polaris
exports.POLARIS_ACCESS_TOKEN_KEY = 'polaris_accessToken';
exports.POLARIS_APPLICATION_NAME_KEY = 'polaris_application_name';
exports.POLARIS_PROJECT_NAME_KEY = 'polaris_project_name';
exports.POLARIS_ASSESSMENT_TYPES_KEY = 'polaris_assessment_types';
exports.POLARIS_SERVER_URL_KEY = 'polaris_serverUrl';
// Blackduck
exports.BLACKDUCK_URL_KEY = 'blackduck_url';
exports.BLACKDUCK_API_TOKEN_KEY = 'blackduck_apiToken';
exports.BLACKDUCK_INSTALL_DIRECTORY_KEY = 'blackduck_install_directory';
exports.BLACKDUCK_SCAN_FULL_KEY = 'blackduck_scan_full';
exports.BLACKDUCK_SCAN_FAILURE_SEVERITIES_KEY = 'blackduck_scan_failure_severities';
exports.BLACKDUCK_AUTOMATION_FIXPR_KEY = 'blackduck_automation_fixpr';
exports.BLACKDUCK_AUTOMATION_PRCOMMENT_KEY = 'blackduck_automation_prcomment';
exports.GITHUB_TOKEN_KEY = 'github_token';
// Bridge Exit Codes
exports.EXIT_CODE_MAP = new Map([
    ['0', 'Bridge execution successfully completed'],
    ['1', 'Undefined error, check error logs'],
    ['2', 'Error from adapter end'],
    ['3', 'Failed to shutdown the bridge'],
    ['8', 'The config option bridge.break has been set to true'],
    ['9', 'Bridge initialization failed']
]);
