import { ErrorCode } from "./enum/ErrorCodes";
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
export const SRM_KEY = "srm";

export const AZURE_TOKEN_KEY = "azure_token";
export const AZURE_TOKEN_KEY_CLASSIC_EDITOR = "azure_token";
export const SCAN_TYPE_KEY = "scanType";

// Polaris
/**
 * @deprecated Use polaris_server_url instead. This can be removed in future release.
 */
export const BRIDGE_POLARIS_SERVER_URL_KEY = "bridge_polaris_serverUrl";
export const POLARIS_SERVER_URL_KEY = "polaris_server_url";
export const POLARIS_SERVER_URL_KEY_CLASSIC_EDITOR = "bridge_polaris_serverUrl";
/**
 * @deprecated Use polaris_access_token instead. This can be removed in future release.
 */
export const BRIDGE_POLARIS_ACCESS_TOKEN_KEY = "bridge_polaris_accessToken";
export const POLARIS_ACCESS_TOKEN_KEY = "polaris_access_token";
export const POLARIS_ACCESS_TOKEN_KEY_CLASSIC_EDITOR =
  "bridge_polaris_accessToken";
/**
 * @deprecated Use polaris_application_name instead. This can be removed in future release.
 */
export const BRIDGE_POLARIS_APPLICATION_NAME_KEY =
  "bridge_polaris_application_name";
export const POLARIS_APPLICATION_NAME_KEY = "polaris_application_name";
export const POLARIS_APPLICATION_NAME_KEY_CLASSIC_EDITOR =
  "bridge_polaris_application_name";
/**
 * @deprecated Use polaris_project_name instead. This can be removed in future release.
 */
export const BRIDGE_POLARIS_PROJECT_NAME_KEY = "bridge_polaris_project_name";
export const POLARIS_PROJECT_NAME_KEY = "polaris_project_name";
export const POLARIS_PROJECT_NAME_KEY_CLASSIC_EDITOR =
  "bridge_polaris_project_name";
/**
 * @deprecated Use polaris_assessment_types instead. This can be removed in future release.
 */
export const BRIDGE_POLARIS_ASSESSMENT_TYPES_KEY =
  "bridge_polaris_assessment_types";
export const POLARIS_ASSESSMENT_TYPES_KEY = "polaris_assessment_types";
export const POLARIS_ASSESSMENT_TYPES_KEY_CLASSIC_EDITOR =
  "bridge_polaris_assessment_types";
/**
 * @deprecated Use polaris_triage instead. This can be removed in future release.
 */
export const BRIDGE_POLARIS_TRIAGE_KEY = "bridge_polaris_triage";
export const POLARIS_TRIAGE_KEY = "polaris_triage";
export const POLARIS_TRIAGE_KEY_CLASSIC_EDITOR = "bridge_polaris_triage";
/**
 * @deprecated Use polaris_branch_name instead. This can be removed in future release.
 */
export const BRIDGE_POLARIS_BRANCH_NAME_KEY = "bridge_polaris_branch_name";
export const POLARIS_BRANCH_NAME_KEY = "polaris_branch_name";
export const POLARIS_BRANCH_NAME_KEY_CLASSIC_EDITOR =
  "bridge_polaris_branch_name";

export const POLARIS_BRANCH_PARENT_NAME_KEY = "polaris_branch_parent_name";
export const POLARIS_BRANCH_PARENT_NAME_KEY_CLASSIC_EDITOR =
  "polarisBranchParentName";
/**
 * @deprecated Use polaris_prComment_enabled instead. This can be removed in future release.
 */
export const BRIDGE_POLARIS_PR_COMMENT_ENABLED_KEY =
  "bridge_polaris_prcomment_enabled";
export const POLARIS_PR_COMMENT_ENABLED_KEY = "polaris_prComment_enabled";
export const POLARIS_PR_COMMENT_ENABLED_KEY_CLASSIC_EDITOR =
  "polarisPRCommentEnabled";
/**
 * @deprecated Use polaris_prComment_severities instead. This can be removed in future release.
 */
export const BRIDGE_POLARIS_PR_COMMENT_SEVERITIES_KEY =
  "bridge_polaris_prcomment_severities";
export const POLARIS_PR_COMMENT_SEVERITIES_KEY = "polaris_prComment_severities";
export const POLARIS_PR_COMMENT_SEVERITIES_KEY_CLASSIC_EDITOR =
  "polarisPRCommentSeverities";
