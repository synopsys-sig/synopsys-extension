import path from "path";
import * as inputs from "./input";
import { Polaris } from "./model/polaris";
import { Coverity } from "./model/coverity";
import {
  Blackduck,
  BLACKDUCK_SCAN_FAILURE_SEVERITIES,
} from "./model/blackduck";
import { AZURE_ENVIRONMENT_VARIABLES, AzureData } from "./model/azure";
import { InputData } from "./model/input-data";
import * as constants from "./application-constant";
import * as taskLib from "azure-pipelines-task-lib/task";
import {
  validateCoverityInstallDirectoryParam,
  validateBlackduckFailureSeverities,
} from "./validator";
import { parseToBoolean } from "./utility";
import { AZURE_TOKEN } from "./input";
import * as url from "url";
import { SynopsysAzureService } from "./azure-service-client";

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

    const polData: InputData<Polaris> = {
      data: {
        polaris: {
          accesstoken: inputs.POLARIS_ACCESS_TOKEN,
          serverUrl: inputs.POLARIS_SERVER_URL,
          application: { name: inputs.POLARIS_APPLICATION_NAME },
          project: { name: inputs.POLARIS_PROJECT_NAME },
          assessment: { types: assessmentTypeArray },
        },
      },
    };

    const inputJson = JSON.stringify(polData);

    let stateFilePath = path.join(
      this.tempDir,
      SynopsysToolsParameter.POLARIS_STATE_FILE_NAME
    );
    taskLib.writeFile(stateFilePath, inputJson);

    // Wrap the file path with double quotes, to make it work with directory path with space as well
    stateFilePath = '"'.concat(stateFilePath).concat('"');

    taskLib.debug("Generated state json file content is - ".concat(inputJson));
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
          automation: {},
        },
        network: {
          airGap: inputs.ENABLE_NETWORK_AIRGAP,
        },
      },
    };

    if (inputs.BLACKDUCK_INSTALL_DIRECTORY) {
      blackduckData.data.blackduck.install = {
        directory: inputs.BLACKDUCK_INSTALL_DIRECTORY,
      };
    }

    if (inputs.BLACKDUCK_SCAN_FULL) {
      let scanFullValue = false;
      if (
        inputs.BLACKDUCK_SCAN_FULL.toLowerCase() === "true" ||
        inputs.BLACKDUCK_SCAN_FULL.toLowerCase() === "false"
      ) {
        scanFullValue = inputs.BLACKDUCK_SCAN_FULL.toLowerCase() === "true";
      } else {
        throw new Error(
          "Missing boolean value for ".concat(constants.BLACKDUCK_SCAN_FULL_KEY)
        );
      }
      blackduckData.data.blackduck.scan = { full: scanFullValue };
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
    if (parseToBoolean(inputs.BLACKDUCK_AUTOMATION_FIXPR_KEY)) {
      console.log("Blackduck Automation Fix PR is enabled");
      blackduckData.data.azure = await this.getAzureRepoInfo();
      blackduckData.data.blackduck.automation.fixpr = true;
    } else {
      // Disable fix pull request for adapters
      blackduckData.data.blackduck.automation.fixpr = false;
    }

    if (parseToBoolean(inputs.BLACKDUCK_AUTOMATION_PRCOMMENT)) {
      console.info("BlackDuck Automation comment is enabled");
      blackduckData.data.azure = await this.getAzureRepoInfo();
      blackduckData.data.blackduck.automation.prcomment = true;
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
            project: { name: inputs.COVERITY_PROJECT_NAME },
            stream: { name: inputs.COVERITY_STREAM_NAME },
          },
          automation: {},
          network: {
            airGap: inputs.ENABLE_NETWORK_AIRGAP,
          },
        },
        project: {},
      },
    };

    if (inputs.COVERITY_LOCAL) {
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
      covData.data.coverity.automation.prcomment = true;
    }

    if (inputs.COVERITY_VERSION) {
      covData.data.coverity.version = inputs.COVERITY_VERSION;
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
}
