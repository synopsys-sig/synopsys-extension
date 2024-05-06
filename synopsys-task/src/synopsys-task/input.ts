import * as taskLib from "azure-pipelines-task-lib/task";
import * as constants from "./application-constant";

export function getDelimitedInput(
  key: string,
  classicEditorKey: string,
  oldKey: string
) {
  const precedence_1 = taskLib.getDelimitedInput(key, ",");
  const precedence_2 = taskLib.getDelimitedInput(classicEditorKey, ",");
  const precedence_3 = taskLib.getDelimitedInput(oldKey, ",");
  return (
    (precedence_1.length > 0 && precedence_1) ||
    (precedence_2.length > 0 && precedence_2) ||
    (precedence_3.length > 0 && precedence_3) ||
    []
  );
}

//Bridge download url
export const BRIDGE_DOWNLOAD_URL =
  taskLib.getInput(constants.SYNOPSYS_BRIDGE_DOWNLOAD_URL_KEY)?.trim() ||
  taskLib
    .getInput(constants.SYNOPSYS_BRIDGE_DOWNLOAD_URL_KEY_CLASSIC_EDITOR)
    ?.trim() ||
  taskLib.getInput(constants.BRIDGE_DOWNLOAD_URL_KEY)?.trim() ||
  "";

export const ENABLE_NETWORK_AIRGAP =
  taskLib.getBoolInput(constants.NETWORK_AIRGAP_KEY) ||
  taskLib.getBoolInput(constants.NETWORK_AIRGAP_KEY_CLASSIC_EDITOR) ||
  taskLib.getBoolInput(constants.BRIDGE_NETWORK_AIRGAP_KEY);

export const SYNOPSYS_BRIDGE_INSTALL_DIRECTORY_KEY =
  taskLib.getPathInput(
    constants.SYNOPSYS_BRIDGE_INSTALL_DIRECTORY_KEY,
    false,
    false
  ) ||
  taskLib.getPathInput(
    constants.SYNOPSYS_BRIDGE_INSTALL_DIRECTORY_KEY_CLASSIC_EDITOR,
    false,
    false
  ) ||
  "";

export const BRIDGE_DOWNLOAD_VERSION =
  taskLib
    .getPathInput(constants.SYNOPSYS_BRIDGE_DOWNLOAD_VERSION_KEY)
    ?.trim() ||
  taskLib
    .getPathInput(constants.SYNOPSYS_BRIDGE_DOWNLOAD_VERSION_KEY_CLASSIC_EDITOR)
    ?.trim() ||
  taskLib.getPathInput(constants.BRIDGE_DOWNLOAD_VERSION_KEY)?.trim() ||
  "";

export const INCLUDE_DIAGNOSTICS =
  taskLib.getInput(constants.INCLUDE_DIAGNOSTICS_KEY)?.trim() ||
  taskLib.getInput(constants.INCLUDE_DIAGNOSTICS_KEY_CLASSIC_EDITOR)?.trim() ||
  "";

// Polaris related inputs
export const AZURE_TOKEN =
  taskLib.getInput(constants.AZURE_TOKEN_KEY)?.trim() ||
  taskLib.getInput(constants.AZURE_TOKEN_KEY_CLASSIC_EDITOR)?.trim() ||
  "";

export const SCAN_TYPE =
  taskLib.getInput(constants.SCAN_TYPE_KEY)?.trim() || "";

export const POLARIS_SERVER_URL =
  taskLib.getInput(constants.POLARIS_SERVER_URL_KEY)?.trim() ||
  taskLib.getInput(constants.POLARIS_SERVER_URL_KEY_CLASSIC_EDITOR)?.trim() ||
  taskLib.getInput(constants.BRIDGE_POLARIS_SERVER_URL_KEY)?.trim() ||
  "";
export const POLARIS_ACCESS_TOKEN =
  taskLib.getInput(constants.POLARIS_ACCESS_TOKEN_KEY)?.trim() ||
  taskLib.getInput(constants.POLARIS_ACCESS_TOKEN_KEY_CLASSIC_EDITOR)?.trim() ||
  taskLib.getInput(constants.BRIDGE_POLARIS_ACCESS_TOKEN_KEY)?.trim() ||
  "";
export const POLARIS_APPLICATION_NAME =
  taskLib.getInput(constants.POLARIS_APPLICATION_NAME_KEY)?.trim() ||
  taskLib
    .getInput(constants.POLARIS_APPLICATION_NAME_KEY_CLASSIC_EDITOR)
    ?.trim() ||
  taskLib.getInput(constants.BRIDGE_POLARIS_APPLICATION_NAME_KEY)?.trim() ||
  "";
