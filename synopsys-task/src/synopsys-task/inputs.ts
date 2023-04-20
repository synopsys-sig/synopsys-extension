import * as taskLib from 'azure-pipelines-task-lib/task';


export const SYNOPSYS_BRIDGE_PATH = taskLib.getPathInput('synopsys_bridge_path')

//Bridge download url
export const BRIDGE_DOWNLOAD_URL = taskLib.getPathInput('bridge_download_url')
export const BRIDGE_DOWNLOAD_VERSION = taskLib.getInput('bridge_download_version')
