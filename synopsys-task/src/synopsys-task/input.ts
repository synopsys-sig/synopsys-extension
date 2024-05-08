import * as taskLib from "azure-pipelines-task-lib/task";
import * as constants from "./application-constant";

const deprecatedInputs: string[] = [];

export function getDelimitedInput(
  newKey: string,
  classicEditorKey: string,
  deprecatedKey: string
) {
  const newKeyInput = taskLib.getDelimitedInput(newKey, ",");
  const classicEditorInput = taskLib.getDelimitedInput(classicEditorKey, ",");
  const deprecatedInput = taskLib.getDelimitedInput(deprecatedKey, ",");

  if (deprecatedInput.length > 0) {
    deprecatedInputs.push(deprecatedKey);
  }

  return (
    (newKeyInput.length > 0 && newKeyInput) ||
    (classicEditorInput.length > 0 && classicEditorInput) ||
    (deprecatedInput.length > 0 && deprecatedInput) ||
    []
  );
}

export function showLogForDeprecatedInputs() {
  if (deprecatedInputs.length > 0) {
    taskLib.warning(
      `[${deprecatedInputs.join(
        ","
      )}] is/are deprecated. Check documentation for new parameters: ${
        constants.SYNOPSYS_SECURITY_SCAN_AZURE_DEVOPS_DOCS_URL
      }`
    );
  }
}

export function getDeprecatedInput<T>(
  deprecatedKey: string,
  getInputMethod: (key: string) => T | undefined
): T | undefined {
  const deprecatedInput = getInputMethod(deprecatedKey);
  if (deprecatedInput) {
    deprecatedInputs.push(deprecatedKey);
  }
  return deprecatedInput;
}

//Bridge download url
export const BRIDGE_DOWNLOAD_URL =
  taskLib.getInput(constants.SYNOPSYS_BRIDGE_DOWNLOAD_URL_KEY)?.trim() ||
  taskLib
    .getInput(constants.SYNOPSYS_BRIDGE_DOWNLOAD_URL_KEY_CLASSIC_EDITOR)
    ?.trim() ||
  getDeprecatedInput(
    constants.BRIDGE_DOWNLOAD_URL_KEY,
    taskLib.getInput
  )?.trim() ||
  "";

export const ENABLE_NETWORK_AIRGAP =
  taskLib.getBoolInput(constants.NETWORK_AIRGAP_KEY) ||
  taskLib.getBoolInput(constants.NETWORK_AIRGAP_KEY_CLASSIC_EDITOR) ||
  getDeprecatedInput(constants.BRIDGE_NETWORK_AIRGAP_KEY, taskLib.getBoolInput);

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
  taskLib.getInput(constants.SYNOPSYS_BRIDGE_DOWNLOAD_VERSION_KEY)?.trim() ||
  taskLib
    .getInput(constants.SYNOPSYS_BRIDGE_DOWNLOAD_VERSION_KEY_CLASSIC_EDITOR)
    ?.trim() ||
  getDeprecatedInput(
    constants.BRIDGE_DOWNLOAD_VERSION_KEY,
    taskLib.getInput
  )?.trim() ||
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
  getDeprecatedInput(
    constants.BRIDGE_POLARIS_SERVER_URL_KEY,
    taskLib.getInput
  )?.trim() ||
  "";
export const POLARIS_ACCESS_TOKEN =
  taskLib.getInput(constants.POLARIS_ACCESS_TOKEN_KEY)?.trim() ||
  taskLib.getInput(constants.POLARIS_ACCESS_TOKEN_KEY_CLASSIC_EDITOR)?.trim() ||
  getDeprecatedInput(
    constants.BRIDGE_POLARIS_ACCESS_TOKEN_KEY,
    taskLib.getInput
  )?.trim() ||
  "";
export const POLARIS_APPLICATION_NAME =
  taskLib.getInput(constants.POLARIS_APPLICATION_NAME_KEY)?.trim() ||
  taskLib
    .getInput(constants.POLARIS_APPLICATION_NAME_KEY_CLASSIC_EDITOR)
    ?.trim() ||
  getDeprecatedInput(
    constants.BRIDGE_POLARIS_APPLICATION_NAME_KEY,
    taskLib.getInput
  )?.trim() ||
  "";