export const POLARIS_PROJECT_NAME =
  taskLib.getInput(constants.POLARIS_PROJECT_NAME_KEY)?.trim() ||
  taskLib.getInput(constants.POLARIS_PROJECT_NAME_KEY_CLASSIC_EDITOR)?.trim() ||
  taskLib.getInput(constants.BRIDGE_POLARIS_PROJECT_NAME_KEY)?.trim() ||
  "";
export const POLARIS_ASSESSMENT_TYPES = getDelimitedInput(
  constants.POLARIS_ASSESSMENT_TYPES_KEY,
  constants.POLARIS_ASSESSMENT_TYPES_KEY_CLASSIC_EDITOR,
  constants.BRIDGE_POLARIS_ASSESSMENT_TYPES_KEY
);
export const POLARIS_TRIAGE =
  taskLib.getInput(constants.POLARIS_TRIAGE_KEY)?.trim() ||
  taskLib.getInput(constants.POLARIS_TRIAGE_KEY_CLASSIC_EDITOR)?.trim() ||
  taskLib.getInput(constants.BRIDGE_POLARIS_TRIAGE_KEY)?.trim() ||
  "";
export const POLARIS_BRANCH_NAME =
  taskLib.getInput(constants.POLARIS_BRANCH_NAME_KEY)?.trim() ||
  taskLib.getInput(constants.POLARIS_BRANCH_NAME_KEY_CLASSIC_EDITOR)?.trim() ||
  taskLib.getInput(constants.BRIDGE_POLARIS_BRANCH_NAME_KEY)?.trim() ||
  "";
export const POLARIS_BRANCH_PARENT_NAME =
  taskLib.getInput(constants.POLARIS_BRANCH_PARENT_NAME_KEY)?.trim() ||
  taskLib
    .getInput(constants.POLARIS_BRANCH_PARENT_NAME_KEY_CLASSIC_EDITOR)
    ?.trim() ||
  "";
export const POLARIS_PR_COMMENT_ENABLED =
  taskLib.getInput(constants.POLARIS_PR_COMMENT_ENABLED_KEY)?.trim() ||
  taskLib
    .getInput(constants.POLARIS_PR_COMMENT_ENABLED_KEY_CLASSIC_EDITOR)
    ?.trim() ||
  taskLib.getInput(constants.BRIDGE_POLARIS_PR_COMMENT_ENABLED_KEY)?.trim() ||
  "";
export const POLARIS_PR_COMMENT_SEVERITIES = getDelimitedInput(
  constants.POLARIS_PR_COMMENT_SEVERITIES_KEY,
  constants.POLARIS_PR_COMMENT_SEVERITIES_KEY_CLASSIC_EDITOR,
  constants.BRIDGE_POLARIS_PR_COMMENT_SEVERITIES_KEY
);

export const POLARIS_TEST_SCA_TYPE =
  taskLib.getInput(constants.POLARIS_TEST_SCA_TYPE_KEY)?.trim() ||
  taskLib
    .getInput(constants.POLARIS_TEST_SCA_TYPE_KEY_CLASSIC_EDITOR)
    ?.trim() ||
  taskLib.getInput(constants.BRIDGE_POLARIS_TEST_SCA_TYPE_KEY)?.trim() ||
  "";

export const POLARIS_REPORTS_SARIF_CREATE =
  taskLib.getInput(constants.POLARIS_REPORTS_SARIF_CREATE_KEY)?.trim() ||
  taskLib
    .getInput(constants.POLARIS_REPORTS_SARIF_CREATE_KEY_CLASSIC_EDITOR)
    ?.trim() ||
  taskLib.getInput(constants.BRIDGE_POLARIS_REPORTS_SARIF_CREATE_KEY)?.trim() ||
  "";
export const POLARIS_REPORTS_SARIF_FILE_PATH =
  taskLib.getInput(constants.POLARIS_REPORTS_SARIF_FILE_PATH_KEY)?.trim() ||
  taskLib
    .getInput(constants.POLARIS_REPORTS_SARIF_FILE_PATH_KEY_CLASSIC_EDITOR)
    ?.trim() ||
  taskLib
    .getInput(constants.BRIDGE_POLARIS_REPORTS_SARIF_FILE_PATH_KEY)
    ?.trim() ||
  "";
