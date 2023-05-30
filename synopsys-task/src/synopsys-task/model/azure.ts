export interface AzureData {
  api: Api;
  user: User;
  organization: Organization;
  project: Project;
  repository: Repository;
}

export interface Api {
  url: string;
}

export interface Organization {
  name: string;
}

export interface Project {
  name: string;
}

export interface PullRequest {
  number: number;
}

export interface User {
  token: string;
}

export interface Repository {
  name: string;
  branch: Branch;
  pull?: PullRequest;
}

export interface Branch {
  name: string;
}

export const FIXPR_ENVIRONMENT_VARIABLES = {
  AZURE_USER_TOKEN: "System.AccessToken",
  AZURE_ORGANIZATION: "System.TeamFoundationCollectionUri",
  AZURE_PROJECT: "System.TeamProject",
  AZURE_REPOSITORY: "Build.Repository.Name",
  AZURE_SOURCE_BRANCH: "Build.SourceBranchName",
  AZURE_PULL_REQUEST_NUMBER: "System.PullRequest.PullRequestId",
};