export const POLARIS_PROJECT_NAME =
  taskLib.getInput(constants.POLARIS_PROJECT_NAME_KEY)?.trim() ||
  taskLib.getInput(constants.POLARIS_PROJECT_NAME_KEY_CLASSIC_EDITOR)?.trim() ||
  getDeprecatedInput(
    constants.BRIDGE_POLARIS_PROJECT_NAME_KEY,
    taskLib.getInput
  )?.trim() ||
  "";
export const POLARIS_ASSESSMENT_TYPES = getDelimitedInput(
  constants.POLARIS_ASSESSMENT_TYPES_KEY,
  constants.POLARIS_ASSESSMENT_TYPES_KEY_CLASSIC_EDITOR,
  constants.BRIDGE_POLARIS_ASSESSMENT_TYPES_KEY
);
export const POLARIS_TRIAGE =
  taskLib.getInput(constants.POLARIS_TRIAGE_KEY)?.trim() ||
  taskLib.getInput(constants.POLARIS_TRIAGE_KEY_CLASSIC_EDITOR)?.trim() ||
  getDeprecatedInput(
    constants.BRIDGE_POLARIS_TRIAGE_KEY,
    taskLib.getInput
  )?.trim() ||
  "";
export const POLARIS_BRANCH_NAME =
  taskLib.getInput(constants.POLARIS_BRANCH_NAME_KEY)?.trim() ||
  taskLib.getInput(constants.POLARIS_BRANCH_NAME_KEY_CLASSIC_EDITOR)?.trim() ||
  getDeprecatedInput(
    constants.BRIDGE_POLARIS_BRANCH_NAME_KEY,
    taskLib.getInput
  )?.trim() ||
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
  getDeprecatedInput(
    constants.BRIDGE_POLARIS_PR_COMMENT_ENABLED_KEY,
    taskLib.getInput
  )?.trim() ||
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
  getDeprecatedInput(
    constants.BRIDGE_POLARIS_TEST_SCA_TYPE_KEY,
    taskLib.getInput
  )?.trim() ||
  "";

export const POLARIS_REPORTS_SARIF_CREATE =
  taskLib.getInput(constants.POLARIS_REPORTS_SARIF_CREATE_KEY)?.trim() ||
  taskLib
    .getInput(constants.POLARIS_REPORTS_SARIF_CREATE_KEY_CLASSIC_EDITOR)
    ?.trim() ||
  getDeprecatedInput(
    constants.BRIDGE_POLARIS_REPORTS_SARIF_CREATE_KEY,
    taskLib.getInput
  )?.trim() ||
  "";
export const POLARIS_REPORTS_SARIF_FILE_PATH =
  taskLib.getInput(constants.POLARIS_REPORTS_SARIF_FILE_PATH_KEY)?.trim() ||
  taskLib
    .getInput(constants.POLARIS_REPORTS_SARIF_FILE_PATH_KEY_CLASSIC_EDITOR)
    ?.trim() ||
  getDeprecatedInput(
    constants.BRIDGE_POLARIS_REPORTS_SARIF_FILE_PATH_KEY,
    taskLib.getInput
  )?.trim() ||
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
  getDeprecatedInput(
    constants.BRIDGE_POLARIS_REPORTS_SARIF_GROUP_SCA_ISSUES_KEY,
    taskLib.getInput
  )?.trim() ||
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
  getDeprecatedInput(
    constants.BRIDGE_COVERITY_URL_KEY,
    taskLib.getInput
  )?.trim() ||
  "";
export const COVERITY_USER =
  taskLib.getInput(constants.COVERITY_USER_KEY)?.trim() ||
  taskLib.getInput(constants.COVERITY_USER_KEY_CLASSIC_EDITOR)?.trim() ||
  getDeprecatedInput(
    constants.BRIDGE_COVERITY_USER_NAME_KEY,
    taskLib.getInput
  )?.trim() ||
  "";
