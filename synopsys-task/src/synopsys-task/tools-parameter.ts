import path from "path";
import * as inputs from "./input";
import { Polaris } from "./model/polaris";
import { Coverity } from "./model/coverity";
import {
  Blackduck,
  BLACKDUCK_SCAN_FAILURE_SEVERITIES,
  BlackDuckFixPrData,
  Environment,
} from "./model/blackduck";
import {
  AZURE_BUILD_REASON,
  AZURE_ENVIRONMENT_VARIABLES,
  AzureData,
} from "./model/azure";
import { InputData } from "./model/input-data";
import * as constants from "./application-constant";
import * as taskLib from "azure-pipelines-task-lib/task";
import {
  validateBlackduckFailureSeverities,
  validateCoverityInstallDirectoryParam,
} from "./validator";
import { parseToBoolean, isBoolean, filterEmptyData } from "./utility";
import { AZURE_TOKEN } from "./input";
import * as url from "url";
import { SynopsysAzureService } from "./azure-service-client";
import { Reports } from "./model/reports";

export class SynopsysToolsParameter {
  tempDir: string;
  private static STAGE_OPTION = "--stage";
  private static BLACKDUCK_STAGE = "blackduck";
  private static BD_STATE_FILE_NAME = "bd_input.json";
  private static INPUT_OPTION = "--input";
  private static POLARIS_STAGE = "polaris";
  private static POLARIS_STATE_FILE_NAME = "polaris_input.json";
  static SPACE = " ";
  private static COVERITY_STATE_FILE_NAME = "coverity_input.json";
  private static COVERITY_STAGE = "connect";
  static DIAGNOSTICS_OPTION = "--diagnostics";

  constructor(tempDir: string) {
    this.tempDir = tempDir;
  }

  getFormattedCommandForPolaris(): string {
    let command = "";
    const assessmentTypeArray: string[] = [];
    const assessmentTypes = inputs.POLARIS_ASSESSMENT_TYPES;
    if (assessmentTypes != null && assessmentTypes.length > 0) {
      for (const assessmentType of assessmentTypes) {
        console.log(assessmentType);
        const regEx = new RegExp("^[a-zA-Z]+$");
        if (
          assessmentType.trim().length > 0 &&
          regEx.test(assessmentType.trim())
        ) {
          assessmentTypeArray.push(assessmentType.trim());
        } else {
          throw new Error(
            "Invalid value for ".concat(constants.POLARIS_ASSESSMENT_TYPES_KEY)
          );
        }
      }
    }

    let polData: InputData<Polaris> = {
      data: {
        polaris: {
          accesstoken: inputs.POLARIS_ACCESS_TOKEN,
          serverUrl: inputs.POLARIS_SERVER_URL,
          application: {},
          project: {},
          assessment: { types: assessmentTypeArray },
        },
      },
    };

    const azureRepositoryName =
      taskLib.getVariable(AZURE_ENVIRONMENT_VARIABLES.AZURE_REPOSITORY) || "";

    if (inputs.POLARIS_APPLICATION_NAME) {
      polData.data.polaris.application.name = inputs.POLARIS_APPLICATION_NAME;
    } else {
      polData.data.polaris.application.name = azureRepositoryName;
    }

    if (inputs.POLARIS_PROJECT_NAME) {
      polData.data.polaris.project.name = inputs.POLARIS_PROJECT_NAME;
    } else {
      polData.data.polaris.project.name = azureRepositoryName;
    }

    if (inputs.POLARIS_BRANCH_NAME) {
      polData.data.polaris.branch = { name: inputs.POLARIS_BRANCH_NAME };
    }

    if (inputs.POLARIS_TRIAGE) {
      polData.data.polaris.triage = inputs.POLARIS_TRIAGE;
    }

    if (parseToBoolean(inputs.POLARIS_PR_COMMENT_ENABLED)) {
      console.info("Polaris PR comment is enabled");
      if (!inputs.AZURE_TOKEN) {
        throw new Error(
          "Missing required azure token for pull request comment"
        );
      }

      polData.data.azure = this.setAzureData(
        "",
        inputs.AZURE_TOKEN,
        "",
        "",
        "",
        "",
        ""
      );

      polData.data.polaris.prcomment = { severities: [], enabled: true };

      if (inputs.POLARIS_PR_COMMENT_SEVERITIES) {
        polData.data.polaris.prcomment.severities =
          inputs.POLARIS_PR_COMMENT_SEVERITIES.filter((severity) => severity);
      }
    }

    if (inputs.POLARIS_TEST_SCA_TYPE) {
      polData.data.polaris.test = {
        sca: {
          type: inputs.POLARIS_TEST_SCA_TYPE,
        },
      };
    }

    const buildReason =
      taskLib.getVariable(AZURE_ENVIRONMENT_VARIABLES.AZURE_BUILD_REASON) || "";

    if (parseToBoolean(inputs.POLARIS_REPORTS_SARIF_CREATE)) {
      if (buildReason !== AZURE_BUILD_REASON.PULL_REQUEST) {
        polData.data.polaris.reports = this.setSarifReportsInputsForPolaris();
      } else {
        taskLib.warning(
          "Polaris SARIF report create/upload is ignored in case of PR/MR scan, it's only supported for non PR/MR scans"
        );
      }
    }

    // Remove empty data from json object
    polData = filterEmptyData(polData);

    const inputJson = JSON.stringify(polData);

    let stateFilePath = path.join(
      this.tempDir,
      SynopsysToolsParameter.POLARIS_STATE_FILE_NAME
    );
    taskLib.writeFile(stateFilePath, inputJson);

    // Wrap the file path with double quotes, to make it work with directory path with space as well
    stateFilePath = '"'.concat(stateFilePath).concat('"');

    taskLib.debug("Generated state json file content is - ".concat(inputJson));

    command = SynopsysToolsParameter.STAGE_OPTION.concat(
      SynopsysToolsParameter.SPACE
    )
      .concat(SynopsysToolsParameter.POLARIS_STAGE)
      .concat(SynopsysToolsParameter.SPACE)
      .concat(SynopsysToolsParameter.INPUT_OPTION)
      .concat(SynopsysToolsParameter.SPACE)
      .concat(stateFilePath)
      .concat(SynopsysToolsParameter.SPACE);
    return command;
  }

