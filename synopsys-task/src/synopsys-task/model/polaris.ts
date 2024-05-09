import { AzureData } from "./azure";

import { Reports } from "./reports";

export interface Polaris {
  polaris: PolarisData;
  project?: ProjectData;
  azure?: AzureData;
}

export interface PolarisData {
  triage?: string;
  accesstoken: string;
  serverUrl: string;
  application: { name: string };
  branch: Branch;
  project: { name: string };
  assessment: { types: string[]; mode?: string };
  prcomment?: PRComment;
  reports?: Reports;
}

export interface Branch {
  name?: string;
}

export interface PRComment {
  enabled: boolean;
  severities: string[];
}

export interface ProjectData {
  directory?: string;
  source?: {
    archive?: string;
    preserveSymLinks?: boolean;
    excludes?: string[];
  };
}
