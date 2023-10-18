import { AzureData } from "./azure";
import { Reports } from "./reports";
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
  azure?: AzureData;
  network: NetworkAirGap;
  environment?: Environment;
  reports?: Reports;
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
  fixpr?: BlackDuckFixPrData;
}

export interface AutomationData {
  fixpr?: boolean;
  prcomment?: boolean;
}

export interface NetworkAirGap {
  airGap: boolean;
}
export interface Environment {
  scan?: Scan;
}
export interface Scan {
  pull?: boolean;
}

export interface BlackDuckFixPrData {
  enabled?: boolean;
  maxCount?: number;
  createSinglePR?: boolean;
  useUpgradeGuidance?: string[];
  filter?: BlackDuckFixPrFilerData;
}

export interface BlackDuckFixPrFilerData {
  severities?: string[];
}
