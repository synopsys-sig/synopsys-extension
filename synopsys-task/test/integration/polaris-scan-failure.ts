// Copyright (c) 2024 Black Duck Software Inc. All rights reserved worldwide.

import * as tmrm from "azure-pipelines-task-lib/mock-run";
import * as ta from "azure-pipelines-task-lib/mock-answer";
import * as process from 'process';
import * as path from 'path';
import * as constants from "../../src/synopsys-task/application-constant";

let taskPath = path.join(__dirname, "..", "..", "lib", "main.js");
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);
tmr.registerMockExport("downloadTool", __dirname.concat("synopsys-bridge.zip"));
const versionFile: string = '"'.concat(path.join(getBridgeDefaultPath(), "versions.txt")).concat('"');
console.log("Found version file is ".concat(versionFile));
tmr.registerMockExport("exist", () => {return true});
tmr.registerMockExport("stats", () => {
    return {
        isDirectory: () => {
            return true;
        }
    }
});
tmr.registerMockExport("rmRF", () => {})

const fsMock = {
    readFileSync: (path: string, encoding: string) => { return "synopsys-bridge: 0.1.272" },
    existsSync: (path: string) => { return false }
}
tmr.registerMock("fs", fsMock);

const toolLibMock = {
    downloadTool: (url: string, fileName?: string) => {
        return path.join(__dirname, "synopsys-bridge.zip");
    },
    extractZip: (file: string, destination?: string) => {
        return path.join(__dirname, "synopsys-bridge");
    }
}
tmr.registerMock("azure-pipelines-tool-lib", toolLibMock);

tmr.registerMockExport("exec", () => {
    throw new Error("synopsys-bridge failed with exit code 2")
});

tmr.setInput('bridge_polaris_serverUrl', 'http://testurl.com')
tmr.setInput('bridge_polaris_accessToken', 'accessTokenTest')
tmr.setInput('bridge_polaris_application_name', 'testapplicaiton')
tmr.setInput('bridge_polaris_project_name','testprojectname')
tmr.setInput('bridge_polaris_branch_name', 'testbranchname')
tmr.setInput('bridge_polaris_assessment_types', 'SCA,SAST')
tmr.setInput('bridge_polaris_triage', 'true')

const osName = process.platform;
if (osName === "darwin") {
    tmr.setInput('bridge_download_url', 'https://sig-repo.synopsys.com/artifactory/bds-integrations-release/com/synopsys/integration/synopsys-bridge/0.1.272/synopsys-bridge-macosx.zip');
} else if (osName === "linux") {
    tmr.setInput('bridge_download_url', 'https://sig-repo.synopsys.com/artifactory/bds-integrations-release/com/synopsys/integration/synopsys-bridge/0.1.272/synopsys-bridge-linux64.zip');
} else {
    tmr.setInput('bridge_download_url', 'https://sig-repo.synopsys.com/artifactory/bds-integrations-release/com/synopsys/integration/synopsys-bridge/0.1.272/synopsys-bridge-win64.zip');
}

process.env['AGENT_TEMPDIRECTORY'] = __dirname;
process.env['BUILD_REPOSITORY_LOCALPATH'] = __dirname;

tmr.run();

function getBridgeDefaultPath() {
    let bridgeDefaultPath = "";
    const osName = process.platform;

    if (osName === "darwin") {
        bridgeDefaultPath = path.join(
            process.env["HOME"] as string,
            constants.BRIDGE_CLI_DEFAULT_PATH_MAC
        );
    } else if (osName === "linux") {
        bridgeDefaultPath = path.join(
            process.env["HOME"] as string,
            constants.BRIDGE_CLI_DEFAULT_PATH_LINUX
        );
    } else if (osName === "win32") {
        bridgeDefaultPath = path.join(
            process.env["USERPROFILE"] as string,
            constants.BRIDGE_CLI_DEFAULT_PATH_WINDOWS
        );
    }
    return bridgeDefaultPath;
}