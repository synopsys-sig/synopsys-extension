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
export const BLACKDUCK_KEY = "blackduck";

export const AZURE_TOKEN_KEY = "azure_token";
export const SCAN_TYPE_KEY = "scanType";

// Polaris
export const POLARIS_ACCESS_TOKEN_KEY = "bridge_polaris_accessToken";
export const POLARIS_APPLICATION_NAME_KEY = "bridge_polaris_application_name";
export const POLARIS_PROJECT_NAME_KEY = "bridge_polaris_project_name";
export const POLARIS_ASSESSMENT_TYPES_KEY = "bridge_polaris_assessment_types";
export const POLARIS_SERVER_URL_KEY = "bridge_polaris_serverUrl";
export const POLARIS_TRIAGE_KEY = "bridge_polaris_triage";
export const POLARIS_BRANCH_NAME_KEY = "bridge_polaris_branch_name";
export const POLARIS_PR_COMMENT_ENABLED_KEY =
  "bridge_polaris_prcomment_enabled";
export const POLARIS_PR_COMMENT_ENABLED_KEY_CLASSIC_EDITOR =
  "polarisPRCommentEnabled";
export const POLARIS_PR_COMMENT_SEVERITIES_KEY =
  "bridge_polaris_prcomment_severities";
export const POLARIS_PR_COMMENT_SEVERITIES_KEY_CLASSIC_EDITOR =
  "polarisPRCommentSeverities";
export const POLARIS_TEST_SCA_TYPE_KEY = "bridge_polaris_test_sca_type";
export const POLARIS_TEST_SCA_TYPE_KEY_CLASSIC_EDITOR = "polarisTestScaType";
export const POLARIS_REPORTS_SARIF_CREATE_KEY =
  "bridge_polaris_reports_sarif_create";
export const POLARIS_REPORTS_SARIF_CREATE_KEY_CLASSIC_EDITOR =
  "polarisReportsSarifCreate";
export const POLARIS_REPORTS_SARIF_FILE_PATH_KEY =
  "bridge_polaris_reports_sarif_file_path";
export const POLARIS_REPORTS_SARIF_FILE_PATH_KEY_CLASSIC_EDITOR =
  "polarisReportsSarifFilePath";
export const POLARIS_REPORTS_SARIF_SEVERITIES_KEY =
  "bridge_polaris_reports_sarif_severities";
export const POLARIS_REPORTS_SARIF_SEVERITIES_KEY_CLASSIC_EDITOR =
  "polarisReportsSarifSeverities";
export const POLARIS_REPORTS_SARIF_GROUP_SCA_ISSUES_KEY =
  "bridge_polaris_reports_sarif_groupSCAIssues";
export const POLARIS_REPORTS_SARIF_GROUP_SCA_ISSUES_KEY_CLASSIC_EDITOR =
  "polarisReportsSarifGroupSCAIssues";
export const POLARIS_REPORTS_SARIF_ISSUE_TYPES_KEY =
  "bridge_polaris_reports_sarif_issue_types";
export const POLARIS_REPORTS_SARIF_ISSUE_TYPES_KEY_CLASSIC_EDITOR =
  "polarisReportsSarifIssueTypes";

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
export const COVERITY_AUTOMATION_PRCOMMENT_KEY =
  "bridge_coverity_automation_prcomment";
export const COVERITY_LOCAL_KEY = "bridge_coverity_local";
export const COVERITY_VERSION_KEY = "bridge_coverity_version";

// Bridge Exit Codes
export const EXIT_CODE_MAP = new Map<string, string>([
  ["0", "Bridge execution successfully completed"],
  ["1", "Undefined error, check error logs"],
  ["2", "Error from adapter end"],
  ["3", "Failed to shutdown the bridge"],
  ["8", "The config option bridge.break has been set to true"],
  ["9", "Bridge initialization failed"],
]);