/**
 * @deprecated Use polaris_reports_sarif_create instead. This can be removed in future release.
 */
export const BRIDGE_POLARIS_REPORTS_SARIF_CREATE_KEY =
  "bridge_polaris_reports_sarif_create";
export const POLARIS_REPORTS_SARIF_CREATE_KEY = "polaris_reports_sarif_create";
export const POLARIS_REPORTS_SARIF_CREATE_KEY_CLASSIC_EDITOR =
  "polarisReportsSarifCreate";
/**
 * @deprecated Use polaris_reports_sarif_file_path instead. This can be removed in future release.
 */
export const BRIDGE_POLARIS_REPORTS_SARIF_FILE_PATH_KEY =
  "bridge_polaris_reports_sarif_file_path";
export const POLARIS_REPORTS_SARIF_FILE_PATH_KEY =
  "polaris_reports_sarif_file_path";
export const POLARIS_REPORTS_SARIF_FILE_PATH_KEY_CLASSIC_EDITOR =
  "polarisReportsSarifFilePath";
/**
 * @deprecated Use polaris_reports_sarif_severities instead. This can be removed in future release.
 */
export const BRIDGE_POLARIS_REPORTS_SARIF_SEVERITIES_KEY =
  "bridge_polaris_reports_sarif_severities";
export const POLARIS_REPORTS_SARIF_SEVERITIES_KEY =
  "polaris_reports_sarif_severities";
export const POLARIS_REPORTS_SARIF_SEVERITIES_KEY_CLASSIC_EDITOR =
  "polarisReportsSarifSeverities";
/**
 * @deprecated Use polaris_reports_sarif_groupSCAIssues instead. This can be removed in future release.
 */
export const BRIDGE_POLARIS_REPORTS_SARIF_GROUP_SCA_ISSUES_KEY =
  "bridge_polaris_reports_sarif_groupSCAIssues";
export const POLARIS_REPORTS_SARIF_GROUP_SCA_ISSUES_KEY =
  "polaris_reports_sarif_groupSCAIssues";
export const POLARIS_REPORTS_SARIF_GROUP_SCA_ISSUES_KEY_CLASSIC_EDITOR =
  "polarisReportsSarifGroupSCAIssues";
/**
 * @deprecated Use polaris_reports_sarif_issue_types instead. This can be removed in future release.
 */
export const BRIDGE_POLARIS_REPORTS_SARIF_ISSUE_TYPES_KEY =
  "bridge_polaris_reports_sarif_issue_types";
export const POLARIS_REPORTS_SARIF_ISSUE_TYPES_KEY =
  "polaris_reports_sarif_issue_types";
export const POLARIS_REPORTS_SARIF_ISSUE_TYPES_KEY_CLASSIC_EDITOR =
  "polarisReportsSarifIssueTypes";
export const POLARIS_ASSESSMENT_MODE_KEY = "polaris_assessment_mode";
export const POLARIS_ASSESSMENT_MODE_KEY_CLASSIC_EDITOR =
  "polarisAssessmentMode";
export const POLARIS_TEST_SCA_TYPE_KEY = "polaris_test_sca_type";
export const POLARIS_TEST_SCA_TYPE_KEY_CLASSIC_EDITOR = "polarisTestScaType";
export const POLARIS_PROJECT_DIRECTORY_KEY_CLASSIC_EDITOR =
  "polarisProjectDirectory";
export const PROJECT_SOURCE_ARCHIVE_KEY = "project_source_archive";
export const PROJECT_SOURCE_ARCHIVE_KEY_CLASSIC_EDITOR = "projectSourceArchive";
export const PROJECT_SOURCE_PRESERVE_SYM_LINKS_KEY =
  "project_source_preserveSymLinks";
export const PROJECT_SOURCE_PRESERVE_SYM_LINKS_KEY_CLASSIC_EDITOR =
  "projectSourcePreserveSymLinks";
export const PROJECT_SOURCE_EXCLUDES_KEY = "project_source_excludes";
export const PROJECT_SOURCE_EXCLUDES_KEY_CLASSIC_EDITOR =
  "projectSourceExcludes";

// Coverity
/**
 * @deprecated Use coverity_url instead. This can be removed in future release.
 */
