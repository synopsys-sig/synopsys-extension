// Copyright (c) 2024 Black Duck Software Inc. All rights reserved worldwide.

import { ErrorCode } from "./enum/ErrorCodes";
export const BRIDGE_CLI_DEFAULT_PATH_MAC = "/bridge-cli"; //Path will be in home
export const BRIDGE_CLI_DEFAULT_PATH_WINDOWS = "\\bridge-cli";
export const BRIDGE_CLI_DEFAULT_PATH_LINUX = "/bridge-cli";

export const BRIDGE_CLI_EXECUTABLE_WINDOWS = "bridge-cli.exe";
export const BRIDGE_CLI_EXECUTABLE_MAC_LINUX = "bridge-cli";

export const BRIDGE_CLI_ZIP_FILE_NAME = "bridge-cli.zip";

export const APPLICATION_NAME = "blackduck-extension";

// Scan Types
export const POLARIS_KEY = "polaris";
export const COVERITY_KEY = "coverity";
export const BLACKDUCK_KEY = "blackduck";
export const SRM_KEY = "srm";

export const AZURE_TOKEN_KEY = "azure_token";
export const AZURE_TOKEN_KEY_CLASSIC_EDITOR = "azureToken";
export const SCAN_TYPE_KEY = "scanType";

// Polaris
export const POLARIS_SERVER_URL_KEY = "polaris_server_url";
export const POLARIS_SERVER_URL_KEY_CLASSIC_EDITOR = "polarisServerUrl";

export const POLARIS_ACCESS_TOKEN_KEY = "polaris_access_token";
export const POLARIS_ACCESS_TOKEN_KEY_CLASSIC_EDITOR = "polarisAccessToken";

export const POLARIS_APPLICATION_NAME_KEY = "polaris_application_name";
export const POLARIS_APPLICATION_NAME_KEY_CLASSIC_EDITOR =
  "polarisApplicationName";

export const POLARIS_PROJECT_NAME_KEY = "polaris_project_name";
export const POLARIS_PROJECT_NAME_KEY_CLASSIC_EDITOR = "polarisProjectName";

export const POLARIS_ASSESSMENT_TYPES_KEY = "polaris_assessment_types";
export const POLARIS_ASSESSMENT_TYPES_KEY_CLASSIC_EDITOR =
  "polarisAssessmentTypes";

export const POLARIS_TRIAGE_KEY = "polaris_triage";
export const POLARIS_TRIAGE_KEY_CLASSIC_EDITOR = "polarisTriage";

export const POLARIS_BRANCH_NAME_KEY = "polaris_branch_name";
export const POLARIS_BRANCH_NAME_KEY_CLASSIC_EDITOR = "polarisBranchName";

export const POLARIS_BRANCH_PARENT_NAME_KEY = "polaris_branch_parent_name";
export const POLARIS_BRANCH_PARENT_NAME_KEY_CLASSIC_EDITOR =
  "polarisBranchParentName";

export const POLARIS_PR_COMMENT_ENABLED_KEY = "polaris_prComment_enabled";
export const POLARIS_PR_COMMENT_ENABLED_KEY_CLASSIC_EDITOR =
  "polarisPrCommentEnabled";

export const POLARIS_PR_COMMENT_SEVERITIES_KEY = "polaris_prComment_severities";
export const POLARIS_PR_COMMENT_SEVERITIES_KEY_CLASSIC_EDITOR =
  "polarisPrCommentSeverities";

export const POLARIS_REPORTS_SARIF_CREATE_KEY = "polaris_reports_sarif_create";
export const POLARIS_REPORTS_SARIF_CREATE_KEY_CLASSIC_EDITOR =
  "polarisReportsSarifCreate";

export const POLARIS_REPORTS_SARIF_FILE_PATH_KEY =
  "polaris_reports_sarif_file_path";
export const POLARIS_REPORTS_SARIF_FILE_PATH_KEY_CLASSIC_EDITOR =
  "polarisReportsSarifFilePath";

export const POLARIS_REPORTS_SARIF_SEVERITIES_KEY =
  "polaris_reports_sarif_severities";
export const POLARIS_REPORTS_SARIF_SEVERITIES_KEY_CLASSIC_EDITOR =
  "polarisReportsSarifSeverities";

export const POLARIS_REPORTS_SARIF_GROUP_SCA_ISSUES_KEY =
  "polaris_reports_sarif_groupSCAIssues";