  async getFormattedCommandForBlackduck(): Promise<string> {
    const failureSeverities: string[] =
      inputs.BLACKDUCK_SCAN_FAILURE_SEVERITIES;
    let command = "";
    const blackduckData: InputData<Blackduck> = {
      data: {
        blackduck: {
          url: inputs.BLACKDUCK_URL,
          token: inputs.BLACKDUCK_API_TOKEN,
        },
      },
    };

    if (inputs.BLACKDUCK_INSTALL_DIRECTORY) {
      blackduckData.data.blackduck.install = {
        directory: inputs.BLACKDUCK_INSTALL_DIRECTORY,
      };
    }

    if (inputs.BLACKDUCK_SCAN_FULL) {
      if (
        inputs.BLACKDUCK_SCAN_FULL.toLowerCase() === "true" ||
        inputs.BLACKDUCK_SCAN_FULL.toLowerCase() === "false"
      ) {
        const scanFullValue =
          inputs.BLACKDUCK_SCAN_FULL.toLowerCase() === "true";
        blackduckData.data.blackduck.scan = { full: scanFullValue };
      } else {
        throw new Error(
          "Missing boolean value for ".concat(constants.BLACKDUCK_SCAN_FULL_KEY)
        );
      }
    }

    if (failureSeverities && failureSeverities.length > 0) {
      validateBlackduckFailureSeverities(failureSeverities);
      const failureSeverityEnums: BLACKDUCK_SCAN_FAILURE_SEVERITIES[] = [];

      const values: string[] = [];

      (
        Object.keys(BLACKDUCK_SCAN_FAILURE_SEVERITIES) as Array<
          keyof typeof BLACKDUCK_SCAN_FAILURE_SEVERITIES
        >
      ).map(function (key) {
        values.push(BLACKDUCK_SCAN_FAILURE_SEVERITIES[key]);
      });

      for (const failureSeverity of failureSeverities) {
        if (values.indexOf(failureSeverity) == -1) {
          throw new Error(
            "Invalid value for ".concat(
              constants.BLACKDUCK_SCAN_FAILURE_SEVERITIES_KEY
            )
          );
        } else {
          failureSeverityEnums.push(
            BLACKDUCK_SCAN_FAILURE_SEVERITIES[
              failureSeverity as keyof typeof BLACKDUCK_SCAN_FAILURE_SEVERITIES
            ]
          );
        }
      }

      if (blackduckData.data.blackduck.scan) {
        blackduckData.data.blackduck.scan.failure = {
          severities: failureSeverityEnums,
        };
      } else {
        blackduckData.data.blackduck.scan = {
          failure: { severities: failureSeverityEnums },
        };
      }
    }

    // Check and put environment variable for fix pull request
    if (parseToBoolean(inputs.BLACKDUCK_FIXPR_ENABLED)) {
      console.log("Black Duck Fix PR is enabled");
      blackduckData.data.blackduck.fixpr = this.setBlackDuckFixPrInputs();
      blackduckData.data.azure = await this.getAzureRepoInfo();
    }

    if (parseToBoolean(inputs.BLACKDUCK_AUTOMATION_PRCOMMENT)) {
      console.info("BlackDuck Automation comment is enabled");
      blackduckData.data.azure = await this.getAzureRepoInfo();
      blackduckData.data.environment = this.setEnvironmentScanPullData();
      blackduckData.data.blackduck.automation = { prcomment: true };
      blackduckData.data;
    }

    if (parseToBoolean(inputs.ENABLE_NETWORK_AIRGAP)) {
      blackduckData.data.network = { airGap: true };
    }

    const buildReason =
      taskLib.getVariable(AZURE_ENVIRONMENT_VARIABLES.AZURE_BUILD_REASON) || "";

    if (parseToBoolean(inputs.BLACKDUCK_REPORTS_SARIF_CREATE)) {
      if (buildReason !== AZURE_BUILD_REASON.PULL_REQUEST) {
        blackduckData.data.blackduck.reports =
          this.setSarifReportsInputsForBlackduck();
      } else {
        taskLib.warning(
          "BlackDuck SARIF report create/upload is ignored in case of PR/MR scan, it's only supported for non PR/MR scans"
        );
      }
    }

    const inputJson = JSON.stringify(blackduckData);

    let stateFilePath = path.join(
      this.tempDir,
      SynopsysToolsParameter.BD_STATE_FILE_NAME
    );
    taskLib.writeFile(stateFilePath, inputJson);

    // Wrap the file path with double quotes, to make it work with directory path with space as well
    stateFilePath = '"'.concat(stateFilePath).concat('"');

    taskLib.debug("Generated state json file at - ".concat(stateFilePath));
    taskLib.debug("Generated state json file content is - ".concat(inputJson));

    command = SynopsysToolsParameter.STAGE_OPTION.concat(
      SynopsysToolsParameter.SPACE
    )
      .concat(SynopsysToolsParameter.BLACKDUCK_STAGE)
      .concat(SynopsysToolsParameter.SPACE)
      .concat(SynopsysToolsParameter.INPUT_OPTION)
      .concat(SynopsysToolsParameter.SPACE)
      .concat(stateFilePath)
      .concat(SynopsysToolsParameter.SPACE);
    return command;
  }

