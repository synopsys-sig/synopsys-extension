import * as taskLib from "azure-pipelines-task-lib/task";
import * as constants from "./application-constant";

//Bridge download url
export const BRIDGE_DOWNLOAD_URL =
  taskLib.getInput("bridge_download_url") || "";

export const SYNOPSYS_BRIDGE_PATH = taskLib.getPathInput(
  "synopsys_bridge_path"
);

// Polaris related inputs
export const POLARIS_ACCESS_TOKEN =
  taskLib.getInput(constants.POLARIS_ACCESS_TOKEN_KEY) || "";
export const POLARIS_APPLICATION_NAME =
  taskLib.getInput(constants.POLARIS_APPLICATION_NAME_KEY) || "";
export const POLARIS_PROJECT_NAME =
  taskLib.getInput(constants.POLARIS_PROJECT_NAME_KEY) || "";
export const POLARIS_ASSESSMENT_TYPES = taskLib.getDelimitedInput(
  constants.POLARIS_ASSESSMENT_TYPES_KEY,
  ","
);
export const POLARIS_SERVER_URL =
  taskLib.getInput(constants.POLARIS_SERVER_URL_KEY) || "";

export const COVERITY_AUTOMATION_PRCOMMENT =
  taskLib.getInput(constants.COVERITY_AUTOMATION_PRCOMMENT_KEY) || "";

export const BLACKDUCK_URL =
  taskLib.getInput(constants.BLACKDUCK_URL_KEY) || "";
export const BLACKDUCK_API_TOKEN =
  taskLib.getInput(constants.BLACKDUCK_API_TOKEN_KEY) || "";
export const BLACKDUCK_INSTALL_DIRECTORY =
  taskLib.getInput(constants.BLACKDUCK_INSTALL_DIRECTORY_KEY) || "";
export const BLACKDUCK_SCAN_FULL =
  taskLib.getInput(constants.BLACKDUCK_SCAN_FULL_KEY) || "";
export const BLACKDUCK_SCAN_FAILURE_SEVERITIES =
  taskLib.getInput(constants.BLACKDUCK_SCAN_FAILURE_SEVERITIES_KEY) || "";
export const BLACKDUCK_AUTOMATION_FIXPR =
  taskLib.getInput(constants.BLACKDUCK_AUTOMATION_FIXPR_KEY) || "";
export const BLACKDUCK_AUTOMATION_PRCOMMENT =
  taskLib.getInput(constants.BLACKDUCK_AUTOMATION_PRCOMMENT_KEY) || "";

export const GITHUB_TOKEN = taskLib.getInput(constants.GITHUB_TOKEN_KEY) || "";

export const COVERITY_AUTOMATION_PRCOMMENT =
  taskLib.getInput(constants.COVERITY_AUTOMATION_PRCOMMENT_KEY) || "";

export const BLACKDUCK_URL =
  taskLib.getInput(constants.BLACKDUCK_URL_KEY) || "";
export const BLACKDUCK_API_TOKEN =
  taskLib.getInput(constants.BLACKDUCK_API_TOKEN_KEY) || "";
export const BLACKDUCK_INSTALL_DIRECTORY =
  taskLib.getInput(constants.BLACKDUCK_INSTALL_DIRECTORY_KEY) || "";
export const BLACKDUCK_SCAN_FULL =
  taskLib.getInput(constants.BLACKDUCK_SCAN_FULL_KEY) || "";
export const BLACKDUCK_SCAN_FAILURE_SEVERITIES =
  taskLib.getInput(constants.BLACKDUCK_SCAN_FAILURE_SEVERITIES_KEY) || "";
export const BLACKDUCK_AUTOMATION_FIXPR =
  taskLib.getInput(constants.BLACKDUCK_AUTOMATION_FIXPR_KEY) || "";
export const BLACKDUCK_AUTOMATION_PRCOMMENT =
  taskLib.getInput(constants.BLACKDUCK_AUTOMATION_PRCOMMENT_KEY) || "";

export const GITHUB_TOKEN = taskLib.getInput(constants.GITHUB_TOKEN_KEY) || "";

export const COVERITY_USER =
  taskLib.getInput(constants.COVERITY_USER_NAME_KEY) || "";
export const COVERITY_URL = taskLib.getInput(constants.COVERITY_URL_KEY) || "";
export const COVERITY_PROJECT_NAME =
  taskLib.getInput(constants.COVERITY_PROJECT_NAME_KEY) || "";
export const COVERITY_STREAM_NAME =
  taskLib.getInput(constants.COVERITY_STREAM_NAME_KEY) || "";
export const COVERITY_INSTALL_DIRECTORY =
  taskLib.getPathInput(constants.COVERITY_INSTALL_DIRECTORY_KEY) || "";
export const COVERITY_POLICY_VIEW =
  taskLib.getInput(constants.COVERITY_POLICY_VIEW_KEY) || "";
export const COVERITY_USER_PASSWORD =
  taskLib.getInput(constants.COVERITY_USER_PASSWORD_KEY) || "";