export const POLARIS_REPORTS_SARIF_SEVERITIES = getDelimitedInput(
  constants.POLARIS_REPORTS_SARIF_SEVERITIES_KEY,
  constants.POLARIS_REPORTS_SARIF_SEVERITIES_KEY_CLASSIC_EDITOR,
  constants.BRIDGE_POLARIS_REPORTS_SARIF_SEVERITIES_KEY
);
export const POLARIS_REPORTS_SARIF_GROUP_SCA_ISSUES =
  taskLib
    .getInput(constants.POLARIS_REPORTS_SARIF_GROUP_SCA_ISSUES_KEY)
    ?.trim() ||
  taskLib
    .getInput(
      constants.POLARIS_REPORTS_SARIF_GROUP_SCA_ISSUES_KEY_CLASSIC_EDITOR
    )
    ?.trim() ||
  taskLib
    .getInput(constants.BRIDGE_POLARIS_REPORTS_SARIF_GROUP_SCA_ISSUES_KEY)
    ?.trim() ||
  "";
export const POLARIS_REPORTS_SARIF_ISSUE_TYPES = getDelimitedInput(
  constants.POLARIS_REPORTS_SARIF_ISSUE_TYPES_KEY,
  constants.POLARIS_REPORTS_SARIF_ISSUE_TYPES_KEY_CLASSIC_EDITOR,
  constants.BRIDGE_POLARIS_REPORTS_SARIF_ISSUE_TYPES_KEY
);

// Coverity related inputs
export const COVERITY_URL =
  taskLib.getInput(constants.COVERITY_URL_KEY)?.trim() ||
  taskLib.getInput(constants.COVERITY_URL_KEY_CLASSIC_EDITOR)?.trim() ||
  taskLib.getInput(constants.BRIDGE_COVERITY_URL_KEY)?.trim() ||
  "";
export const COVERITY_USER =
  taskLib.getInput(constants.COVERITY_USER_KEY)?.trim() ||
  taskLib.getInput(constants.COVERITY_USER_KEY_CLASSIC_EDITOR)?.trim() ||
  taskLib.getInput(constants.BRIDGE_COVERITY_USER_NAME_KEY)?.trim() ||
  "";
export const COVERITY_USER_PASSWORD =
  taskLib.getInput(constants.COVERITY_PASSPHRASE_KEY)?.trim() ||
  taskLib.getInput(constants.COVERITY_PASSPHRASE_KEY_CLASSIC_EDITOR)?.trim() ||
  taskLib.getInput(constants.BRIDGE_COVERITY_USER_PASSWORD_KEY)?.trim() ||
  "";
export const COVERITY_PROJECT_NAME =
  taskLib.getInput(constants.COVERITY_PROJECT_NAME_KEY)?.trim() ||
  taskLib
    .getInput(constants.COVERITY_PROJECT_NAME_KEY_CLASSIC_EDITOR)
    ?.trim() ||
  taskLib.getInput(constants.BRIDGE_COVERITY_PROJECT_NAME_KEY)?.trim() ||
  "";
export const COVERITY_STREAM_NAME =
  taskLib.getInput(constants.COVERITY_STREAM_NAME_KEY)?.trim() ||
  taskLib.getInput(constants.COVERITY_STREAM_NAME_KEY_CLASSIC_EDITOR)?.trim() ||
  taskLib.getInput(constants.BRIDGE_COVERITY_STREAM_NAME_KEY)?.trim() ||
  "";
export const COVERITY_INSTALL_DIRECTORY =
  taskLib.getPathInput(constants.COVERITY_INSTALL_DIRECTORY_KEY)?.trim() ||
  taskLib
    .getPathInput(constants.COVERITY_INSTALL_DIRECTORY_KEY_CLASSIC_EDITOR)
    ?.trim() ||
  taskLib
    .getPathInput(constants.BRIDGE_COVERITY_INSTALL_DIRECTORY_KEY)
    ?.trim() ||
  "";
export const COVERITY_POLICY_VIEW =
  taskLib.getInput(constants.COVERITY_POLICY_VIEW_KEY)?.trim() ||
  taskLib.getInput(constants.COVERITY_POLICY_VIEW_KEY_CLASSIC_EDITOR)?.trim() ||
  taskLib.getInput(constants.BRIDGE_COVERITY_POLICY_VIEW_KEY)?.trim() ||
  "";