export const BRIDGE_COVERITY_URL_KEY = "bridge_coverity_connect_url";
export const COVERITY_URL_KEY = "coverity_url";
export const COVERITY_URL_KEY_CLASSIC_EDITOR = "bridge_coverity_connect_url";
/**
 * @deprecated Use coverity_user instead. This can be removed in future release.
 */
export const BRIDGE_COVERITY_USER_NAME_KEY =
  "bridge_coverity_connect_user_name";
export const COVERITY_USER_KEY = "coverity_user";
export const COVERITY_USER_KEY_CLASSIC_EDITOR =
  "bridge_coverity_connect_user_name";
/**
 * @deprecated Use coverity_passphrase instead. This can be removed in future release.
 */
export const BRIDGE_COVERITY_USER_PASSWORD_KEY =
  "bridge_coverity_connect_user_password";
export const COVERITY_PASSPHRASE_KEY = "coverity_passphrase";
export const COVERITY_PASSPHRASE_KEY_CLASSIC_EDITOR =
  "bridge_coverity_connect_user_password";
/**
 * @deprecated Use coverity_project_name instead. This can be removed in future release.
 */
export const BRIDGE_COVERITY_PROJECT_NAME_KEY =
  "bridge_coverity_connect_project_name";
export const COVERITY_PROJECT_NAME_KEY = "coverity_project_name";
export const COVERITY_PROJECT_NAME_KEY_CLASSIC_EDITOR =
  "bridge_coverity_connect_project_name";
/**
 * @deprecated Use coverity_stream_name instead. This can be removed in future release.
 */
export const BRIDGE_COVERITY_STREAM_NAME_KEY =
  "bridge_coverity_connect_stream_name";
export const COVERITY_STREAM_NAME_KEY = "coverity_stream_name";
export const COVERITY_STREAM_NAME_KEY_CLASSIC_EDITOR =
  "bridge_coverity_connect_stream_name";
/**
 * @deprecated Use coverity_install_directory instead. This can be removed in future release.
 */
export const BRIDGE_COVERITY_INSTALL_DIRECTORY_KEY =
  "bridge_coverity_install_directory";
export const COVERITY_INSTALL_DIRECTORY_KEY = "coverity_install_directory";
export const COVERITY_INSTALL_DIRECTORY_KEY_CLASSIC_EDITOR =
  "bridge_coverity_install_directory";

export const COVERITY_EXECUTION_PATH_KEY = "coverity_execution_path";
export const COVERITY_EXECUTION_PATH_KEY_CLASSIC_EDITOR =
  "coverityExecutionPath";

/**
 * @deprecated Use coverity_policy_view instead. This can be removed in future release.
 */
export const BRIDGE_COVERITY_POLICY_VIEW_KEY =
  "bridge_coverity_connect_policy_view";
export const COVERITY_POLICY_VIEW_KEY = "coverity_policy_view";
export const COVERITY_POLICY_VIEW_KEY_CLASSIC_EDITOR =
  "bridge_coverity_connect_policy_view";
/**
 * @deprecated Use coverity_prComment_enabled instead. This can be removed in future release.
 */
export const BRIDGE_COVERITY_AUTOMATION_PRCOMMENT_KEY =
  "bridge_coverity_automation_prcomment";
export const COVERITY_PROJECT_DIRECTORY_KEY_CLASSIC_EDITOR =
  "coverityProjectDirectory";
export const COVERITY_PRCOMMENT_ENABLED_KEY = "coverity_prComment_enabled";
export const COVERITY_PRCOMMENT_ENABLED_KEY_CLASSIC_EDITOR =
  "bridge_coverity_automation_prcomment";
/**
 * @deprecated Use coverity_local instead. This can be removed in future release.
 */
export const BRIDGE_COVERITY_LOCAL_KEY = "bridge_coverity_local";
export const COVERITY_LOCAL_KEY = "coverity_local";
export const COVERITY_LOCAL_KEY_CLASSIC_EDITOR = "bridge_coverity_local";
/**
 * @deprecated Use coverity_version instead. This can be removed in future release.
 */
