import { HttpClient } from "typed-rest-client/HttpClient";
import { AzureData } from "./model/azure";
import * as taskLib from "azure-pipelines-task-lib/task";
import * as constants from "./application-constant";
import { ErrorCode } from "./enum/ErrorCodes";

export class SynopsysAzureService {
  azureGetMergeRequestsAPI: string;
  apiVersion: string;

  constructor() {
    this.azureGetMergeRequestsAPI =
      "/{0}/{1}/_apis/git/repositories/{2}/pullrequests?searchCriteria.status=active&$top=1&searchCriteria.sourceRefName={3}&api-version={4}";
    this.apiVersion = "7.0";
  }

  async getPullRequestIdForClassicEditorFlow(
    azureData: AzureData
  ): Promise<number> {
    const StringFormat = (url: string, ...args: string[]) =>
      url.replace(
        /{(\d+)}/g,
        (match, index) => encodeURIComponent(args[index]) || ""
      );

    const endpoint = StringFormat(
      azureData.api.url.concat(this.azureGetMergeRequestsAPI),
      azureData.organization.name,
      azureData.project.name,
      azureData.repository.name,
      azureData.repository.branch.name,
      this.apiVersion
    );
    taskLib.debug(`Endpoint: ${endpoint}`);
    const token: string = ":".concat(azureData.user.token);
    const encodedToken: string = Buffer.from(token, "utf8").toString("base64");

    const httpClient = new HttpClient("synopsys-azure-service");
    const httpResponse = await httpClient.get(endpoint, {
      Authorization: "Basic ".concat(encodedToken),
      Accept: "application/json",
    });
    if (httpResponse.message.statusCode === 200) {
      const azurePrResponse = JSON.parse(await httpResponse.readBody());
      if (azurePrResponse.count === 1) {
        return azurePrResponse.value[0].pullRequestId;
      } else {
        throw new Error(
            "Unable to find a Pull request Id from current source build with branch: "
                .concat(azureData.repository.branch.name)
                .concat(constants.SPACE)
                .concat(
                    ErrorCode.FAILED_TO_GET_PULL_REQUEST_ID_FOR_CURRENT_BUILD.toString()
                )
        );
      }
    } else {
      throw new Error(
        "Failed to get pull request Id for current build from source branch: "
            .concat(constants.SPACE)
            .concat(
                ErrorCode.FAILED_TO_GET_PULL_REQUEST_ID_FOR_CURRENT_BUILD.toString()
            )
      );
    }
  }
}