  async getFormattedCommandForCoverity(): Promise<string> {
    let command = "";
    const covData: InputData<Coverity> = {
      data: {
        coverity: {
          connect: {
            user: {
              name: inputs.COVERITY_USER,
              password: inputs.COVERITY_USER_PASSWORD,
            },
            url: inputs.COVERITY_URL,
            project: {},
            stream: {},
          },
        },
      },
    };

    const azureRepositoryName =
      taskLib.getVariable(AZURE_ENVIRONMENT_VARIABLES.AZURE_REPOSITORY) || "";

    if (inputs.COVERITY_PROJECT_NAME) {
      covData.data.coverity.connect.project.name = inputs.COVERITY_PROJECT_NAME;
    } else {
      covData.data.coverity.connect.project.name = azureRepositoryName;
    }

    if (inputs.COVERITY_STREAM_NAME) {
      covData.data.coverity.connect.stream.name = inputs.COVERITY_STREAM_NAME;
    } else {
      const buildReason =
        taskLib.getVariable(AZURE_ENVIRONMENT_VARIABLES.AZURE_BUILD_REASON) ||
        "";
      if (buildReason == AZURE_BUILD_REASON.PULL_REQUEST) {
        const pullRequestTargetBranchName =
          taskLib.getVariable(
            AZURE_ENVIRONMENT_VARIABLES.AZURE_PULL_REQUEST_TARGET_BRANCH
          ) || "";
        covData.data.coverity.connect.stream.name =
          azureRepositoryName && pullRequestTargetBranchName
            ? azureRepositoryName
                .concat("-")
                .concat(pullRequestTargetBranchName)
            : "";
      } else {
        const sourceBranchName =
          taskLib.getVariable(
            AZURE_ENVIRONMENT_VARIABLES.AZURE_SOURCE_BRANCH
          ) || "";
        covData.data.coverity.connect.stream.name =
          azureRepositoryName && sourceBranchName
            ? azureRepositoryName.concat("-").concat(sourceBranchName)
            : "";
      }
    }

    if (parseToBoolean(inputs.COVERITY_LOCAL)) {
      covData.data.coverity.local = true;
    }

    if (inputs.COVERITY_INSTALL_DIRECTORY) {
      if (
        validateCoverityInstallDirectoryParam(inputs.COVERITY_INSTALL_DIRECTORY)
      ) {
        covData.data.coverity.install = {
          directory: inputs.COVERITY_INSTALL_DIRECTORY,
        };
      }
    }

    if (inputs.COVERITY_POLICY_VIEW) {
      covData.data.coverity.connect.policy = {
        view: inputs.COVERITY_POLICY_VIEW,
      };
    }

    if (parseToBoolean(inputs.COVERITY_AUTOMATION_PRCOMMENT)) {
      console.info("Coverity Automation comment is enabled");
      covData.data.azure = await this.getAzureRepoInfo();
      covData.data.environment = this.setEnvironmentScanPullData();
      covData.data.coverity.automation = { prcomment: true };
    }

    if (inputs.COVERITY_VERSION) {
      covData.data.coverity.version = inputs.COVERITY_VERSION;
    }

    if (parseToBoolean(inputs.ENABLE_NETWORK_AIRGAP)) {
      covData.data.coverity.network = { airGap: true };
    }

    const inputJson = JSON.stringify(covData);

    let stateFilePath = path.join(
      this.tempDir,
      SynopsysToolsParameter.COVERITY_STATE_FILE_NAME
    );
    taskLib.writeFile(stateFilePath, inputJson);

    // Wrap the file path with double quotes, to make it work with directory path with space as well
    stateFilePath = '"'.concat(stateFilePath).concat('"');

    taskLib.debug("Generated state json file at - ".concat(stateFilePath));
    taskLib.debug("Generated state json file content is - ".concat(inputJson));

    command = SynopsysToolsParameter.STAGE_OPTION.concat(
      SynopsysToolsParameter.SPACE
    )
      .concat(SynopsysToolsParameter.COVERITY_STAGE)
      .concat(SynopsysToolsParameter.SPACE)
      .concat(SynopsysToolsParameter.INPUT_OPTION)
      .concat(SynopsysToolsParameter.SPACE)
      .concat(stateFilePath)
      .concat(SynopsysToolsParameter.SPACE);
    return command;
  }