export const BRIDGE_COVERITY_VERSION_KEY = "bridge_coverity_version";
export const COVERITY_VERSION_KEY = "coverity_version";
export const COVERITY_VERSION_KEY_CLASSIC_EDITOR = "bridge_coverity_version";
export const COVERITY_BUILD_COMMAND_KEY = "coverity_build_command";
export const COVERITY_BUILD_COMMAND_KEY_CLASSIC_EDITOR = "coverityBuildCommand";
export const COVERITY_BUILD_COMMAND_KEY_CLASSIC_EDITOR_FOR_POLARIS =
  "coverityBuildCommandForPolaris";
export const COVERITY_BUILD_COMMAND_KEY_CLASSIC_EDITOR_FOR_SRM =
  "coverityBuildCommandForSrm";
export const COVERITY_CLEAN_COMMAND_KEY = "coverity_clean_command";
export const COVERITY_CLEAN_COMMAND_KEY_CLASSIC_EDITOR = "coverityCleanCommand";
export const COVERITY_CLEAN_COMMAND_KEY_CLASSIC_EDITOR_FOR_POLARIS =
  "coverityCleanCommandForPolaris";
export const COVERITY_CLEAN_COMMAND_KEY_CLASSIC_EDITOR_FOR_SRM =
  "coverityCleanCommandForSrm";
export const COVERITY_CONFIG_PATH_KEY = "coverity_config_path";
export const COVERITY_CONFIG_PATH_KEY_CLASSIC_EDITOR = "coverityConfigPath";
export const COVERITY_CONFIG_PATH_KEY_CLASSIC_EDITOR_FOR_POLARIS =
  "coverityConfigPathForPolaris";
export const COVERITY_CONFIG_PATH_KEY_CLASSIC_EDITOR_FOR_SRM =
  "coverityConfigPathForSrm";
export const COVERITY_ARGS_KEY = "coverity_args";
export const COVERITY_ARGS_KEY_CLASSIC_EDITOR = "coverityArgs";
export const COVERITY_ARGS_KEY_CLASSIC_EDITOR_FOR_POLARIS =
  "coverityArgsForPolaris";
export const COVERITY_ARGS_KEY_CLASSIC_EDITOR_FOR_SRM = "coverityArgsForSrm";

