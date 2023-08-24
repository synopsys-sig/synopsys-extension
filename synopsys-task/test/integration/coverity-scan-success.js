"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const tmrm = __importStar(require("azure-pipelines-task-lib/mock-run"));
const process = __importStar(require("process"));
const path = __importStar(require("path"));
const constants = __importStar(require("../../src/synopsys-task/application-constant"));
let taskPath = path.join(__dirname, "..", "..", "lib", "main.js");
let tmr = new tmrm.TaskMockRunner(taskPath);
tmr.registerMockExport("downloadTool", __dirname.concat("synopsys-bridge.zip"));
const versionFile = '"'.concat(path.join(getBridgeDefaultPath(), "versions.txt")).concat('"');
console.log("Found version file is ".concat(versionFile));
tmr.registerMockExport("exist", () => { return true; });
tmr.registerMockExport("stats", () => {
    return {
        isDirectory: () => {
            return true;
        }
    };
});
tmr.registerMockExport("rmRF", () => { });
const fsMock = {
    readFileSync: (path, encoding) => { return "synopsys-bridge: 0.1.272"; },
    existsSync: (path) => { return false; }
};
tmr.registerMock("fs", fsMock);
const toolLibMock = {
    downloadTool: (url, fileName) => {
        return path.join(__dirname, "synopsys-bridge.zip");
    },
    extractZip: (file, destination) => {
        return path.join(__dirname, "synopsys-bridge");
    }
};
tmr.registerMock("azure-pipelines-tool-lib", toolLibMock);
tmr.registerMockExport("exec", () => {
    return 0;
});
tmr.setInput('bridge_coverity_connect_url', 'http://testurl.com');
tmr.setInput('bridge_coverity_connect_user_name', 'accessTokenTest');
tmr.setInput('bridge_coverity_connect_user_password', 'http://testurl.com');
tmr.setInput('bridge_coverity_connect_project_name', 'accessTokenTest');
tmr.setInput('bridge_coverity_connect_stream_name', 'http://testurl.com');
tmr.setInput('bridge_coverity_automation_prcomment', String(true));
tmr.setInput('bridge_azure_token', "token");
const osName = process.platform;
if (osName === "darwin") {
    tmr.setInput('bridge_download_url', 'https://sig-repo.synopsys.com/artifactory/bds-integrations-release/com/synopsys/integration/synopsys-bridge/0.1.272/synopsys-bridge-macosx.zip');
}
else if (osName === "linux") {
    tmr.setInput('bridge_download_url', 'https://sig-repo.synopsys.com/artifactory/bds-integrations-release/com/synopsys/integration/synopsys-bridge/0.1.272/synopsys-bridge-linux64.zip');
}
else {
    tmr.setInput('bridge_download_url', 'https://sig-repo.synopsys.com/artifactory/bds-integrations-release/com/synopsys/integration/synopsys-bridge/0.1.272/synopsys-bridge-win64.zip');
}
process.env['AGENT_TEMPDIRECTORY'] = __dirname;
process.env['BUILD_REPOSITORY_LOCALPATH'] = __dirname;
process.env["BUILD_REASON"] = "Manual";
tmr.run();
function getBridgeDefaultPath() {
    let bridgeDefaultPath = "";
    const osName = process.platform;
    if (osName === "darwin") {
        bridgeDefaultPath = path.join(process.env["HOME"], constants.SYNOPSYS_BRIDGE_DEFAULT_PATH_MAC);
    }
    else if (osName === "linux") {
        bridgeDefaultPath = path.join(process.env["HOME"], constants.SYNOPSYS_BRIDGE_DEFAULT_PATH_LINUX);
    }
    else if (osName === "win32") {
        bridgeDefaultPath = path.join(process.env["USERPROFILE"], constants.SYNOPSYS_BRIDGE_DEFAULT_PATH_WINDOWS);
    }
    return bridgeDefaultPath;
}
