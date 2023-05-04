export const SYNOPSYS_BRIDGE_DEFAULT_PATH_MAC = "/synopsys-bridge"; //Path will be in home
export const SYNOPSYS_BRIDGE_DEFAULT_PATH_WINDOWS = "\\synopsys-bridge";
export const SYNOPSYS_BRIDGE_DEFAULT_PATH_LINUX = "/synopsys-bridge";

export const SYNOPSYS_BRIDGE_EXECUTABLE_WINDOWS = "synopsys-bridge.exe";
export const SYNOPSYS_BRIDGE_EXECUTABLE_MAC_LINUX = "synopsys-bridge";

export const SYNOPSYS_BRIDGE_ZIP_FILE_NAME = "synopsys-bridge.zip";

export const APPLICATION_NAME = "synopsys-extension";

// Scan Types
export const POLARIS_KEY = "polaris";
export const COVERITY_KEY = "coverity";

// Polaris
export const POLARIS_ACCESS_TOKEN_KEY = "bridge_polaris_accessToken";
export const POLARIS_APPLICATION_NAME_KEY = "bridge_polaris_application_name";
export const POLARIS_PROJECT_NAME_KEY = "bridge_polaris_project_name";
export const POLARIS_ASSESSMENT_TYPES_KEY = "bridge_polaris_assessment_types";
export const POLARIS_SERVER_URL_KEY = "bridge_polaris_serverUrl";

// Coverity
export const COVERITY_URL_KEY = "bridge_coverity_connect_url";
export const COVERITY_USER_NAME_KEY = "bridge_coverity_connect_user_name";
export const COVERITY_USER_PASSWORD_KEY =
  "bridge_coverity_connect_user_password";
export const COVERITY_PROJECT_NAME_KEY = "bridge_coverity_connect_project_name";
export const COVERITY_STREAM_NAME_KEY = "bridge_coverity_connect_stream_name";
export const COVERITY_INSTALL_DIRECTORY_KEY =
  "bridge_coverity_install_directory";
export const COVERITY_POLICY_VIEW_KEY = "bridge_coverity_connect_policy_view";

// Bridge Exit Codes
export const EXIT_CODE_MAP = new Map<string, string>([
  ["0", "Bridge execution successfully completed"],
  ["1", "Undefined error, check error logs"],
  ["2", "Error from adapter end"],
  ["3", "Failed to shutdown the bridge"],
  ["8", "The config option bridge.break has been set to true"],
  ["9", "Bridge initialization failed"],
]);