import path from "path";
import * as inputs from "./input";
import { AZURE_TOKEN } from "./input";
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
  AzurePrResponse,
} from "./model/azure";
import { InputData } from "./model/input-data";
import * as constants from "./application-constant";
import * as taskLib from "azure-pipelines-task-lib/task";
import {
  validateBlackduckFailureSeverities,
  validateCoverityInstallDirectoryParam,
} from "./validator";
import {
  extractBranchName,
  filterEmptyData,
  isBoolean,
  isPullRequestEvent,
  parseToBoolean,
} from "./utility";

import * as url from "url";
import { SynopsysAzureService } from "./azure-service-client";
import { Reports } from "./model/reports";
import { ErrorCode } from "./enum/ErrorCodes";

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

  async getFormattedCommandForPolaris(): Promise<string> {
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
            "Invalid value for "
              .concat(constants.POLARIS_ASSESSMENT_TYPES_KEY)
              .concat(constants.SPACE)
              .concat(ErrorCode.INVALID_POLARIS_ASSESSMENT_TYPES.toString())
          );
        }
      }
    }

    const azureRepositoryName = this.getAzureRepositoryName();

    let polarisApplicationName = inputs.POLARIS_APPLICATION_NAME;
    if (!polarisApplicationName) {
      polarisApplicationName = azureRepositoryName;
      taskLib.debug(`POLARIS_APPLICATION_NAME: ${polarisApplicationName}`);
    }

    let polarisProjectName = inputs.POLARIS_PROJECT_NAME;
    if (!polarisProjectName) {
      polarisProjectName = azureRepositoryName;
      taskLib.debug(`POLARIS_PROJECT_NAME: ${polarisProjectName}`);
    }

    let polData: InputData<Polaris> = {
      data: {
        polaris: {
          accesstoken: inputs.POLARIS_ACCESS_TOKEN,
          serverUrl: inputs.POLARIS_SERVER_URL,
          application: { name: polarisApplicationName },
          project: { name: polarisProjectName },
          assessment: {
            types: assessmentTypeArray,
            ...(inputs.POLARIS_ASSESSMENT_MODE && {
              mode: inputs.POLARIS_ASSESSMENT_MODE,
            }),
          },
          branch: { parent: {} },
        },
      },
    };

    if (inputs.POLARIS_BRANCH_NAME) {
      polData.data.polaris.branch.name = inputs.POLARIS_BRANCH_NAME;
    }

    if (inputs.POLARIS_TRIAGE) {
      polData.data.polaris.triage = inputs.POLARIS_TRIAGE;
    }

    if (
      inputs.POLARIS_PROJECT_DIRECTORY ||
      inputs.PROJECT_SOURCE_ARCHIVE ||
      inputs.PROJECT_SOURCE_EXCLUDES ||
      parseToBoolean(inputs.PROJECT_SOURCE_PRESERVE_SYM_LINKS)
    ) {
      polData.data.project = {};

      if (inputs.POLARIS_PROJECT_DIRECTORY) {
        polData.data.project.directory = inputs.POLARIS_PROJECT_DIRECTORY;
      }

      if (
        inputs.PROJECT_SOURCE_ARCHIVE ||
        inputs.PROJECT_SOURCE_EXCLUDES ||
        parseToBoolean(inputs.PROJECT_SOURCE_PRESERVE_SYM_LINKS)
      ) {
        polData.data.project.source = {};

        if (inputs.PROJECT_SOURCE_ARCHIVE) {
          polData.data.project.source.archive = inputs.PROJECT_SOURCE_ARCHIVE;
        }

        if (parseToBoolean(inputs.PROJECT_SOURCE_PRESERVE_SYM_LINKS)) {
          polData.data.project.source.preserveSymLinks = true;
        }

        if (inputs.PROJECT_SOURCE_EXCLUDES) {
          const sourceExcludes = inputs.PROJECT_SOURCE_EXCLUDES.filter(
            (sourceExclude) => sourceExclude && sourceExclude.trim() !== ""
          ).map((sourceExclude) => sourceExclude.trim());
          if (sourceExcludes.length > 0) {
            polData.data.project.source.excludes = sourceExcludes;
          }
        }
      }
    }

    const azureData = this.getAzureRepoInfo();

    const isPrCommentEnabled = parseToBoolean(
      inputs.POLARIS_PR_COMMENT_ENABLED
    );

    const azurePrResponse = await this.updateAzurePrNumberForManualTriggerFlow(
      azureData,
      isPrCommentEnabled
    );

    const isPullRequest = isPullRequestEvent(azurePrResponse);

    if (isPrCommentEnabled) {
      if (!isPullRequest) {
        console.info("Polaris PR comment is ignored for non pull request scan");
      } else {
        console.info("Polaris PR comment is enabled");
        if (inputs.POLARIS_BRANCH_PARENT_NAME) {
          polData.data.polaris.branch.parent.name =
            inputs.POLARIS_BRANCH_PARENT_NAME;
        }

        polData.data.azure = this.setAzureData(
          "",
          AZURE_TOKEN,
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
    }

    if (parseToBoolean(inputs.POLARIS_REPORTS_SARIF_CREATE)) {
      if (!isPullRequest) {
        polData.data.polaris.reports = this.setSarifReportsInputsForPolaris();
      } else {
        console.info(
          "Polaris SARIF report create/upload is ignored for pull request scan"
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

    taskLib.debug("Generated state json file at - ".concat(stateFilePath));

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
    let blackduckData: InputData<Blackduck> = {
      data: {
        blackduck: {
          url: inputs.BLACKDUCK_URL,
          token: inputs.BLACKDUCK_API_TOKEN,
        },
      },
    };

    if (inputs.BLACKDUCK_PROJECT_DIRECTORY) {
      blackduckData.data.project = {
        directory: inputs.BLACKDUCK_PROJECT_DIRECTORY,
      };
    }

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
          "Missing boolean value for "
            .concat(constants.BLACKDUCK_SCAN_FULL_KEY)
            .concat(constants.SPACE)
            .concat(ErrorCode.MISSING_BOOLEAN_VALUE.toString())
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
            "Invalid value for "
              .concat(constants.BLACKDUCK_SCAN_FAILURE_SEVERITIES_KEY)
              .concat(constants.SPACE)
              .concat(ErrorCode.INVALID_BLACKDUCK_FAILURE_SEVERITIES.toString())
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

    const azureData = this.getAzureRepoInfo();

    const isPrCommentEnabled = parseToBoolean(
      inputs.BLACKDUCK_AUTOMATION_PRCOMMENT
    );
    const isFixPrEnabled = parseToBoolean(inputs.BLACKDUCK_FIXPR_ENABLED);

    const azurePrResponse = await this.updateAzurePrNumberForManualTriggerFlow(
      azureData,
      isPrCommentEnabled || isFixPrEnabled
    );

    const isPullRequest = isPullRequestEvent(azurePrResponse);

    // Check and put environment variable for fix pull request
    if (isFixPrEnabled) {
      if (isPullRequest) {
        console.info("Black Duck Fix PR ignored for pull request scan");
      } else {
        console.log("Black Duck Fix PR is enabled");
        blackduckData.data.blackduck.fixpr = this.setBlackDuckFixPrInputs();
        blackduckData.data.azure = azureData;
      }
    }

    if (isPrCommentEnabled) {
      if (!isPullRequest) {
        console.info(
          "Black Duck PR comment is ignored for non pull request scan"
        );
      } else {
        console.info("BlackDuck PR comment is enabled");
        blackduckData.data.azure = azureData;
        blackduckData.data.environment = this.setEnvironmentScanPullData();
        blackduckData.data.blackduck.automation = { prcomment: true };
        blackduckData.data;
      }
    }

    if (parseToBoolean(inputs.ENABLE_NETWORK_AIRGAP)) {
      blackduckData.data.network = { airGap: true };
    }

    if (parseToBoolean(inputs.BLACKDUCK_REPORTS_SARIF_CREATE)) {
      if (!isPullRequest) {
        blackduckData.data.blackduck.reports =
          this.setSarifReportsInputsForBlackduck();
      } else {
        console.info(
          "Black Duck SARIF report create/upload is ignored for pull request scan"
        );
      }
    }

    // Remove empty data from json object
    blackduckData = filterEmptyData(blackduckData);

    const inputJson = JSON.stringify(blackduckData);

    let stateFilePath = path.join(
      this.tempDir,
      SynopsysToolsParameter.BD_STATE_FILE_NAME
    );
    taskLib.writeFile(stateFilePath, inputJson);

    // Wrap the file path with double quotes, to make it work with directory path with space as well
    stateFilePath = '"'.concat(stateFilePath).concat('"');

    taskLib.debug("Generated state json file at - ".concat(stateFilePath));

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

    const azureRepositoryName = this.getAzureRepositoryName();

    let coverityProjectName = inputs.COVERITY_PROJECT_NAME;
    if (!coverityProjectName) {
      coverityProjectName = azureRepositoryName;
      taskLib.debug(`COVERITY_PROJECT_NAME: ${coverityProjectName}`);
    }

    const azureData = this.getAzureRepoInfo();

    const isPrCommentEnabled = parseToBoolean(
      inputs.COVERITY_AUTOMATION_PRCOMMENT
    );

    const azurePrResponse = await this.updateAzurePrNumberForManualTriggerFlow(
      azureData,
      isPrCommentEnabled
    );

    const isPullRequest = isPullRequestEvent(azurePrResponse);

    let coverityStreamName = inputs.COVERITY_STREAM_NAME;
    if (!coverityStreamName) {
      if (isPullRequest) {
        const pullRequestTargetBranchName =
          taskLib.getVariable(
            AZURE_ENVIRONMENT_VARIABLES.AZURE_PULL_REQUEST_TARGET_BRANCH
          ) ||
          azurePrResponse?.targetRefName ||
          "";
        coverityStreamName =
          azureRepositoryName && pullRequestTargetBranchName
            ? azureRepositoryName
                .concat("-")
                .concat(extractBranchName(pullRequestTargetBranchName))
            : "";
      } else {
        const buildReason =
          taskLib.getVariable(AZURE_ENVIRONMENT_VARIABLES.AZURE_BUILD_REASON) ||
          "";
        if (buildReason === AZURE_BUILD_REASON.MANUAL) {
          throw new Error(
            "COVERITY_STREAM_NAME is mandatory for azure manual trigger"
              .concat(constants.SPACE)
              .concat(
                ErrorCode.REQUIRED_COVERITY_STREAM_NAME_FOR_MANUAL_TRIGGER.toString()
              )
          );
        }

        const sourceBranchName =
          taskLib.getVariable(
            AZURE_ENVIRONMENT_VARIABLES.AZURE_SOURCE_BRANCH
          ) || "";
        coverityStreamName =
          azureRepositoryName && sourceBranchName
            ? azureRepositoryName
                .concat("-")
                .concat(extractBranchName(sourceBranchName))
            : "";
      }
      taskLib.debug(`COVERITY_STREAM_NAME: ${coverityStreamName}`);
    }

    let covData: InputData<Coverity> = {
      data: {
        coverity: {
          connect: {
            user: {
              name: inputs.COVERITY_USER,
              password: inputs.COVERITY_USER_PASSWORD,
            },
            url: inputs.COVERITY_URL,
            project: { name: coverityProjectName },
            stream: { name: coverityStreamName },
          },
        },
      },
    };

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

    if (inputs.COVERITY_PROJECT_DIRECTORY) {
      covData.data.project = {
        directory: inputs.COVERITY_PROJECT_DIRECTORY,
      };
    }

    if (isPrCommentEnabled) {
      if (!isPullRequest) {
        console.info(
          "Coverity PR comment is ignored for non pull request scan"
        );
      } else {
        console.info("Coverity PR comment is enabled");
        covData.data.azure = azureData;
        covData.data.environment = this.setEnvironmentScanPullData();
        covData.data.coverity.automation = { prcomment: true };
      }
    }

    if (inputs.COVERITY_VERSION) {
      covData.data.coverity.version = inputs.COVERITY_VERSION;
    }

    if (parseToBoolean(inputs.ENABLE_NETWORK_AIRGAP)) {
      covData.data.coverity.network = { airGap: true };
    }

    // Remove empty data from json object
    covData = filterEmptyData(covData);

    const inputJson = JSON.stringify(covData);

    let stateFilePath = path.join(
      this.tempDir,
      SynopsysToolsParameter.COVERITY_STATE_FILE_NAME
    );
    taskLib.writeFile(stateFilePath, inputJson);

    // Wrap the file path with double quotes, to make it work with directory path with space as well
    stateFilePath = '"'.concat(stateFilePath).concat('"');

    taskLib.debug("Generated state json file at - ".concat(stateFilePath));

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
        "Invalid value for "
          .concat(constants.BLACKDUCK_FIXPR_MAXCOUNT_KEY)
          .concat(constants.SPACE)
          .concat(ErrorCode.INVALID_BLACKDUCK_FIXPR_MAXCOUNT.toString())
      );
    }
    const createSinglePr = parseToBoolean(
      inputs.BLACKDUCK_FIXPR_CREATE_SINGLE_PR
    );
    if (createSinglePr && inputs.BLACKDUCK_FIXPR_MAXCOUNT) {
      throw new Error(
        constants.BLACKDUCK_FIXPR_MAXCOUNT_KEY.concat(
          " is not applicable with "
        )
          .concat(constants.BLACKDUCK_FIXPR_CREATE_SINGLE_PR_KEY)
          .concat(constants.SPACE)
          .concat(ErrorCode.BLACKDUCK_FIXPR_MAX_COUNT_NOT_APPLICABLE.toString())
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

  private getAzureRepoInfo(): AzureData | undefined {
    let azureOrganization = "";
    const azureToken = AZURE_TOKEN;
    let azureInstanceUrl = "";
    const collectionUri =
      taskLib.getVariable(AZURE_ENVIRONMENT_VARIABLES.AZURE_ORGANIZATION) || "";
    taskLib.debug(
      `Azure API URL, obtained from the environment variable ${AZURE_ENVIRONMENT_VARIABLES.AZURE_ORGANIZATION}, is: ${collectionUri}`
    );
    if (collectionUri != "") {
      const parsedUrl = url.parse(collectionUri);
      azureInstanceUrl = `${parsedUrl.protocol}//${parsedUrl.host}`;
      azureOrganization = parsedUrl.pathname?.split("/")[1] || "";
      if (
        parsedUrl.host &&
        !azureOrganization &&
        parsedUrl.host.indexOf(".visualstudio.com") !== -1
      ) {
        if (parsedUrl.host.split(".")[0]) {
          azureOrganization = parsedUrl.host.split(".")[0];
          azureInstanceUrl = constants.DEFAULT_AZURE_API_URL;
        }
      }
    }
    taskLib.debug("Azure organization name:".concat(azureOrganization));
    const azureProject =
      taskLib.getVariable(AZURE_ENVIRONMENT_VARIABLES.AZURE_PROJECT) || "";
    taskLib.debug(
      `Azure project, obtained from the environment variable ${AZURE_ENVIRONMENT_VARIABLES.AZURE_PROJECT}, is: ${azureProject}`
    );
    const azureRepo =
      taskLib.getVariable(AZURE_ENVIRONMENT_VARIABLES.AZURE_REPOSITORY) || "";
    taskLib.debug(
      `Azure repo, obtained from the environment variable ${AZURE_ENVIRONMENT_VARIABLES.AZURE_REPOSITORY}, is: ${azureProject}`
    );
    const buildReason =
      taskLib.getVariable(AZURE_ENVIRONMENT_VARIABLES.AZURE_BUILD_REASON) || "";
    taskLib.debug(`Build Reason: ${buildReason}`);
    const azureRepoBranchName =
      buildReason == AZURE_BUILD_REASON.PULL_REQUEST
        ? taskLib.getVariable(
            AZURE_ENVIRONMENT_VARIABLES.AZURE_PULL_REQUEST_SOURCE_BRANCH
          ) || ""
        : taskLib.getVariable(
            AZURE_ENVIRONMENT_VARIABLES.AZURE_SOURCE_BRANCH
          ) || "";
    taskLib.debug(`Azure repo branch name: ${azureProject}`);

    const azurePullRequestNumber =
      taskLib.getVariable(
        AZURE_ENVIRONMENT_VARIABLES.AZURE_PULL_REQUEST_NUMBER
      ) || "";
    taskLib.debug(
      `Azure pull request number, obtained from the environment variable ${AZURE_ENVIRONMENT_VARIABLES.AZURE_PULL_REQUEST_NUMBER}, is: ${azurePullRequestNumber}`
    );

    taskLib.debug(`Azure Instance Url: ${azureInstanceUrl}`);
    taskLib.debug(`Azure Organization: ${azureOrganization}`);
    taskLib.debug(`Azure Project Name: ${azureProject}`);
    taskLib.debug(`Azure Repository Name: ${azureRepo}`);
    taskLib.debug(`Azure Repository Branch Name: ${azureRepoBranchName}`);
    taskLib.debug(`Azure Pull Request Number: ${azurePullRequestNumber}`);

    return this.setAzureData(
      azureInstanceUrl,
      azureToken,
      azureOrganization,
      azureProject,
      azureRepo,
      azureRepoBranchName,
      azurePullRequestNumber
    );
  }

  private async updateAzurePrNumberForManualTriggerFlow(
    azureData: AzureData | undefined,
    isPrCommentOrFixPrEnabled: boolean
  ): Promise<AzurePrResponse | undefined> {
    let azurePrResponse;

    if (isPrCommentOrFixPrEnabled) {
      if (azureData?.user.token == undefined || azureData.user.token == "") {
        throw new Error(
          "Missing required azure token for fix pull request/automation comment"
            .concat(constants.SPACE)
            .concat(ErrorCode.MISSING_AZURE_TOKEN.toString())
        );
      }

      if (azureData && azureData.repository.pull.number === 0) {
        const synopsysAzureService = new SynopsysAzureService();
        azurePrResponse =
          await synopsysAzureService.getAzurePrResponseForManualTriggerFlow(
            azureData
          );
        azureData.repository.pull.number = azurePrResponse?.pullRequestId;
        taskLib.debug(
          `Azure pull request number for manual trigger flow: ${azureData.repository.pull.number}`
        );
      }
    }

    return azurePrResponse;
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
    taskLib.debug(`Azure Pull Request Number: ${azurePullRequestNumber}`);
    if (azurePullRequestNumber == "") {
      taskLib.debug(
        "azurePullRequestNumber is empty, setting environment.scan.pull as true"
      );
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

    const groupSCAIssues = inputs.BLACKDUCK_REPORTS_SARIF_GROUP_SCA_ISSUES;
    if (inputs.BLACKDUCK_URL && isBoolean(groupSCAIssues)) {
      if (groupSCAIssues !== undefined) {
        reportData.sarif.groupSCAIssues = JSON.parse(groupSCAIssues);
      }
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

    const groupSCAIssues = inputs.POLARIS_REPORTS_SARIF_GROUP_SCA_ISSUES;
    if (inputs.POLARIS_SERVER_URL && isBoolean(groupSCAIssues)) {
      if (groupSCAIssues !== undefined) {
        reportData.sarif.groupSCAIssues = JSON.parse(groupSCAIssues);
      }
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

  private getAzureRepositoryName(): string {
    const azureRepositoryName =
      taskLib.getVariable(AZURE_ENVIRONMENT_VARIABLES.AZURE_REPOSITORY) || "";
    taskLib.debug(`Azure Repository Name: ${azureRepositoryName}`);
    return azureRepositoryName;
  }
}