  private setBlackDuckFixPrInputs(): BlackDuckFixPrData | undefined {
    if (
      inputs.BLACKDUCK_FIXPR_MAXCOUNT &&
      isNaN(Number(inputs.BLACKDUCK_FIXPR_MAXCOUNT))
    ) {
      throw new Error(
        "Invalid value for ".concat(constants.BLACKDUCK_FIXPR_MAXCOUNT_KEY)
      );
    }
    const createSinglePr = parseToBoolean(
      inputs.BLACKDUCK_FIXPR_CREATE_SINGLE_PR
    );
    if (createSinglePr && inputs.BLACKDUCK_FIXPR_MAXCOUNT) {
      throw new Error(
        constants.BLACKDUCK_FIXPR_MAXCOUNT_KEY.concat(
          " is not applicable with "
        ).concat(constants.BLACKDUCK_FIXPR_CREATE_SINGLE_PR_KEY)
      );
    }
    const blackDuckFixPrData: BlackDuckFixPrData = {};
    blackDuckFixPrData.enabled = true;
    blackDuckFixPrData.createSinglePR = createSinglePr;
    if (inputs.BLACKDUCK_FIXPR_MAXCOUNT && !createSinglePr) {
      blackDuckFixPrData.maxCount = Number(inputs.BLACKDUCK_FIXPR_MAXCOUNT);
    }
    if (
      inputs.BLACKDUCK_FIXPR_UPGRADE_GUIDANCE &&
      inputs.BLACKDUCK_FIXPR_UPGRADE_GUIDANCE.length > 0
    ) {
      blackDuckFixPrData.useUpgradeGuidance =
        inputs.BLACKDUCK_FIXPR_UPGRADE_GUIDANCE;
    }

    const fixPRFilterSeverities: string[] = [];
    if (
      inputs.BLACKDUCK_FIXPR_FILTER_SEVERITIES &&
      inputs.BLACKDUCK_FIXPR_FILTER_SEVERITIES != null &&
      inputs.BLACKDUCK_FIXPR_FILTER_SEVERITIES.length > 0
    ) {
      for (const fixPrSeverity of inputs.BLACKDUCK_FIXPR_FILTER_SEVERITIES) {
        if (fixPrSeverity != null && fixPrSeverity.trim() !== "") {
          fixPRFilterSeverities.push(fixPrSeverity.trim());
        }
      }
    }
    if (fixPRFilterSeverities.length > 0) {
      blackDuckFixPrData.filter = { severities: fixPRFilterSeverities };
    }
    return blackDuckFixPrData;
  }

