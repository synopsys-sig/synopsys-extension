import { AzureData } from "./azure";

import { Reports } from "./reports";

export interface Polaris {
  polaris: PolarisData;
  azure?: AzureData;
}

export interface PolarisData {
  triage?: string;
  accesstoken: string;
  serverUrl: string;
  application: { name: string };
  branch: Branch;
  project: { name: string };
  assessment: { types: string[] };
  prcomment?: PRComment;
  reports?: Reports;
}

export interface Branch {
  name?: string;
  parent: { name?: string };
}

export interface PRComment {
  enabled: boolean;
  severities: string[];
}