export const POLARIS_REPORTS_SARIF_GROUP_SCA_ISSUES_KEY_CLASSIC_EDITOR =
  "polarisReportsSarifGroupSCAIssues";

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

export const COVERITY_URL_KEY = "coverity_url";
export const COVERITY_URL_KEY_CLASSIC_EDITOR = "coverityUrl";

export const COVERITY_USER_KEY = "coverity_user";
export const COVERITY_USER_KEY_CLASSIC_EDITOR = "coverityUser";

export const COVERITY_PASSPHRASE_KEY = "coverity_passphrase";
export const COVERITY_PASSPHRASE_KEY_CLASSIC_EDITOR = "coverityUserPassword";

export const COVERITY_PROJECT_NAME_KEY = "coverity_project_name";
export const COVERITY_PROJECT_NAME_KEY_CLASSIC_EDITOR = "coverityProjectName";

export const COVERITY_STREAM_NAME_KEY = "coverity_stream_name";
export const COVERITY_STREAM_NAME_KEY_CLASSIC_EDITOR = "coverityStreamName";

export const COVERITY_INSTALL_DIRECTORY_KEY = "coverity_install_directory";
export const COVERITY_INSTALL_DIRECTORY_KEY_CLASSIC_EDITOR =
  "coverityInstallDirectory";

export const COVERITY_EXECUTION_PATH_KEY = "coverity_execution_path";
export const COVERITY_EXECUTION_PATH_KEY_CLASSIC_EDITOR =
  "coverityExecutionPath";

export const COVERITY_POLICY_VIEW_KEY = "coverity_policy_view";
export const COVERITY_POLICY_VIEW_KEY_CLASSIC_EDITOR = "coverityPolicyView";

export const COVERITY_PROJECT_DIRECTORY_KEY_CLASSIC_EDITOR =
  "coverityProjectDirectory";

export const COVERITY_PRCOMMENT_ENABLED_KEY = "coverity_prComment_enabled";
export const COVERITY_PRCOMMENT_ENABLED_KEY_CLASSIC_EDITOR =
  "coverityAutomationPrComment";

export const COVERITY_LOCAL_KEY = "coverity_local";
export const COVERITY_LOCAL_KEY_CLASSIC_EDITOR = "coverityLocal";

export const COVERITY_VERSION_KEY = "coverity_version";
export const COVERITY_VERSION_KEY_CLASSIC_EDITOR = "coverityVersion";

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
    "Invalid value for blackducksca_scan_failure_severities",
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
    ErrorCode.INVALID_BRIDGE_CLI_URL.toString(),
    "Provided Bridge CLI URL is not valid for the configured platform runner",
  ],
  [
    ErrorCode.BRIDGE_CLI_URL_CANNOT_BE_EMPTY.toString(),
    "Provided Bridge CLI URL cannot be empty",
  ],
  [
    ErrorCode.INVALID_URL.toString(),
    "Invalid URL (Invalid Synopysys Bridge Download URL)",
  ],
  [
    ErrorCode.BRIDGE_CLI_VERSION_NOT_FOUND.toString(),
    "Provided Bridge CLI version not found in artifactory",
  ],
  [
    ErrorCode.BRIDGE_CLI_DOWNLOAD_FAILED.toString(),
    "Bridge CLI download has been failed",
  ],
  [
    ErrorCode.BRIDGE_INSTALL_DIRECTORY_NOT_EXIST.toString(),
    "Bridge CLI Install Directory does not exist",
  ],
  [
    ErrorCode.DEFAULT_DIRECTORY_NOT_FOUND.toString(),
    "Bridge CLI default directory does not exist",
  ],
  [
    ErrorCode.BRIDGE_EXECUTABLE_NOT_FOUND.toString(),
    "Bridge CLI executable file could not be found at executable Bridge path",
  ],
  [
    ErrorCode.WORKSPACE_DIRECTORY_NOT_FOUND.toString(),
    "Workspace directory could not be located",
  ],
  [
    ErrorCode.FILE_DOES_NOT_EXIST.toString(),
    "File (Bridge CLI zip) does not exist",
  ],
  [
    ErrorCode.NO_DESTINATION_DIRECTORY.toString(),
    "No destination directory found for unzipping Bridge CLI",
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
    "Failed to download Bridge CLI zip from specified URL. HTTP status code: ",
  ],
  [
    ErrorCode.CONTENT_LENGTH_MISMATCH.toString(),
    "Content-Length of Bridge CLI in the artifactory did not match downloaded file size",
  ],
  [
    ErrorCode.UNDEFINED_ERROR_FROM_EXTENSION.toString(),
    "Undefined error from extension",
  ],
]);