  private async getAzureRepoInfo(): Promise<AzureData | undefined> {
    let azureOrganization = "";
    const azureToken = AZURE_TOKEN;
    let azureInstanceUrl = "";
    const collectionUri =
      taskLib.getVariable(AZURE_ENVIRONMENT_VARIABLES.AZURE_ORGANIZATION) || "";
    if (collectionUri != "") {
      const parsedUrl = url.parse(collectionUri);
      azureInstanceUrl = `${parsedUrl.protocol}//${parsedUrl.host}`;
      azureOrganization = parsedUrl.pathname?.split("/")[1] || "";
    }
    const azureProject =
      taskLib.getVariable(AZURE_ENVIRONMENT_VARIABLES.AZURE_PROJECT) || "";
    const azureRepo =
      taskLib.getVariable(AZURE_ENVIRONMENT_VARIABLES.AZURE_REPOSITORY) || "";
    const azureRepoBranchName =
      taskLib.getVariable(AZURE_ENVIRONMENT_VARIABLES.AZURE_SOURCE_BRANCH) ||
      "";

    const azurePullRequestNumber =
      taskLib.getVariable(
        AZURE_ENVIRONMENT_VARIABLES.AZURE_PULL_REQUEST_NUMBER
      ) || "";

    if (azureToken == "") {
      throw new Error(
        "Missing required azure token for fix pull request/automation comment"
      );
    }

    // This condition is required as per ts-lint as these fields may have undefined as well
    if (
      azureInstanceUrl != "" &&
      azureToken != "" &&
      azureOrganization != "" &&
      azureProject != "" &&
      azureRepo != "" &&
      azureRepoBranchName != ""
    ) {
      const azureData = this.setAzureData(
        azureInstanceUrl,
        azureToken,
        azureOrganization,
        azureProject,
        azureRepo,
        azureRepoBranchName,
        azurePullRequestNumber
      );

      if (
        azurePullRequestNumber == "" &&
        (parseToBoolean(inputs.COVERITY_AUTOMATION_PRCOMMENT) ||
          parseToBoolean(inputs.BLACKDUCK_AUTOMATION_PRCOMMENT))
      ) {
        const synopsysAzureService = new SynopsysAzureService();
        azureData.repository.pull.number =
          await synopsysAzureService.getPullRequestIdForClassicEditorFlow(
            azureData
          );
        return azureData;
      }
      return azureData;
    }

    return undefined;
  }

  private setAzureData(
    azureInstanceUrl: string,
    azureToken: string,
    azureOrganization: string,
    azureProject: string,
    azureRepo: string,
    azureRepoBranchName: string,
    azurePullRequestNumber: string
  ): AzureData {
    const azureData: AzureData = {
      api: {
        url: azureInstanceUrl,
      },
      user: {
        token: azureToken,
      },
      organization: {
        name: azureOrganization,
      },
      project: {
        name: azureProject,
      },
      repository: {
        name: azureRepo,
        branch: {
          name: azureRepoBranchName,
        },
        pull: {},
      },
    };

    if (azurePullRequestNumber != null) {
      azureData.repository.pull.number = Number(azurePullRequestNumber);
    }
    return azureData;
  }