// Bridge and ADO Exit Codes
export const EXIT_CODE_MAP = new Map<string, string>([
  [
    ErrorCode.SUCCESSFULLY_COMPLETED.toString(),
    "Bridge execution successfully completed",
  ],
  [
    ErrorCode.UNDEFINED_ERROR_FROM_BRIDGE.toString(),
    "Undefined error, check error logs",
  ],
  [ErrorCode.ADAPTER_ERROR.toString(), "Error from adapter end"],
  [
    ErrorCode.BRIDGE_SHUTDOWN_FAILURE.toString(),
    "Failed to shutdown the bridge",
  ],
  [
    ErrorCode.BRIDGE_BREAK_ENABLED.toString(),
    "The config option bridge.break has been set to true",
  ],
  [
    ErrorCode.BRIDGE_INITIALIZATION_FAILED.toString(),
    "Bridge initialization failed",
  ],
  // The list of ADO extension related error codes begins below
  [
    ErrorCode.MISSING_AT_LEAST_ONE_SCAN_TYPE.toString(),
    "Requires at least one scan type",
  ],
  [
    ErrorCode.MISSING_REQUIRED_PARAMETERS.toString(),
    "Required Parameters for Scan Type (Polaris/BlackDuck/Coverity/SRM) are missing",
  ],
  [
    ErrorCode.AGENT_TEMP_DIRECTORY_NOT_SET.toString(),
    "Agent.TempDirectory is not set",
  ],
  [
    ErrorCode.BLACKDUCK_FIXPR_MAX_COUNT_NOT_APPLICABLE.toString(),
    "blackduck_fixpr_maxCount is not applicable with blackduck_fixpr_createSinglePR",
  ],
  [
    ErrorCode.INVALID_POLARIS_ASSESSMENT_TYPES.toString(),
    "Invalid value for polaris_assessment_types",
  ],
  [
    ErrorCode.INVALID_BLACKDUCK_FAILURE_SEVERITIES.toString(),
    "Invalid value for blackduck_scan_failure_severities",
  ],
  [
    ErrorCode.INVALID_BLACKDUCK_FIXPR_MAXCOUNT.toString(),
    "Invalid value for blackduck_fixpr_maxCount",
  ],
  [
    ErrorCode.MISSING_BOOLEAN_VALUE.toString(),
    "Missing boolean value for blackduck_scan_full",
  ],
  [
    ErrorCode.INVALID_SYNOPSYS_BRIDGE_URL.toString(),
    "Provided Synopsys Bridge URL is not valid for the configured platform runner",
  ],
  [
    ErrorCode.SYNOPSYS_BRIDGE_URL_CANNOT_BE_EMPTY.toString(),
    "Provided Synopsys Bridge URL cannot be empty",
  ],
  [
    ErrorCode.INVALID_URL.toString(),
    "Invalid URL (Invalid Synopysys Bridge Download URL)",
  ],
  [
    ErrorCode.SYNOPSYS_BRIDGE_VERSION_NOT_FOUND.toString(),
    "Provided Synopsys Bridge version not found in artifactory",
  ],
  [
    ErrorCode.SYNOPSYS_BRIDGE_DOWNLOAD_FAILED.toString(),
    "Synopsys bridge download has been failed",
  ],
  [
    ErrorCode.BRIDGE_INSTALL_DIRECTORY_NOT_EXIST.toString(),
    "Synopsys Bridge Install Directory does not exist",
  ],
  [
    ErrorCode.DEFAULT_DIRECTORY_NOT_FOUND.toString(),
    "Synopsys Bridge default directory does not exist",
  ],
  [
    ErrorCode.BRIDGE_EXECUTABLE_NOT_FOUND.toString(),
    "Synopsys Bridge executable file could not be found at executable Bridge path",
  ],
  [
    ErrorCode.WORKSPACE_DIRECTORY_NOT_FOUND.toString(),
    "Workspace directory could not be located",
  ],
  [
    ErrorCode.FILE_DOES_NOT_EXIST.toString(),
    "File (Synopsys Bridge zip) does not exist",
  ],
  [
    ErrorCode.NO_DESTINATION_DIRECTORY.toString(),
    "No destination directory found for unzipping Synopsys Bridge",
  ],
  [
    ErrorCode.FAILED_TO_GET_PULL_REQUEST_INFO_FROM_SOURCE_BRANCH.toString(),
    "Failed to get pull request Id for current build from source branch",
  ],
  [
    ErrorCode.MISSING_AZURE_TOKEN.toString(),
    "Missing required azure token for fix pull request/automation comment",
  ],
  [
    ErrorCode.INVALID_COVERITY_INSTALL_DIRECTORY.toString(),
    "coverity_install_directory parameter for Coverity is invalid",
  ],
  [
    ErrorCode.REQUIRED_COVERITY_STREAM_NAME_FOR_MANUAL_TRIGGER.toString(),
    "COVERITY_STREAM_NAME is mandatory for azure manual trigger",
  ],
  [
    ErrorCode.DOWNLOAD_FAILED_WITH_HTTP_STATUS_CODE.toString(),
    "Failed to download synopsys-bridge zip from specified URL. HTTP status code: ",
  ],
  [
    ErrorCode.CONTENT_LENGTH_MISMATCH.toString(),
    "Content-Length of synopsys-bridge in the artifactory did not match downloaded file size",
  ],
  [
    ErrorCode.UNDEFINED_ERROR_FROM_EXTENSION.toString(),
    "Undefined error from extension",
  ],
]);

export const SPACE = " ";

// Blackduck
/**
 * @deprecated Use blackduck_url instead. This can be removed in future release.
 */
export const BRIDGE_BLACKDUCK_URL_KEY = "bridge_blackduck_url";
export const BLACKDUCK_URL_KEY = "blackduck_url";
export const BLACKDUCK_URL_KEY_CLASSIC_EDITOR = "bridge_blackduck_url";
/**
 * @deprecated Use blackduck_token instead. This can be removed in future release.
 */
export const BRIDGE_BLACKDUCK_API_TOKEN_KEY = "bridge_blackduck_token";
export const BLACKDUCK_TOKEN_KEY = "blackduck_token";
export const BLACKDUCK_TOKEN_KEY_CLASSIC_EDITOR = "bridge_blackduck_token";
/**
 * @deprecated Use blackduck_install_directory instead. This can be removed in future release.
 */
export const BRIDGE_BLACKDUCK_INSTALL_DIRECTORY_KEY =
  "bridge_blackduck_install_directory";
export const BLACKDUCK_INSTALL_DIRECTORY_KEY = "blackduck_install_directory";
export const BLACKDUCK_INSTALL_DIRECTORY_KEY_CLASSIC_EDITOR =
  "bridge_blackduck_install_directory";