export const SPACE = " ";

// Blackduck
/**
 * @deprecated Use blackducksca_url instead. This can be removed in future release.
 */
export const BLACKDUCK_URL_KEY = "blackduck_url"; // old key
export const BLACKDUCK_SCA_URL_KEY = "blackducksca_url"; // new key
export const BLACKDUCK_SCA_URL_KEY_CLASSIC_EDITOR = "blackduckScaUrl"; // classic editor key

/**
 * @deprecated Use BLACKDUCK_SCA_TOKEN_KEY instead. This can be removed in future release.
 */
export const BLACKDUCK_TOKEN_KEY = "blackduck_token";
export const BLACKDUCK_SCA_TOKEN_KEY = "blackducksca_token";
export const BLACKDUCK_SCA_TOKEN_KEY_CLASSIC_EDITOR = "blackduckScaToken";
/**
 * @deprecated Use detect_install_directory instead. This can be removed in future release.
 */
export const BLACKDUCK_INSTALL_DIRECTORY_KEY = "blackduck_install_directory";
export const DETECT_INSTALL_DIRECTORY_KEY = "detect_install_directory";
export const DETECT_INSTALL_DIRECTORY_KEY_CLASSIC_EDITOR =
  "detectInstallDirectory";

/**
 * @deprecated Use detect_execution_path instead. This can be removed in future release.
 */
export const BLACKDUCK_EXECUTION_PATH_KEY = "blackduck_execution_path";
export const DETECT_EXECUTION_PATH_KEY = "detect_execution_path";
export const DETECT_EXECUTION_PATH_KEY_CLASSIC_EDITOR = "detectExecutionPath";
/**
 * @deprecated Use detect_scan_full instead. This can be removed in future release.
 */
export const BLACKDUCK_SCAN_FULL_KEY = "blackduck_scan_full";
export const DETECT_SCAN_FULL_KEY = "detect_scan_full";
export const DETECT_SCAN_FULL_KEY_CLASSIC_EDITOR = "detectScanFull";
/**
 * @deprecated Use blackducksca_scan_failure_severities instead. This can be removed in future release.
 */
export const BLACKDUCK_SCAN_FAILURE_SEVERITIES_KEY =
  "blackduck_scan_failure_severities";
export const BLACKDUCK_SCA_SCAN_FAILURE_SEVERITIES_KEY =
  "blackducksca_scan_failure_severities";
export const BLACKDUCK_SCA_SCAN_FAILURE_SEVERITIES_KEY_CLASSIC_EDITOR =
  "blackduckScaScaScanFailureSeverities";
/**
 * @deprecated Use blackducksca_prComment_enabled instead. This can be removed in future release.
 */
export const BLACKDUCK_PRCOMMENT_ENABLED_KEY = "blackduck_prComment_enabled";
export const BLACKDUCK_SCA_PRCOMMENT_ENABLED_KEY =
  "blackducksca_prComment_enabled";
export const BLACKDUCK_SCA_PRCOMMENT_ENABLED_KEY_CLASSIC_EDITOR =
  "blackduckScaAutomationPrComment";
/**
 * @deprecated Use blackducksca_fixpr_enabled instead. This can be removed in future release.
 */
export const BLACKDUCK_FIX_PR_ENABLED_KEY = "blackduck_fixpr_enabled";
export const BLACKDUCK_SCA_FIX_PR_ENABLED_KEY = "blackducksca_fixpr_enabled";
export const BLACKDUCK_SCA_FIX_PR_ENABLED_KEY_CLASSIC_EDITOR =
  "blackduckScaFixPrEnabled";
/**
 * @deprecated Use blackducksca_fixpr_maxCount instead. This can be removed in future release.
 */
export const BLACKDUCK_FIX_PR_MAX_COUNT_KEY = "blackduck_fixpr_maxCount";
export const BLACKDUCK_SCA_FIX_PR_MAX_COUNT_KEY = "blackducksca_fixpr_maxCount";
export const BLACKDUCK_SCA_FIX_PR_MAX_COUNT_KEY_CLASSIC_EDITOR =
  "blackduckScaFixPrMaxCount";
/**
 * @deprecated Use blackducksca_fixpr_createSinglePR instead. This can be removed in future release.
 */
export const BLACKDUCK_FIX_PR_CREATE_SINGLE_PR_KEY =
  "blackduck_fixpr_createSinglePR";
