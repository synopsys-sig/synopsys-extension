import {SynopsysBridge} from "../../../src/synopsys-task/synopsys-bridge";
import {after} from "mocha";
import {assert, expect} from "chai";
import * as sinon from "sinon";
import path from "path";
import * as constants from "../../../src/synopsys-task/application-constant";
import {SYNOPSYS_BRIDGE_DEFAULT_PATH_MAC} from "../../../src/synopsys-task/application-constant";

describe("Platform", () => {

    context("platform - linux", () => {

        const currentOsName = process.platform
        let bridgeUrl: string
        let bridgeDefaultPath = "";
        let synopsysBridge: SynopsysBridge;

        before(() => {
            synopsysBridge = new SynopsysBridge();
            Object.defineProperty(process, 'platform', {
                value: "linux"
            })
            bridgeDefaultPath = path.join(process.env["HOME"] as string, constants.SYNOPSYS_BRIDGE_DEFAULT_PATH_LINUX);
            bridgeUrl = "https://sig-repo.synopsys.com/artifactory/bds-integrations-release/com/synopsys/integration/synopsys-bridge/0.1.244/synopsys-bridge-0.1.244-linux64.zip"
        })

        after(() => {
            Object.defineProperty(process, 'platform', {
                value: currentOsName
            })
        })

        it("getVersionUrl", async () => {
            const result = synopsysBridge.getVersionUrl("0.1.244");
            assert.equal(result, bridgeUrl);
        });

        it("getBridgeDefaultPath", async () => {
            const result = synopsysBridge.getBridgeDefaultPath();
            assert.equal(result, bridgeDefaultPath);
        });
    })

    context("platform - mac", () => {

        const currentOsName = process.platform
        let bridgeUrl: string
        let bridgeDefaultPath = "";
        let synopsysBridge: SynopsysBridge;

        before(() => {
            synopsysBridge = new SynopsysBridge();
            Object.defineProperty(process, 'platform', {
                value: "darwin"
            })
            bridgeDefaultPath = path.join(process.env["HOME"] as string, constants.SYNOPSYS_BRIDGE_DEFAULT_PATH_MAC);
            bridgeUrl = "https://sig-repo.synopsys.com/artifactory/bds-integrations-release/com/synopsys/integration/synopsys-bridge/0.1.244/synopsys-bridge-0.1.244-macosx.zip"
        })

        after(() => {
            Object.defineProperty(process, 'platform', {
                value: currentOsName
            })
        })

        it("getVersionUrl", async () => {
            const result = synopsysBridge.getVersionUrl("0.1.244");
            assert.equal(result, bridgeUrl);
        });

        it("getBridgeDefaultPath", async () => {
            const result = synopsysBridge.getBridgeDefaultPath();
            assert.equal(result, bridgeDefaultPath);
        });
    })

    context("platform - windows", () => {

        const currentOsName = process.platform
        let bridgeUrl: string
        let bridgeDefaultPath = "";
        let synopsysBridge: SynopsysBridge;

        before(() => {
            process.env["USERPROFILE"] = "C:/Users"
            synopsysBridge = new SynopsysBridge();
            Object.defineProperty(process, 'platform', {
                value: "win32"
            })

            bridgeDefaultPath = path.join(
                process.env["USERPROFILE"] as string, constants.SYNOPSYS_BRIDGE_DEFAULT_PATH_WINDOWS)
            bridgeUrl = "https://sig-repo.synopsys.com/artifactory/bds-integrations-release/com/synopsys/integration/synopsys-bridge/0.1.244/synopsys-bridge-0.1.244-win64.zip"
        })

        after(() => {
            Object.defineProperty(process, 'platform', {
                value: currentOsName
            })
        })

        it("getVersionUrl - windows", () => {
            const result = synopsysBridge.getVersionUrl("0.1.244");
            assert.equal(result, bridgeUrl);
        });

        it("getBridgeDefaultPath", () => {
            const result = synopsysBridge.getBridgeDefaultPath();
            assert.equal(result, bridgeDefaultPath);
        });
    })

})