export const COVERITY_USER_PASSWORD =
  taskLib.getInput(constants.COVERITY_PASSPHRASE_KEY)?.trim() ||
  taskLib.getInput(constants.COVERITY_PASSPHRASE_KEY_CLASSIC_EDITOR)?.trim() ||
  getDeprecatedInput(
    constants.BRIDGE_COVERITY_USER_PASSWORD_KEY,
    taskLib.getInput
  )?.trim() ||
  "";
export const COVERITY_PROJECT_NAME =
  taskLib.getInput(constants.COVERITY_PROJECT_NAME_KEY)?.trim() ||
  taskLib
    .getInput(constants.COVERITY_PROJECT_NAME_KEY_CLASSIC_EDITOR)
    ?.trim() ||
  getDeprecatedInput(
    constants.BRIDGE_COVERITY_PROJECT_NAME_KEY,
    taskLib.getInput
  )?.trim() ||
  "";
export const COVERITY_STREAM_NAME =
  taskLib.getInput(constants.COVERITY_STREAM_NAME_KEY)?.trim() ||
  taskLib.getInput(constants.COVERITY_STREAM_NAME_KEY_CLASSIC_EDITOR)?.trim() ||
  getDeprecatedInput(
    constants.BRIDGE_COVERITY_STREAM_NAME_KEY,
    taskLib.getInput
  )?.trim() ||
  "";
export const COVERITY_INSTALL_DIRECTORY =
  taskLib.getPathInput(constants.COVERITY_INSTALL_DIRECTORY_KEY)?.trim() ||
  taskLib
    .getPathInput(constants.COVERITY_INSTALL_DIRECTORY_KEY_CLASSIC_EDITOR)
    ?.trim() ||
  getDeprecatedInput(
    constants.BRIDGE_COVERITY_INSTALL_DIRECTORY_KEY,
    taskLib.getPathInput
  )?.trim() ||
  "";
export const COVERITY_POLICY_VIEW =
  taskLib.getInput(constants.COVERITY_POLICY_VIEW_KEY)?.trim() ||
  taskLib.getInput(constants.COVERITY_POLICY_VIEW_KEY_CLASSIC_EDITOR)?.trim() ||
  getDeprecatedInput(
    constants.BRIDGE_COVERITY_POLICY_VIEW_KEY,
    taskLib.getInput
  )?.trim() ||
  "";
export const COVERITY_LOCAL =
  taskLib.getInput(constants.COVERITY_LOCAL_KEY)?.trim() ||
  taskLib.getInput(constants.COVERITY_LOCAL_KEY_CLASSIC_EDITOR)?.trim() ||
  getDeprecatedInput(
    constants.BRIDGE_COVERITY_LOCAL_KEY,
    taskLib.getInput
  )?.trim() ||
  "";
export const COVERITY_AUTOMATION_PRCOMMENT =
  taskLib.getInput(constants.COVERITY_PRCOMMENT_ENABLED_KEY) ||
  taskLib.getInput(constants.COVERITY_PRCOMMENT_ENABLED_KEY_CLASSIC_EDITOR) ||
  getDeprecatedInput(
    constants.BRIDGE_COVERITY_AUTOMATION_PRCOMMENT_KEY,
    taskLib.getInput
  )?.trim() ||
  "";
export const COVERITY_VERSION =
  taskLib.getInput(constants.COVERITY_VERSION_KEY)?.trim() ||
  taskLib.getInput(constants.COVERITY_VERSION_KEY_CLASSIC_EDITOR)?.trim() ||
  getDeprecatedInput(
    constants.BRIDGE_COVERITY_VERSION_KEY,
    taskLib.getInput
  )?.trim() ||
  "";

// Blackduck related inputs
export const BLACKDUCK_URL =
  taskLib.getInput(constants.BLACKDUCK_URL_KEY)?.trim() ||
  taskLib.getInput(constants.BLACKDUCK_URL_KEY)?.trim() ||
  getDeprecatedInput(
    constants.BRIDGE_BLACKDUCK_URL_KEY,
    taskLib.getInput
  )?.trim() ||
  "";