export const BLACKDUCK_SCA_FIX_PR_CREATE_SINGLE_PR_KEY =
  "blackducksca_fixpr_createSinglePR";
export const BLACKDUCK_SCA_FIX_PR_CREATE_SINGLE_PR_KEY_CLASSIC_EDITOR =
  "blackduckScaFixPRCreateSinglePR";
/**
 * @deprecated Use blackducksca_fixpr_filter_severities instead. This can be removed in future release.
 */
export const BLACKDUCK_FIX_PR_FILTER_SEVERITIES_KEY =
  "blackduck_fixpr_filter_severities";
export const BLACKDUCK_SCA_FIX_PR_FILTER_SEVERITIES_KEY =
  "blackducksca_fixpr_filter_severities";
export const BLACKDUCK_SCA_FIX_PR_FILTER_SEVERITIES_KEY_CLASSIC_EDITOR =
  "blackduckScaFixPrFilterSeverities";
/**
 * @deprecated Use blackducksca_fixpr_useUpgradeGuidance instead. This can be removed in future release.
 */
export const BLACKDUCK_FIX_PR_UPGRADE_GUIDANCE_KEY =
  "blackduck_fixpr_useUpgradeGuidance";
export const BLACKDUCK_SCA_FIX_PR_UPGRADE_GUIDANCE_KEY =
  "blackducksca_fixpr_useUpgradeGuidance";
export const BLACKDUCK_SCA_FIX_PR_UPGRADE_GUIDANCE_KEY_CLASSIC_EDITOR =
  "blackduckScaFixPrUseUpgradeGuidance";

export const BLACKDUCK_SCA_PROJECT_DIRECTORY_KEY_CLASSIC_EDITOR =
  "blackduckScaProjectDirectory";

/**
 * @deprecated Use blackducksca_reports_sarif_create instead. This can be removed in future release.
 */
export const BLACKDUCK_REPORTS_SARIF_CREATE_KEY =
  "blackduck_reports_sarif_create";
export const BLACKDUCK_SCA_REPORTS_SARIF_CREATE_KEY =
  "blackducksca_reports_sarif_create";
export const BLACKDUCK_SCA_REPORTS_SARIF_CREATE_KEY_CLASSIC_EDITOR =
  "blackduckScaReportsSarifCreate";
/**
 * @deprecated Use blackducksca_reports_sarif_file_path instead. This can be removed in future release.
 */
export const BLACKDUCK_REPORTS_SARIF_FILE_PATH_KEY =
  "blackduck_reports_sarif_file_path";
export const BLACKDUCK_SCA_REPORTS_SARIF_FILE_PATH_KEY =
  "blackducksca_reports_sarif_file_path";
export const BLACKDUCK_SCA_REPORTS_SARIF_FILE_PATH_KEY_CLASSIC_EDITOR =
  "blackduckScaReportsSarifFilePath";
/**
 * @deprecated Use blackducksca_reports_sarif_severities instead. This can be removed in future release.
 */
export const BLACKDUCK_REPORTS_SARIF_SEVERITIES_KEY =
  "blackduck_reports_sarif_severities";
export const BLACKDUCK_SCA_REPORTS_SARIF_SEVERITIES_KEY =
  "blackducksca_reports_sarif_severities";
export const BLACKDUCK_SCA_REPORTS_SARIF_SEVERITIES_KEY_CLASSIC_EDITOR =
  "blackduckScaReportsSarifSeverities";
/**
 * @deprecated Use blackducksca_reports_sarif_groupSCAIssues instead. This can be removed in future release.
 */
export const BLACKDUCK_REPORTS_SARIF_GROUP_SCA_ISSUES_KEY =
  "blackduck_reports_sarif_groupSCAIssues";
export const BLACKDUCK_SCA_REPORTS_SARIF_GROUP_SCA_ISSUES_KEY =
  "blackducksca_reports_sarif_groupSCAIssues";
export const BLACKDUCK_SCA_REPORTS_SARIF_GROUP_SCA_ISSUES_KEY_CLASSIC_EDITOR =
  "blackduckScaReportsSarifGroupSCAIssues";

/**
 * @deprecated Use detect_search_depth instead. This can be removed in future release.
 */
export const BLACKDUCK_SEARCH_DEPTH_KEY = "blackduck_search_depth";
export const DETECT_SEARCH_DEPTH_KEY = "detect_search_depth";
export const DETECT_DEPTH_KEY_CLASSIC_EDITOR = "detectSearchDepth";
export const DETECT_DEPTH_KEY_CLASSIC_EDITOR_FOR_POLARIS =
  "detectSearchDepthForPolaris";
