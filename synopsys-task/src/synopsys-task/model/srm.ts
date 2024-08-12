import { CoverityArbitrary } from "./coverity";
import { BlackDuckArbitrary } from "./blackduck";

export interface Srm {
  srm: SrmData;
  coverity?: coverityDetails;
  blackduck?: BlackduckDetails;
  project?: ProjectData;
}

export interface SrmData {
  url: string;
  apikey: string;
  assessment: { types: string[] };
  project?: { name?: string; id?: string };
  branch?: BranchInfo;
}

export interface ExecutionPath {
  execution?: { path?: string };
}

export interface BranchInfo {
  name?: string;
  parent?: string;
}
export interface ProjectData {
  directory?: string;
}

export interface coverityDetails extends ExecutionPath, CoverityArbitrary {}
export interface BlackduckDetails extends ExecutionPath, BlackDuckArbitrary {}