export const COVERITY_LOCAL =
  taskLib.getInput(constants.COVERITY_LOCAL_KEY)?.trim() ||
  taskLib.getInput(constants.COVERITY_LOCAL_KEY_CLASSIC_EDITOR)?.trim() ||
  taskLib.getInput(constants.BRIDGE_COVERITY_LOCAL_KEY)?.trim() ||
  "";
export const COVERITY_AUTOMATION_PRCOMMENT =
  taskLib.getInput(constants.COVERITY_PRCOMMENT_ENABLED_KEY) ||
  taskLib.getInput(constants.COVERITY_PRCOMMENT_ENABLED_KEY_CLASSIC_EDITOR) ||
  taskLib.getInput(constants.BRIDGE_COVERITY_AUTOMATION_PRCOMMENT_KEY) ||
  "";
export const COVERITY_VERSION =
  taskLib.getInput(constants.COVERITY_VERSION_KEY)?.trim() ||
  taskLib.getInput(constants.COVERITY_VERSION_KEY_CLASSIC_EDITOR)?.trim() ||
  taskLib.getInput(constants.BRIDGE_COVERITY_VERSION_KEY)?.trim() ||
  "";

// Blackduck related inputs
export const BLACKDUCK_URL =
  taskLib.getInput(constants.BLACKDUCK_URL_KEY)?.trim() ||
  taskLib.getInput(constants.BLACKDUCK_URL_KEY_CLASSIC_EDITOR)?.trim() ||
  taskLib.getInput(constants.BRIDGE_BLACKDUCK_URL_KEY)?.trim() ||
  "";
export const BLACKDUCK_API_TOKEN =
  taskLib.getInput(constants.BLACKDUCK_TOKEN_KEY)?.trim() ||
  taskLib.getInput(constants.BLACKDUCK_TOKEN_KEY_CLASSIC_EDITOR)?.trim() ||
  taskLib.getInput(constants.BRIDGE_BLACKDUCK_API_TOKEN_KEY)?.trim() ||
  "";
export const BLACKDUCK_INSTALL_DIRECTORY =
  taskLib.getPathInput(constants.BLACKDUCK_INSTALL_DIRECTORY_KEY)?.trim() ||
  taskLib
    .getPathInput(constants.BLACKDUCK_INSTALL_DIRECTORY_KEY_CLASSIC_EDITOR)
    ?.trim() ||
  taskLib
    .getPathInput(constants.BRIDGE_BLACKDUCK_INSTALL_DIRECTORY_KEY)
    ?.trim() ||
  "";
export const BLACKDUCK_SCAN_FULL =
  taskLib.getInput(constants.BLACKDUCK_SCAN_FULL_KEY)?.trim() ||
  taskLib.getInput(constants.BLACKDUCK_SCAN_FULL_KEY_CLASSIC_EDITOR)?.trim() ||
  taskLib.getInput(constants.BRIDGE_BLACKDUCK_SCAN_FULL_KEY)?.trim() ||
  "";
export const BLACKDUCK_SCAN_FAILURE_SEVERITIES = getDelimitedInput(
  constants.BLACKDUCK_SCAN_FAILURE_SEVERITIES_KEY,
  constants.BLACKDUCK_SCAN_FAILURE_SEVERITIES_KEY_CLASSIC_EDITOR,
  constants.BRIDGE_BLACKDUCK_SCAN_FAILURE_SEVERITIES_KEY
);
export const BLACKDUCK_FIXPR_ENABLED =
  taskLib.getInput(constants.BLACKDUCK_FIXPR_ENABLED_KEY)?.trim() ||
  taskLib
    .getInput(constants.BLACKDUCK_FIXPR_ENABLED_KEY_CLASSIC_EDITOR)
    ?.trim() ||
  taskLib.getInput(constants.BLACKDUCK_AUTOMATION_FIXPR_KEY)?.trim() ||
  taskLib.getInput(constants.BRIDGE_BLACKDUCK_FIXPR_ENABLED_KEY)?.trim() ||
  "";
export const BLACKDUCK_AUTOMATION_PRCOMMENT =
  taskLib.getInput(constants.BLACKDUCK_PRCOMMENT_ENABLED_KEY) ||
  taskLib.getInput(constants.BLACKDUCK_PRCOMMENT_ENABLED_KEY_CLASSIC_EDITOR) ||
  taskLib.getInput(constants.BRIDGE_BLACKDUCK_AUTOMATION_PRCOMMENT_KEY) ||
  "";