  private setEnvironmentScanPullData(): Environment {
    const azurePullRequestNumber =
      taskLib.getVariable(
        AZURE_ENVIRONMENT_VARIABLES.AZURE_PULL_REQUEST_NUMBER
      ) || "";
    if (azurePullRequestNumber == "") {
      const environment: Environment = {
        scan: {
          pull: true,
        },
      };
      return environment;
    }
    return {};
  }

  private setSarifReportsInputsForBlackduck(): Reports {
    const reportData: Reports = {
      sarif: {
        create: true,
      },
    };

    if (inputs.BLACKDUCK_URL && inputs.BLACKDUCK_REPORTS_SARIF_FILE_PATH) {
      reportData.sarif.file = {
        path: inputs.BLACKDUCK_REPORTS_SARIF_FILE_PATH,
      };
    }

    const sarifReportFilterSeverities: string[] = [];
    if (
      inputs.BLACKDUCK_URL &&
      inputs.BLACKDUCK_REPORTS_SARIF_SEVERITIES &&
      inputs.BLACKDUCK_REPORTS_SARIF_SEVERITIES.length > 0
    ) {
      const sarifSeverities = inputs.BLACKDUCK_REPORTS_SARIF_SEVERITIES.filter(
        (severity) => severity && severity.trim() !== ""
      ).map((severity) => severity.trim());
      sarifReportFilterSeverities.push(...sarifSeverities);
    }
    if (sarifReportFilterSeverities.length > 0) {
      reportData.sarif.severities = sarifReportFilterSeverities;
    }

    if (
      inputs.BLACKDUCK_URL &&
      isBoolean(inputs.BLACKDUCK_REPORTS_SARIF_GROUP_SCA_ISSUES)
    ) {
      reportData.sarif.groupSCAIssues = JSON.parse(
        inputs.BLACKDUCK_REPORTS_SARIF_GROUP_SCA_ISSUES
      );
    }

    return reportData;
  }

  private setSarifReportsInputsForPolaris(): Reports {
    const reportData: Reports = {
      sarif: {
        create: true,
      },
    };

    if (inputs.POLARIS_SERVER_URL && inputs.POLARIS_REPORTS_SARIF_FILE_PATH) {
      reportData.sarif.file = {
        path: inputs.POLARIS_REPORTS_SARIF_FILE_PATH,
      };
    }

    const sarifReportFilterSeverities: string[] = [];
    if (
      inputs.POLARIS_SERVER_URL &&
      inputs.POLARIS_REPORTS_SARIF_SEVERITIES &&
      inputs.POLARIS_REPORTS_SARIF_SEVERITIES.length > 0
    ) {
      const severities = inputs.POLARIS_REPORTS_SARIF_SEVERITIES.filter(
        (severity) => severity && severity.trim() !== ""
      ).map((severity) => severity.trim());
      sarifReportFilterSeverities.push(...severities);
    }
    if (sarifReportFilterSeverities.length > 0) {
      reportData.sarif.severities = sarifReportFilterSeverities;
    }

    if (
      inputs.POLARIS_SERVER_URL &&
      isBoolean(inputs.POLARIS_REPORTS_SARIF_GROUP_SCA_ISSUES)
    ) {
      reportData.sarif.groupSCAIssues = JSON.parse(
        inputs.POLARIS_REPORTS_SARIF_GROUP_SCA_ISSUES
      );
    }

    const sarifReportIssueTypes: string[] = [];
    if (
      inputs.POLARIS_SERVER_URL &&
      inputs.POLARIS_REPORTS_SARIF_ISSUE_TYPES &&
      inputs.POLARIS_REPORTS_SARIF_ISSUE_TYPES.length > 0
    ) {
      const issueTypes = inputs.POLARIS_REPORTS_SARIF_ISSUE_TYPES.filter(
        (issueType) => issueType && issueType.trim() !== ""
      ).map((issueType) => issueType.trim());
      sarifReportIssueTypes.push(...issueTypes);
    }
    if (sarifReportIssueTypes.length > 0) {
      reportData.sarif.issue = { types: sarifReportIssueTypes };
    }

    return reportData;
  }
}