export const DETECT_DEPTH_KEY_CLASSIC_EDITOR_FOR_SRM =
  "detectSearchDepthForSrm";

/**
 * @deprecated Use detect_config_path instead. This can be removed in future release.
 */
export const BLACKDUCK_CONFIG_PATH_KEY = "blackduck_config_path";
export const DETECT_CONFIG_PATH_KEY = "detect_config_path";
export const DETECT_CONFIG_PATH_KEY_CLASSIC_EDITOR = "detectConfigPath";
export const DETECT_CONFIG_PATH_KEY_CLASSIC_EDITOR_FOR_POLARIS =
  "detectConfigPathForPolaris";
export const DETECT_CONFIG_PATH_KEY_CLASSIC_EDITOR_FOR_SRM =
  "detectConfigPathForSrm";

/**
 * @deprecated Use detect_args instead. This can be removed in future release.
 */
export const BLACKDUCK_ARGS_KEY = "blackduck_args";
export const DETECT_ARGS_KEY = "detect_args";
export const DETECT_ARGS_KEY_CLASSIC_EDITOR = "detectArgs";
export const DETECT_ARGS_KEY_CLASSIC_EDITOR_FOR_POLARIS =
  "detectArgsForPolaris";
export const DETECT_ARGS_KEY_CLASSIC_EDITOR_FOR_SRM = "detectArgsForSrm";

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
export const INCLUDE_DIAGNOSTICS_KEY_CLASSIC_EDITOR = "includeDiagnostics";
/**
 * @deprecated Use network_airgap instead. This can be removed in future release.
 */
export const BRIDGE_NETWORK_AIRGAP_KEY = "bridge_network_airgap";
export const NETWORK_AIRGAP_KEY = "network_airgap";
export const NETWORK_AIRGAP_KEY_CLASSIC_EDITOR = "networkAirgap";

/**
 * @deprecated Use bridgecli_download_url instead. This can be removed in future release.
 */
export const SYNOPSYS_BRIDGE_DOWNLOAD_URL_KEY = "synopsys_bridge_download_url";
export const BRIDGE_CLI_DOWNLOAD_URL_KEY = "bridgecli_download_url";
export const BRIDGE_CLI_DOWNLOAD_URL_KEY_CLASSIC_EDITOR =
  "bridgeCliDownloadUrl";
/**
 * @deprecated Use bridgecli_download_version instead. This can be removed in future release.
 */
export const SYNOPSYS_BRIDGE_DOWNLOAD_VERSION_KEY =
  "synopsys_bridge_download_version";
export const BRIDGE_CLI_DOWNLOAD_VERSION_KEY = "bridgecli_download_version";
export const BRIDGE_CLI_DOWNLOAD_VERSION_KEY_CLASSIC_EDITOR =
  "bridgeCliDownloadVersion";

export const RETURN_STATUS_KEY = "return_status";
//export const RETURN_STATUS_KEY_CLASSIC_EDITOR = "returnStatus";

export const MARK_BUILD_STATUS_KEY = "mark_build_status";
export const MARK_BUILD_STATUS_KEY_CLASSIC_EDITOR = "markBuildStatus";

/**
 * @deprecated Use bridgecli_install_directory instead. This can be removed in future release.
 */
export const SYNOPSYS_BRIDGE_INSTALL_DIRECTORY_KEY =
  "synopsys_bridge_install_directory";
export const BRIDGE_CLI_INSTALL_DIRECTORY_KEY = "bridgecli_install_directory";
export const BRIDGE_CLI_INSTALL_DIRECTORY_KEY_CLASSIC_EDITOR =
  "bridgeCliInstallDirectory";

export const PROJECT_DIRECTORY_KEY = "project_directory";
export const UPLOAD_FOLDER_ARTIFACT_NAME = "bridge_cli_diagnostics";
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
export const MIN_SUPPORTED_BRIDGE_CLI_MAC_ARM_VERSION = "2.1.0";
export const DEFAULT_AZURE_API_URL = "https://dev.azure.com";
export const BLACKDUCK_SECURITY_SCAN_AZURE_DEVOPS_DOCS_URL =
  "https://sig-product-docs.synopsys.com/bundle/bridge/page/documentation/c_synopsys-security-scan-for-azure-devops.html";
