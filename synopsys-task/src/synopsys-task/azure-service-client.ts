// Copyright (c) 2024 Black Duck Software Inc. All rights reserved worldwide.

import { HttpClient } from "typed-rest-client/HttpClient";
import { AzureData, AzurePrResponse } from "./model/azure";
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

  async getAzurePrResponseForManualTriggerFlow(
    azureData: AzureData | undefined
  ): Promise<AzurePrResponse | undefined> {
    if (
      azureData &&
      process.env["BUILD_REASON"] &&
      process.env["BUILD_REASON"] !== "PullRequest"
    ) {
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
      taskLib.debug(`Azure check pull request API: ${endpoint}`);
      const token: string = ":".concat(azureData.user.token);
      const encodedToken: string = Buffer.from(token, "utf8").toString(
        "base64"
      );

      const httpClient = new HttpClient("blackduck-azure-service");
      const httpResponse = await httpClient.get(endpoint, {
        Authorization: "Basic ".concat(encodedToken),
        Accept: "application/json",
      });
      if (httpResponse.message.statusCode === 200) {
        const azurePrResponse = JSON.parse(await httpResponse.readBody());
        if (azurePrResponse.count === 1) {
          return {
            pullRequestId: azurePrResponse.value[0].pullRequestId,
            targetRefName: azurePrResponse.value[0].targetRefName,
          };
        } else {
          console.info(
            "Unable to find pull request info for the current source build with branch: ".concat(
              azureData.repository.branch.name
            )
          );
        }
      } else {
        throw new Error(
          "Failed to get pull request info for current build from source branch: "
            .concat(azureData.repository.branch.name)
            .concat(constants.SPACE)
            .concat(
              ErrorCode.FAILED_TO_GET_PULL_REQUEST_INFO_FROM_SOURCE_BRANCH.toString()
            )
        );
      }
    }
    return undefined;
  }
}