// Blackduck
export const BLACKDUCK_URL_KEY = "bridge_blackduck_url";
export const BLACKDUCK_API_TOKEN_KEY = "bridge_blackduck_token";
export const BLACKDUCK_INSTALL_DIRECTORY_KEY =
  "bridge_blackduck_install_directory";
export const BLACKDUCK_SCAN_FULL_KEY = "bridge_blackduck_scan_full";
export const BLACKDUCK_SCAN_FAILURE_SEVERITIES_KEY =
  "bridge_blackduck_scan_failure_severities";
export const BLACKDUCK_AUTOMATION_PRCOMMENT_KEY =
  "bridge_blackduck_automation_prcomment";
export const BLACKDUCK_AUTOMATION_FIXPR_KEY =
  "bridge_blackduck_automation_fixpr";
export const BLACKDUCK_FIXPR_ENABLED_KEY = "bridge_blackduck_fixpr_enabled";
export const BLACKDUCK_FIXPR_MAXCOUNT_KEY = "bridge_blackduck_fixpr_maxCount";
export const BLACKDUCK_FIXPR_CREATE_SINGLE_PR_KEY =
  "bridge_blackduck_fixpr_createSinglePR";
export const BLACKDUCK_FIXPR_FILTER_SEVERITIES_KEY =
  "bridge_blackduck_fixpr_filter_severities";
export const BLACKDUCK_FIXPR_UPGRADE_GUIDANCE_KEY =
  "bridge_blackduck_fixpr_useUpgradeGuidance";

export const INCLUDE_DIAGNOSTICS_KEY = "include_diagnostics";

export const BLACKDUCK_REPORTS_SARIF_CREATE_KEY =
  "bridge_blackduck_reports_sarif_create";
export const BLACKDUCK_REPORTS_SARIF_CREATE_CLASSIC_EDITOR =
  "blackduckReportsSarifCreate";

export const BLACKDUCK_REPORTS_SARIF_FILE_PATH_KEY =
  "bridge_blackduck_reports_sarif_file_path";
export const BLACKDUCK_REPORTS_SARIF_FILE_PATH_CLASSIC_EDITOR =
  "blackduckReportsSarifFilePath";

export const BLACKDUCK_REPORTS_SARIF_SEVERITIES_KEY =
  "bridge_blackduck_reports_sarif_severities";
export const BLACKDUCK_REPORTS_SARIF_SEVERITIES_CLASSIC_EDITOR =
  "blackduckReportsSarifSeverities";

export const BLACKDUCK_REPORTS_SARIF_GROUP_SCA_ISSUES =
  "bridge_blackduck_reports_sarif_groupSCAIssues";
export const BLACKDUCK_REPORTS_SARIF_GROUP_SCA_ISSUES_CLASSIC_EDITOR =
  "blackduckReportsSarifGroupSCAIssues";

export const UPLOAD_FOLDER_ARTIFACT_NAME = "synopsys_bridge_diagnostics";
export const BRIDGE_LOCAL_DIRECTORY = ".bridge";
export const SARIF_DEFAULT_FILE_NAME = "report.sarif.json";
export const DEFAULT_BLACKDUCK_SARIF_GENERATOR_DIRECTORY =
  "Blackduck SARIF Generator";
export const DEFAULT_POLARIS_SARIF_GENERATOR_DIRECTORY =
  "Polaris SARIF Generator";
export const SARIF_UPLOAD_FOLDER_ARTIFACT_NAME = "sarif_report";
export const RETRY_DELAY_IN_MILLISECONDS = 15000;
export const RETRY_COUNT = 3;
export const NON_RETRY_HTTP_CODES = new Set([200, 201, 401, 403, 416]);
export const WINDOWS_PLATFORM = "win64";
export const LINUX_PLATFORM = "linux64";
export const MAC_ARM_PLATFORM = "macos_arm";
export const MAC_INTEL_PLATFORM = "macosx";
export const MIN_SUPPORTED_SYNOPSYS_BRIDGE_MAC_ARM_VERSION = "2.1.0";