export const BLACKDUCK_FIXPR_MAXCOUNT =
  taskLib.getInput(constants.BLACKDUCK_FIXPR_MAXCOUNT_KEY)?.trim() ||
  taskLib
    .getInput(constants.BLACKDUCK_FIXPR_MAXCOUNT_KEY_CLASSIC_EDITOR)
    ?.trim() ||
  taskLib.getInput(constants.BRIDGE_BLACKDUCK_FIXPR_MAXCOUNT_KEY)?.trim() ||
  "";
export const BLACKDUCK_FIXPR_CREATE_SINGLE_PR =
  taskLib.getInput(constants.BLACKDUCK_FIXPR_CREATE_SINGLE_PR_KEY)?.trim() ||
  taskLib
    .getInput(constants.BLACKDUCK_FIXPR_CREATE_SINGLE_PR_KEY_CLASSIC_EDITOR)
    ?.trim() ||
  taskLib
    .getInput(constants.BRIDGE_BLACKDUCK_FIXPR_CREATE_SINGLE_PR_KEY)
    ?.trim() ||
  "";
export const BLACKDUCK_FIXPR_FILTER_SEVERITIES = getDelimitedInput(
  constants.BLACKDUCK_FIXPR_FILTER_SEVERITIES_KEY,
  constants.BLACKDUCK_FIXPR_FILTER_SEVERITIES_KEY_CLASSIC_EDITOR,
  constants.BRIDGE_BLACKDUCK_FIXPR_FILTER_SEVERITIES_KEY
);
export const BLACKDUCK_FIXPR_UPGRADE_GUIDANCE = getDelimitedInput(
  constants.BLACKDUCK_FIXPR_UPGRADE_GUIDANCE_KEY,
  constants.BLACKDUCK_FIXPR_UPGRADE_GUIDANCE_KEY_CLASSIC_EDITOR,
  constants.BRIDGE_BLACKDUCK_FIXPR_UPGRADE_GUIDANCE_KEY
);
export const BLACKDUCK_REPORTS_SARIF_CREATE =
  taskLib.getInput(constants.BLACKDUCK_REPORTS_SARIF_CREATE_KEY)?.trim() ||
  taskLib
    .getInput(constants.BLACKDUCK_REPORTS_SARIF_CREATE_KEY_CLASSIC_EDITOR)
    ?.trim() ||
  taskLib
    .getInput(constants.BRIDGE_BLACKDUCK_REPORTS_SARIF_CREATE_KEY)
    ?.trim() ||
  "";
export const BLACKDUCK_REPORTS_SARIF_FILE_PATH =
  taskLib.getInput(constants.BLACKDUCK_REPORTS_SARIF_FILE_PATH_KEY)?.trim() ||
  taskLib
    .getInput(constants.BLACKDUCK_REPORTS_SARIF_FILE_PATH_KEY_CLASSIC_EDITOR)
    ?.trim() ||
  taskLib
    .getInput(constants.BRIDGE_BLACKDUCK_REPORTS_SARIF_FILE_PATH_KEY)
    ?.trim() ||
  "";

export const BLACKDUCK_REPORTS_SARIF_SEVERITIES = getDelimitedInput(
  constants.BLACKDUCK_REPORTS_SARIF_SEVERITIES_KEY,
  constants.BLACKDUCK_REPORTS_SARIF_SEVERITIES_KEY_CLASSIC_EDITOR,
  constants.BRIDGE_BLACKDUCK_REPORTS_SARIF_SEVERITIES_KEY
);

export const BLACKDUCK_REPORTS_SARIF_GROUP_SCA_ISSUES =
  taskLib
    .getInput(constants.BLACKDUCK_REPORTS_SARIF_GROUP_SCA_ISSUES_KEY)
    ?.trim() ||
  taskLib
    .getInput(
      constants.BLACKDUCK_REPORTS_SARIF_GROUP_SCA_ISSUES_KEY_CLASSIC_EDITOR
    )
    ?.trim() ||
  taskLib
    .getInput(constants.BRIDGE_BLACKDUCK_REPORTS_SARIF_GROUP_SCA_ISSUES)
    ?.trim() ||
  "";

export const RETURN_STATUS =
  taskLib.getInput(constants.RETURN_STATUS_KEY)?.trim() ||
  taskLib.getInput(constants.RETURN_STATUS_KEY_CLASSIC_EDITOR)?.trim() ||
  "";
