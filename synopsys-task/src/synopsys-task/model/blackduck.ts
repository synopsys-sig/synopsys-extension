import { AzureData } from "./azure";
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

export interface BlackDuckFixPrData {
  enabled?: boolean;
  maxCount?: number;
  createSinglePR?: boolean;
  useLongTermUpgradeGuidance?: boolean;
  filter?: BlackDuckFixPrFilerData;
}

export interface BlackDuckFixPrFilerData {
  by?: string;
  severities?: string[];
}