export const BLACKDUCK_EXECUTION_PATH_KEY = "blackduck_execution_path";
export const BLACKDUCK_EXECUTION_PATH_KEY_CLASSIC_EDITOR =
  "blackduckExecutionPath";
/**
 * @deprecated Use blackduck_scan_full instead. This can be removed in future release.
 */
export const BRIDGE_BLACKDUCK_SCAN_FULL_KEY = "bridge_blackduck_scan_full";
export const BLACKDUCK_SCAN_FULL_KEY = "blackduck_scan_full";
export const BLACKDUCK_SCAN_FULL_KEY_CLASSIC_EDITOR =
  "bridge_blackduck_scan_full";
/**
 * @deprecated Use blackduck_scan_failure_severities instead. This can be removed in future release.
 */
export const BRIDGE_BLACKDUCK_SCAN_FAILURE_SEVERITIES_KEY =
  "bridge_blackduck_scan_failure_severities";
export const BLACKDUCK_SCAN_FAILURE_SEVERITIES_KEY =
  "blackduck_scan_failure_severities";
export const BLACKDUCK_SCAN_FAILURE_SEVERITIES_KEY_CLASSIC_EDITOR =
  "bridge_blackduck_scan_failure_severities";
/**
 * @deprecated Use blackduck_prComment_enabled instead. This can be removed in future release.
 */
export const BRIDGE_BLACKDUCK_AUTOMATION_PRCOMMENT_KEY =
  "bridge_blackduck_automation_prcomment";
export const BLACKDUCK_PRCOMMENT_ENABLED_KEY = "blackduck_prComment_enabled";
export const BLACKDUCK_PRCOMMENT_ENABLED_KEY_CLASSIC_EDITOR =
  "bridge_blackduck_automation_prcomment";
/**
 * @deprecated Use blackduck_fixpr_enabled instead. This can be removed in future release.
 */
export const BLACKDUCK_AUTOMATION_FIXPR_KEY =
  "bridge_blackduck_automation_fixpr";
/**
 * @deprecated Use blackduck_fixpr_enabled instead. This can be removed in future release.
 */
export const BRIDGE_BLACKDUCK_FIXPR_ENABLED_KEY =
  "bridge_blackduck_fixpr_enabled";
export const BLACKDUCK_FIXPR_ENABLED_KEY = "blackduck_fixpr_enabled";
export const BLACKDUCK_FIXPR_ENABLED_KEY_CLASSIC_EDITOR =
  "bridge_blackduck_fixpr_enabled";
/**
 * @deprecated Use blackduck_fixpr_maxCount instead. This can be removed in future release.
 */
export const BRIDGE_BLACKDUCK_FIXPR_MAXCOUNT_KEY =
  "bridge_blackduck_fixpr_maxCount";
export const BLACKDUCK_FIXPR_MAXCOUNT_KEY = "blackduck_fixpr_maxCount";
export const BLACKDUCK_FIXPR_MAXCOUNT_KEY_CLASSIC_EDITOR =
  "bridge_blackduck_fixpr_maxCount";
/**
 * @deprecated Use blackduck_fixpr_createSinglePR instead. This can be removed in future release.
 */
export const BRIDGE_BLACKDUCK_FIXPR_CREATE_SINGLE_PR_KEY =
  "bridge_blackduck_fixpr_createSinglePR";
export const BLACKDUCK_FIXPR_CREATE_SINGLE_PR_KEY =
  "blackduck_fixpr_createSinglePR";
export const BLACKDUCK_FIXPR_CREATE_SINGLE_PR_KEY_CLASSIC_EDITOR =
  "blackduckFixPRCreateSinglePR";
/**
 * @deprecated Use blackduck_fixpr_filter_severities instead. This can be removed in future release.
 */
export const BRIDGE_BLACKDUCK_FIXPR_FILTER_SEVERITIES_KEY =
  "bridge_blackduck_fixpr_filter_severities";
export const BLACKDUCK_FIXPR_FILTER_SEVERITIES_KEY =
  "blackduck_fixpr_filter_severities";
export const BLACKDUCK_FIXPR_FILTER_SEVERITIES_KEY_CLASSIC_EDITOR =
  "bridge_blackduck_fixpr_filter_severities";
