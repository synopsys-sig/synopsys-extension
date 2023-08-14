import { HttpClient } from "typed-rest-client/HttpClient";
import { AzureData } from "./model/azure";

export class SynopsysAzureService {
  azureGetMergeRequestsAPI: string;

  constructor() {
    this.azureGetMergeRequestsAPI =
      "/{0}/{1}/_apis/git/repositories/{2}/pullrequests?api-version=7.0&searchCriteria.status=active&$top=1&searchCriteria.sourceRefName={3}";
  }

  async getPullRequestIdForClassicEditorFlow(
    azureData: AzureData
  ): Promise<number> {
    const buildReason = process.env["BUILD_REASON"];
    if (
      buildReason !== undefined &&
      buildReason.length > 0 &&
      buildReason !== "PullRequest"
    ) {
      const StringFormat = (url: string, ...args: string[]) =>
        url.replace(/{(\d+)}/g, (match, index) => args[index] || "");

      const endpoint = StringFormat(
        azureData.api.url.concat(this.azureGetMergeRequestsAPI),
        azureData.organization.name,
        azureData.project.name,
        azureData.repository.name,
        "refs/heads/".concat(azureData.repository.branch.name)
      );
      const token: string = ":".concat(azureData.user.token);
      const encodedToken: string = Buffer.from(token, "utf8").toString(
        "base64"
      );

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
            "Unable to find an Pull request Id for current from source build with branch: ".concat(
              azureData.repository.branch.name
            )
          );
        }
      } else {
        throw new Error(
          "Failed to get pull request Id for current build from source branch: "
            .concat(azureData.repository.branch.name)
            .concat(" With error: ")
            .concat(await httpResponse.readBody())
        );
      }
    }
    return 0;
  }
}
