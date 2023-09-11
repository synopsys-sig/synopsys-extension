export enum PolarisAssessmentType {
  SCA = "SCA",
  SAST = "SAST",
}

export interface Polaris {
  polaris: PolarisData;
}

export interface PolarisData {
  accesstoken: string;
  serverUrl: string;
  application: { name: string };
  branch: Branch;
  project: { name: string };
  assessment: { types: string[] };
}

export interface Branch {
  name?: string;
}
