export enum BLACKDUCK_SCAN_FAILURE_SEVERITIES {
  ALL = "ALL",
  NONE = "NONE",
  BLOCKER = "BLOCKER",
  CRITICAL = "CRITICAL",
  MAJOR = "MAJOR",
  MINOR = "MINOR",
  OK = "OK",
  TRIVIAL = "TRIVIAL",
  UNSPECIFIED = "UNSPECIFIED",
}

export interface Blackduck {
  blackduck: BlackduckData;
  azureData?: AzureData;
}

export interface BlackduckData {
  url: string;
  token: string;
  install?: { directory: string };
  scan?: {
    full?: boolean;
    failure?: { severities: BLACKDUCK_SCAN_FAILURE_SEVERITIES[] };
  };
  automation: AutomationData;
}

export interface AutomationData {
  fixpr?: boolean;
}

export interface AzureData {
  user: User;
  organization: Organization;
  project: Project;
  repository: Repository;
}

export interface Organization {
  name: string;
}

export interface Project {
  name: string;
}

export interface User {
  token: string;
}

export interface Repository {
  name: string;
  branch: Branch;
}

export interface Branch {
  name: string;
}

export const FIXPR_ENVIRONMENT_VARIABLES = {
  AZURE_USER_TOKEN: "System.AccessToken",
  AZURE_ORGANIZATION: "System.CollectionId",
  AZURE_PROJECT: "System.TeamProject",
  AZURE_REPOSITORY: "Build.Repository.Name",
  AZURE_SOURCE_BRANCH: "Build.SourceBranchName",
};
