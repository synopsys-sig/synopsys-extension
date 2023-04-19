import * as taskLib from "azure-pipelines-task-lib/task";
import * as constants from "./application-constants";

//Bridge download url
export const BRIDGE_DOWNLOAD_URL = taskLib.getInput("bridge_download_url");

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