/**
 * @deprecated Use blackduck_fixpr_useUpgradeGuidance instead. This can be removed in future release.
 */
export const BRIDGE_BLACKDUCK_FIXPR_UPGRADE_GUIDANCE_KEY =
  "bridge_blackduck_fixpr_useUpgradeGuidance";
export const BLACKDUCK_FIXPR_UPGRADE_GUIDANCE_KEY =
  "blackduck_fixpr_useUpgradeGuidance";
export const BLACKDUCK_FIXPR_UPGRADE_GUIDANCE_KEY_CLASSIC_EDITOR =
  "bridge_blackduck_fixpr_useUpgradeGuidance";

export const BLACKDUCK_PROJECT_DIRECTORY_KEY_CLASSIC_EDITOR =
  "blackduckProjectDirectory";

/**
 * @deprecated Use blackduck_reports_sarif_create instead. This can be removed in future release.
 */
export const BRIDGE_BLACKDUCK_REPORTS_SARIF_CREATE_KEY =
  "bridge_blackduck_reports_sarif_create";
export const BLACKDUCK_REPORTS_SARIF_CREATE_KEY =
  "blackduck_reports_sarif_create";
export const BLACKDUCK_REPORTS_SARIF_CREATE_KEY_CLASSIC_EDITOR =
  "blackduckReportsSarifCreate";
/**
 * @deprecated Use blackduck_reports_sarif_file_path instead. This can be removed in future release.
 */
export const BRIDGE_BLACKDUCK_REPORTS_SARIF_FILE_PATH_KEY =
  "bridge_blackduck_reports_sarif_file_path";
export const BLACKDUCK_REPORTS_SARIF_FILE_PATH_KEY =
  "blackduck_reports_sarif_file_path";
export const BLACKDUCK_REPORTS_SARIF_FILE_PATH_KEY_CLASSIC_EDITOR =
  "blackduckReportsSarifFilePath";
/**
 * @deprecated Use blackduck_reports_sarif_severities instead. This can be removed in future release.
 */
export const BRIDGE_BLACKDUCK_REPORTS_SARIF_SEVERITIES_KEY =
  "bridge_blackduck_reports_sarif_severities";
export const BLACKDUCK_REPORTS_SARIF_SEVERITIES_KEY =
  "blackduck_reports_sarif_severities";
export const BLACKDUCK_REPORTS_SARIF_SEVERITIES_KEY_CLASSIC_EDITOR =
  "blackduckReportsSarifSeverities";
/**
 * @deprecated Use blackduck_reports_sarif_groupSCAIssues instead. This can be removed in future release.
 */
export const BRIDGE_BLACKDUCK_REPORTS_SARIF_GROUP_SCA_ISSUES =
  "bridge_blackduck_reports_sarif_groupSCAIssues";
export const BLACKDUCK_REPORTS_SARIF_GROUP_SCA_ISSUES_KEY =
  "blackduck_reports_sarif_groupSCAIssues";
export const BLACKDUCK_REPORTS_SARIF_GROUP_SCA_ISSUES_KEY_CLASSIC_EDITOR =
  "blackduckReportsSarifGroupSCAIssues";
export const BLACKDUCK_SEARCH_DEPTH_KEY = "blackduck_search_depth";
export const BLACKDUCK_SEARCH_DEPTH_KEY_CLASSIC_EDITOR = "blackduckSearchDepth";
export const BLACKDUCK_SEARCH_DEPTH_KEY_CLASSIC_EDITOR_FOR_POLARIS =
  "blackduckSearchDepthForPolaris";
export const BLACKDUCK_SEARCH_DEPTH_KEY_CLASSIC_EDITOR_FOR_SRM =
  "blackduckSearchDepthForSrm";
export const BLACKDUCK_CONFIG_PATH_KEY = "blackduck_config_path";
export const BLACKDUCK_CONFIG_PATH_KEY_CLASSIC_EDITOR = "blackduckConfigPath";
export const BLACKDUCK_CONFIG_PATH_KEY_CLASSIC_EDITOR_FOR_POLARIS =
  "blackduckConfigPathForPolaris";
export const BLACKDUCK_CONFIG_PATH_KEY_CLASSIC_EDITOR_FOR_SRM =
  "blackduckConfigPathForSrm";
