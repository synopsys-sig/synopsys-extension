import { Reports } from "./reports";
export interface Polaris {
  polaris: PolarisData;
}

export interface PolarisData {
  triage?: string;
  accesstoken: string;
  serverUrl: string;
  application: { name: string };
  branch: Branch;
  project: { name: string };
  assessment: { types: string[] };
  reports?: Reports;
}

export interface Branch {
  name?: string;
}
