import * as fs from "fs";
import path from "path";
import * as inputs from "./input";
import { Polaris } from "./model/polaris";
import { InputData } from "./model/input-data";
import * as constants from "./application-constant";
import { debug } from "azure-pipelines-task-lib";

export class SynopsysToolsParameter {
  tempDir: string;
  private static STAGE_OPTION = "--stage";
  private static STATE_OPTION = "--state";
  private static POLARIS_STAGE = "polaris";
  private static POLARIS_STATE_FILE_NAME = "polaris_input.json";
  private static SPACE = " ";

  constructor(tempDir: string) {
    this.tempDir = tempDir;
  }

  getFormattedCommandForPolaris(): string {
    let command = "";
    const assessmentTypeArray: string[] = [];
    const assessmentTypes = inputs.POLARIS_ASSESSMENT_TYPES;
    console.log(assessmentTypes);
    if (assessmentTypes != null && assessmentTypes.length > 0) {
      try {
        // converting provided assessmentTypes to uppercase
        for (const assessmentType of assessmentTypes) {
          const regEx = new RegExp("^[a-zA-Z]+$");
          if (
            assessmentType.trim().length > 0 &&
            regEx.test(assessmentType.trim())
          ) {
            assessmentTypeArray.push(assessmentType.trim());
          }
        }
      } catch (error) {
        throw new Error(
          "Invalid value for ".concat(constants.POLARIS_ASSESSMENT_TYPES_KEY)
        );
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
    fs.writeFileSync(stateFilePath, inputJson);

    debug("Generated state json file content is - ".concat(inputJson));
    debug("Generated state json file content is - ".concat(inputJson));

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
}