export const BLACKDUCK_ARGS_KEY = "blackduck_args";
export const BLACKDUCK_ARGS_KEY_CLASSIC_EDITOR = "blackduckArgs";
export const BLACKDUCK_ARGS_KEY_CLASSIC_EDITOR_FOR_POLARIS =
  "blackduckArgsForPolaris";
export const BLACKDUCK_ARGS_KEY_CLASSIC_EDITOR_FOR_SRM = "blackduckArgsForSrm";

//SRM
export const SRM_URL_KEY = "srm_url";
export const SRM_URL_KEY_CLASSIC_EDITOR = "srmUrl";

export const SRM_APIKEY_KEY = "srm_apikey";
export const SRM_APIKEY_KEY_CLASSIC_EDITOR = "srmApikey";

export const SRM_ASSESSMENT_TYPES_KEY = "srm_assessment_types";
export const SRM_ASSESSMENT_TYPES_KEY_CLASSIC_EDITOR = "srmAssessmentTypes";

export const SRM_PROJECT_NAME_KEY = "srm_project_name";
export const SRM_PROJECT_NAME_KEY_CLASSIC_EDITOR = "srmProjectName";

export const SRM_PROJECT_ID_KEY = "srm_project_id";
export const SRM_PROJECT_ID_KEY_CLASSIC_EDITOR = "srmProjectId";

export const SRM_BRANCH_NAME_KEY = "srm_branch_name";
export const SRM_BRANCH_NAME_KEY_CLASSIC_EDITOR = "srmBranchName";

export const SRM_BRANCH_PARENT_KEY = "srm_branch_parent";
export const SRM_BRANCH_PARENT_KEY_CLASSIC_EDITOR = "srmBranchParent";

export const SRM_PROJECT_DIRECTORY_KEY_CLASSIC_EDITOR = "srmProjectDirectory";

export const INCLUDE_DIAGNOSTICS_KEY = "include_diagnostics";
export const INCLUDE_DIAGNOSTICS_KEY_CLASSIC_EDITOR = "include_diagnostics";
/**
 * @deprecated Use network_airgap instead. This can be removed in future release.
 */
export const BRIDGE_NETWORK_AIRGAP_KEY = "bridge_network_airgap";
export const NETWORK_AIRGAP_KEY = "network_airgap";
export const NETWORK_AIRGAP_KEY_CLASSIC_EDITOR = "bridge_network_airgap";

/**
 * @deprecated Use synopsys_bridge_download_url instead. This can be removed in future release.
 */
export const BRIDGE_DOWNLOAD_URL_KEY = "bridge_download_url";
export const SYNOPSYS_BRIDGE_DOWNLOAD_URL_KEY = "synopsys_bridge_download_url";
export const SYNOPSYS_BRIDGE_DOWNLOAD_URL_KEY_CLASSIC_EDITOR =
  "bridge_download_url";
/**
 * @deprecated Use synopsys_bridge_download_version instead. This can be removed in future release.
 */
export const BRIDGE_DOWNLOAD_VERSION_KEY = "bridge_download_version";
export const SYNOPSYS_BRIDGE_DOWNLOAD_VERSION_KEY =
  "synopsys_bridge_download_version";
export const SYNOPSYS_BRIDGE_DOWNLOAD_VERSION_KEY_CLASSIC_EDITOR =
  "bridge_download_version";

export const RETURN_STATUS_KEY = "return_status";
//export const RETURN_STATUS_KEY_CLASSIC_EDITOR = "returnStatus";

export const MARK_BUILD_STATUS_KEY = "mark_build_status";
export const MARK_BUILD_STATUS_KEY_CLASSIC_EDITOR = "markBuildStatus";

export const SYNOPSYS_BRIDGE_INSTALL_DIRECTORY_KEY =
  "synopsys_bridge_install_directory";
export const SYNOPSYS_BRIDGE_INSTALL_DIRECTORY_KEY_CLASSIC_EDITOR =
  "synopsys_bridge_path";

export const PROJECT_DIRECTORY_KEY = "project_directory";
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
export const DEFAULT_AZURE_API_URL = "https://dev.azure.com";
export const SYNOPSYS_SECURITY_SCAN_AZURE_DEVOPS_DOCS_URL =
  "https://sig-product-docs.synopsys.com/bundle/bridge/page/documentation/c_synopsys-security-scan-for-azure-devops.html";
