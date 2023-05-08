import path from "path";
import * as inputs from "./input";
import * as fs from "fs";
import { Polaris } from "./model/polaris";
import { Coverity } from "./model/coverity";
import {
  Blackduck,
  BLACKDUCK_SCAN_FAILURE_SEVERITIES,
} from "./model/blackduck";
import { InputData } from "./model/input-data";
import * as constants from "./application-constant";
import * as taskLib from "azure-pipelines-task-lib/task";
import {
  validateCoverityInstallDirectoryParam,
  validateBlackduckFailureSeverities,
} from "./validator";

export class SynopsysToolsParameter {
  tempDir: string;
  private static STAGE_OPTION = "--stage";
  private static BLACKDUCK_STAGE = "blackduck";
  private static BD_STATE_FILE_NAME = "bd_input.json";
  private static STATE_OPTION = "--state";
  private static POLARIS_STAGE = "polaris";
  private static POLARIS_STATE_FILE_NAME = "polaris_input.json";
  private static SPACE = " ";
  private static COVERITY_STATE_FILE_NAME = "coverity_input.json";
  private static COVERITY_STAGE = "connect";

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

    const stateFilePath = path.join(
      this.tempDir,
      SynopsysToolsParameter.POLARIS_STATE_FILE_NAME
    );
    taskLib.writeFile(stateFilePath, inputJson);

    taskLib.debug("Generated state json file content is - ".concat(inputJson));
    taskLib.debug("Generated state json file content is - ".concat(inputJson));

    command = SynopsysToolsParameter.STAGE_OPTION.concat(
      SynopsysToolsParameter.SPACE
    )
      .concat(SynopsysToolsParameter.POLARIS_STAGE)
      .concat(SynopsysToolsParameter.SPACE)
      .concat(SynopsysToolsParameter.STATE_OPTION)
      .concat(SynopsysToolsParameter.SPACE)
      .concat(stateFilePath)
      .concat(SynopsysToolsParameter.SPACE);
    return command;
  }

  getFormattedCommandForBlackduck(): string {
    console.log(
      "inputs.BLACKDUCK_SCAN_FAILURE_SEVERITIES:" +
        inputs.BLACKDUCK_SCAN_FAILURE_SEVERITIES
    );
    const failureSeverities: string[] = [];
    if (
      inputs.BLACKDUCK_SCAN_FAILURE_SEVERITIES != null &&
      inputs.BLACKDUCK_SCAN_FAILURE_SEVERITIES.length > 0
    ) {
      try {
        const failureSeveritiesInput = inputs.BLACKDUCK_SCAN_FAILURE_SEVERITIES;
        if (
          failureSeveritiesInput != null &&
          failureSeveritiesInput.length > 0
        ) {
          failureSeverities = failureSeveritiesInput;
        }
      } catch (error) {
        throw new Error(
          "Invalid value for ".concat(
            constants.BLACKDUCK_SCAN_FAILURE_SEVERITIES_KEY
          )
        );
      }
    }
    let command = "";
    const blackduckData: InputData<Blackduck> = {
      data: {
        blackduck: {
          url: inputs.BLACKDUCK_URL,
          token: inputs.BLACKDUCK_API_TOKEN,
          automation: {},
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

    const inputJson = JSON.stringify(blackduckData);

    const stateFilePath = path.join(
      this.tempDir,
      SynopsysToolsParameter.BD_STATE_FILE_NAME
    );
    fs.writeFileSync(stateFilePath, inputJson);

    taskLib.debug("Generated state json file at - ".concat(stateFilePath));
    taskLib.debug("Generated state json file content is - ".concat(inputJson));

    command = SynopsysToolsParameter.STAGE_OPTION.concat(
      SynopsysToolsParameter.SPACE
    )
      .concat(SynopsysToolsParameter.BLACKDUCK_STAGE)
      .concat(SynopsysToolsParameter.SPACE)
      .concat(SynopsysToolsParameter.STATE_OPTION)
      .concat(SynopsysToolsParameter.SPACE)
      .concat(stateFilePath)
      .concat(SynopsysToolsParameter.SPACE);
    return command;
  }

  getFormattedCommandForCoverity(): string {
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
        },
      },
    };

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

    const inputJson = JSON.stringify(covData);

    const stateFilePath = path.join(
      this.tempDir,
      SynopsysToolsParameter.COVERITY_STATE_FILE_NAME
    );
    taskLib.writeFile(stateFilePath, inputJson);

    taskLib.debug("Generated state json file at - ".concat(stateFilePath));
    taskLib.debug("Generated state json file content is - ".concat(inputJson));

    command = SynopsysToolsParameter.STAGE_OPTION.concat(
      SynopsysToolsParameter.SPACE
    )
      .concat(SynopsysToolsParameter.COVERITY_STAGE)
      .concat(SynopsysToolsParameter.SPACE)
      .concat(SynopsysToolsParameter.STATE_OPTION)
      .concat(SynopsysToolsParameter.SPACE)
      .concat(stateFilePath)
      .concat(SynopsysToolsParameter.SPACE);
    return command;
  }
}
