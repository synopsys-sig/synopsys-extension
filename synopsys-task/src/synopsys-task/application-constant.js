"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BRIDGE_DIAGNOSTICS_FOLDER = exports.UPLOAD_FOLDER_ARTIFACT_NAME = exports.INCLUDE_DIAGNOSTICS_KEY = exports.BLACKDUCK_AUTOMATION_FIXPR_KEY = exports.BLACKDUCK_SCAN_FAILURE_SEVERITIES_KEY = exports.BLACKDUCK_SCAN_FULL_KEY = exports.BLACKDUCK_INSTALL_DIRECTORY_KEY = exports.BLACKDUCK_API_TOKEN_KEY = exports.BLACKDUCK_URL_KEY = exports.EXIT_CODE_MAP = exports.COVERITY_POLICY_VIEW_KEY = exports.COVERITY_INSTALL_DIRECTORY_KEY = exports.COVERITY_STREAM_NAME_KEY = exports.COVERITY_PROJECT_NAME_KEY = exports.COVERITY_USER_PASSWORD_KEY = exports.COVERITY_USER_NAME_KEY = exports.COVERITY_URL_KEY = exports.POLARIS_SERVER_URL_KEY = exports.POLARIS_ASSESSMENT_TYPES_KEY = exports.POLARIS_PROJECT_NAME_KEY = exports.POLARIS_APPLICATION_NAME_KEY = exports.POLARIS_ACCESS_TOKEN_KEY = exports.BLACKDUCK_KEY = exports.COVERITY_KEY = exports.POLARIS_KEY = exports.APPLICATION_NAME = exports.SYNOPSYS_BRIDGE_ZIP_FILE_NAME = exports.SYNOPSYS_BRIDGE_EXECUTABLE_MAC_LINUX = exports.SYNOPSYS_BRIDGE_EXECUTABLE_WINDOWS = exports.SYNOPSYS_BRIDGE_DEFAULT_PATH_LINUX = exports.SYNOPSYS_BRIDGE_DEFAULT_PATH_WINDOWS = exports.SYNOPSYS_BRIDGE_DEFAULT_PATH_MAC = void 0;
exports.SYNOPSYS_BRIDGE_DEFAULT_PATH_MAC = "/synopsys-bridge"; //Path will be in home
exports.SYNOPSYS_BRIDGE_DEFAULT_PATH_WINDOWS = "\\synopsys-bridge";
exports.SYNOPSYS_BRIDGE_DEFAULT_PATH_LINUX = "/synopsys-bridge";
exports.SYNOPSYS_BRIDGE_EXECUTABLE_WINDOWS = "synopsys-bridge.exe";
exports.SYNOPSYS_BRIDGE_EXECUTABLE_MAC_LINUX = "synopsys-bridge";
exports.SYNOPSYS_BRIDGE_ZIP_FILE_NAME = "synopsys-bridge.zip";
exports.APPLICATION_NAME = "synopsys-extension";
// Scan Types
exports.POLARIS_KEY = "polaris";
exports.COVERITY_KEY = "coverity";
exports.BLACKDUCK_KEY = "blackduck";
// Polaris
exports.POLARIS_ACCESS_TOKEN_KEY = "bridge_polaris_accessToken";
exports.POLARIS_APPLICATION_NAME_KEY = "bridge_polaris_application_name";
exports.POLARIS_PROJECT_NAME_KEY = "bridge_polaris_project_name";
exports.POLARIS_ASSESSMENT_TYPES_KEY = "bridge_polaris_assessment_types";
exports.POLARIS_SERVER_URL_KEY = "bridge_polaris_serverUrl";
// Coverity
exports.COVERITY_URL_KEY = "bridge_coverity_connect_url";
exports.COVERITY_USER_NAME_KEY = "bridge_coverity_connect_user_name";
exports.COVERITY_USER_PASSWORD_KEY = "bridge_coverity_connect_user_password";
exports.COVERITY_PROJECT_NAME_KEY = "bridge_coverity_connect_project_name";
exports.COVERITY_STREAM_NAME_KEY = "bridge_coverity_connect_stream_name";
exports.COVERITY_INSTALL_DIRECTORY_KEY = "bridge_coverity_install_directory";
exports.COVERITY_POLICY_VIEW_KEY = "bridge_coverity_connect_policy_view";
// Bridge Exit Codes
exports.EXIT_CODE_MAP = new Map([
    ["0", "Bridge execution successfully completed"],
    ["1", "Undefined error, check error logs"],
    ["2", "Error from adapter end"],
    ["3", "Failed to shutdown the bridge"],
    ["8", "The config option bridge.break has been set to true"],
    ["9", "Bridge initialization failed"],
]);
// Blackduck
exports.BLACKDUCK_URL_KEY = "bridge_blackduck_url";
exports.BLACKDUCK_API_TOKEN_KEY = "bridge_blackduck_token";
exports.BLACKDUCK_INSTALL_DIRECTORY_KEY = "bridge_blackduck_install_directory";
exports.BLACKDUCK_SCAN_FULL_KEY = "bridge_blackduck_scan_full";
exports.BLACKDUCK_SCAN_FAILURE_SEVERITIES_KEY = "bridge_blackduck_scan_failure_severities";
exports.BLACKDUCK_AUTOMATION_FIXPR_KEY = "bridge_blackduck_automation_fixpr";
exports.INCLUDE_DIAGNOSTICS_KEY = "include_diagnostics";
exports.UPLOAD_FOLDER_ARTIFACT_NAME = "synopsys_bridge_diagnostics";
exports.BRIDGE_DIAGNOSTICS_FOLDER = ".bridge";