export const BLACKDUCK_API_TOKEN =
  taskLib.getInput(constants.BLACKDUCK_TOKEN_KEY)?.trim() ||
  taskLib.getInput(constants.BLACKDUCK_TOKEN_KEY_CLASSIC_EDITOR)?.trim() ||
  getDeprecatedInput(
    constants.BRIDGE_BLACKDUCK_API_TOKEN_KEY,
    taskLib.getInput
  )?.trim() ||
  "";
export const BLACKDUCK_INSTALL_DIRECTORY =
  taskLib.getPathInput(constants.BLACKDUCK_INSTALL_DIRECTORY_KEY)?.trim() ||
  taskLib
    .getPathInput(constants.BLACKDUCK_INSTALL_DIRECTORY_KEY_CLASSIC_EDITOR)
    ?.trim() ||
  getDeprecatedInput(
    constants.BRIDGE_BLACKDUCK_INSTALL_DIRECTORY_KEY,
    taskLib.getPathInput
  )?.trim() ||
  "";
export const BLACKDUCK_SCAN_FULL =
  taskLib.getInput(constants.BLACKDUCK_SCAN_FULL_KEY)?.trim() ||
  taskLib.getInput(constants.BLACKDUCK_SCAN_FULL_KEY_CLASSIC_EDITOR)?.trim() ||
  getDeprecatedInput(
    constants.BRIDGE_BLACKDUCK_SCAN_FULL_KEY,
    taskLib.getInput
  )?.trim() ||
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
  getDeprecatedInput(
    constants.BRIDGE_BLACKDUCK_FIXPR_ENABLED_KEY,
    taskLib.getInput
  )?.trim() ||
  "";
export const BLACKDUCK_AUTOMATION_PRCOMMENT =
  taskLib.getInput(constants.BLACKDUCK_PRCOMMENT_ENABLED_KEY) ||
  taskLib.getInput(constants.BLACKDUCK_PRCOMMENT_ENABLED_KEY_CLASSIC_EDITOR) ||
  getDeprecatedInput(
    constants.BRIDGE_BLACKDUCK_AUTOMATION_PRCOMMENT_KEY,
    taskLib.getInput
  )?.trim() ||
  "";
export const BLACKDUCK_FIXPR_MAXCOUNT =
  taskLib.getInput(constants.BLACKDUCK_FIXPR_MAXCOUNT_KEY)?.trim() ||
  taskLib
    .getInput(constants.BLACKDUCK_FIXPR_MAXCOUNT_KEY_CLASSIC_EDITOR)
    ?.trim() ||
  getDeprecatedInput(
    constants.BRIDGE_BLACKDUCK_FIXPR_MAXCOUNT_KEY,
    taskLib.getInput
  )?.trim() ||
  "";
export const BLACKDUCK_FIXPR_CREATE_SINGLE_PR =
  taskLib.getInput(constants.BLACKDUCK_FIXPR_CREATE_SINGLE_PR_KEY)?.trim() ||
  taskLib
    .getInput(constants.BLACKDUCK_FIXPR_CREATE_SINGLE_PR_KEY_CLASSIC_EDITOR)
    ?.trim() ||
  getDeprecatedInput(
    constants.BRIDGE_BLACKDUCK_FIXPR_CREATE_SINGLE_PR_KEY,
    taskLib.getInput
  )?.trim() ||
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
  getDeprecatedInput(
    constants.BRIDGE_BLACKDUCK_REPORTS_SARIF_CREATE_KEY,
    taskLib.getInput
  )?.trim() ||
  "";
export const BLACKDUCK_REPORTS_SARIF_FILE_PATH =
  taskLib.getInput(constants.BLACKDUCK_REPORTS_SARIF_FILE_PATH_KEY)?.trim() ||
  taskLib
    .getInput(constants.BLACKDUCK_REPORTS_SARIF_FILE_PATH_KEY_CLASSIC_EDITOR)
    ?.trim() ||
  getDeprecatedInput(
    constants.BRIDGE_BLACKDUCK_REPORTS_SARIF_FILE_PATH_KEY,
    taskLib.getInput
  )?.trim() ||
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
  getDeprecatedInput(
    constants.BRIDGE_BLACKDUCK_REPORTS_SARIF_GROUP_SCA_ISSUES,
    taskLib.getInput
  )?.trim() ||
  "";
