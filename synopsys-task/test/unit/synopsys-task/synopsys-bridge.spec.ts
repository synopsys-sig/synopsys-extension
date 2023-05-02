import {assert, expect} from "chai";
import { assert, expect } from "chai";
import * as sinon from "sinon";
import { SynopsysBridge } from "../../../src/synopsys-task/synopsys-bridge";
import * as utility from "../../../src/synopsys-task/utility";
import { DownloadFileResponse } from "../../../src/synopsys-task/model/download-file-response";
import * as path from "path";
import * as inputs from "../../../src/synopsys-task/input";
import { SynopsysToolsParameter } from "../../../src/synopsys-task/tools-parameter";
import * as validator from "../../../src/synopsys-task/validator";
import * as constants from "../../../src/synopsys-task/application-constant";
import fs from "fs";
import * as taskLib from "azure-pipelines-task-lib";
import {extractZipped} from "../../../src/synopsys-task/utility";
import * as Q from "q";
import * as httpc from "typed-rest-client/HttpClient";
import * as ifm from "typed-rest-client/Interfaces";
import {IncomingMessage} from "http";
import {Socket} from "net";
import {SinonStub} from "sinon";

describe("Synopsys Bridge test", () => {
    let sandbox: sinon.SinonSandbox;
    context('Bridge command preparation', () => {
import * as constants from "../../../src/synopsys-task/application-constant";
import * as inputs from "../../../src/synopsys-task/input";
import { SynopsysToolsParameter } from "../../../src/synopsys-task/tools-parameter";
import * as validator from "../../../src/synopsys-task/validator";
describe("Synopsys Bridge test", () => {
    context('Bridge command preparation', () => {
        let sandbox: sinon.SinonSandbox;
        let synopsysBridge: SynopsysBridge;

        beforeEach(() => {
            sandbox = sinon.createSandbox();
            synopsysBridge = new SynopsysBridge();
        });

        afterEach(() => {
           sandbox.restore();
        });

        it('should run successfully for polaris command preparation', async function () {
            Object.defineProperty(inputs, 'POLARIS_SERVER_URL', {value: 'server_url'});

            sandbox.stub(validator, "validateScanTypes").returns([]);
            sandbox.stub(SynopsysToolsParameter.prototype, "getFormattedCommandForPolaris").callsFake(() => "./bridge --stage polaris --state polaris_input.json");
            sandbox.stub(validator, "validatePolarisInputs").returns([]);

            await synopsysBridge.prepareCommand("/temp");

            Object.defineProperty(inputs, 'POLARIS_SERVER_URL', {value: null});
        });

        it('should fail with no scan type provied error', async function () {
            sandbox.stub(validator, "validateScanTypes").returns(["bridge_polaris_serverUrl"]);
            sandbox.stub(SynopsysToolsParameter.prototype, "getFormattedCommandForPolaris").callsFake(() => "./bridge --stage polaris --state polaris_input.json");

            synopsysBridge.prepareCommand("/temp").catch(errorObje => {
                expect(errorObje.message).includes("Requires at least one scan type");
            })
        });

        it('should fail with mandatory parameter missing fields for polaris', async function () {
            Object.defineProperty(inputs, 'POLARIS_SERVER_URL', {value: 'server_url'});

            sandbox.stub(validator, "validatePolarisInputs").returns(['[bridge_polaris_accessToken,bridge_polaris_application_name,bridge_polaris_project_name,bridge_polaris_assessment_types] - required parameters for polaris is missing']);

            synopsysBridge.prepareCommand("/temp").catch(errorObje => {
                expect(errorObje.message).includes("required parameters for polaris is missing");
            })

            Object.defineProperty(inputs, 'POLARIS_SERVER_URL', {value: null})
        });

        it('should fail with mandatory parameter missing fields for polaris', async function () {
            expect(true).to.be.true;
            // TODO: Implement me once other scanning tools are also implemented
        });

        it('should fail with invalid assessment type error', async function () {
            Object.defineProperty(inputs, 'POLARIS_SERVER_URL', {value: 'server_url'});

            sandbox.stub(validator, "validateScanTypes").returns([]);
            sandbox.stub(SynopsysToolsParameter.prototype, "getFormattedCommandForPolaris").callsFake(() => {
                throw new Error("Invalid value for bridge_polaris_assessment_types")
            });
            sandbox.stub(validator, "validatePolarisInputs").returns([]);

            synopsysBridge.prepareCommand("/temp").catch(errorObje => {
                expect(errorObje.message).includes("Invalid value for bridge_polaris_assessment_types");
            })

            Object.defineProperty(inputs, 'POLARIS_SERVER_URL', {value: null})
        });
    });
});

describe("Download Bridge", () => {
    let sandbox: sinon.SinonSandbox;
    let bridgeUrl: string
    const osName = process.platform
    let bridgeDefaultPath = "";
    if ( osName === "linux") {
        bridgeDefaultPath = path.join(process.env["HOME"] as string, constants.SYNOPSYS_BRIDGE_DEFAULT_PATH_LINUX);
        bridgeUrl = "https://sig-repo.synopsys.com/artifactory/bds-integrations-release/com/synopsys/integration/synopsys-bridge/0.1.244/synopsys-bridge-0.1.244-linux64.zip"
    } else if (osName === "win32") {
        bridgeDefaultPath = path.join(
            process.env["USERPROFILE"] as string, constants.SYNOPSYS_BRIDGE_DEFAULT_PATH_WINDOWS)
        bridgeUrl = "https://sig-repo.synopsys.com/artifactory/bds-integrations-release/com/synopsys/integration/synopsys-bridge/0.1.244/synopsys-bridge-0.1.244-win64.zip"
    } else if(osName === "darwin") {
        bridgeDefaultPath = path.join(
            process.env["HOME"] as string, constants.SYNOPSYS_BRIDGE_DEFAULT_PATH_MAC)
        bridgeUrl = "https://sig-repo.synopsys.com/artifactory/bds-integrations-release/com/synopsys/integration/synopsys-bridge/0.1.244/synopsys-bridge-0.1.244-macosx.zip"
    }
    Object.defineProperty(process, 'platform', {
        value: process.platform
    })

    context("extractBridge", () => {
        let synopsysBridge: SynopsysBridge;
        beforeEach(() => {
            sandbox = sinon.createSandbox();
            synopsysBridge = new SynopsysBridge();
            Object.defineProperty(process, 'platform', {
                value: process.platform
            })
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("returns the value of SYNOPSYS_BRIDGE_PATH when it is defined and valid - success", async () => {
            Object.defineProperty(inputs, "SYNOPSYS_BRIDGE_PATH", {
                value: bridgeDefaultPath,
            });

            sandbox.stub(fs, "existsSync").returns(true);
            sandbox.stub(taskLib, "rmRF");
            sandbox.stub(utility, "extractZipped").returns(Promise.resolve(true));
            const downloadFileResponse = {} as DownloadFileResponse
            downloadFileResponse.filePath = bridgeDefaultPath
            const result = await synopsysBridge.extractBridge(downloadFileResponse);
            assert.equal(result, bridgeDefaultPath);
            Object.defineProperty(inputs, "SYNOPSYS_BRIDGE_PATH", {
                value: null,
            });
        });


    })

    context("executeBridgeCommand", () => {
        let synopsysBridge: SynopsysBridge;
        beforeEach(() => {
            sandbox = sinon.createSandbox();
            synopsysBridge = new SynopsysBridge();
            Object.defineProperty(process, 'platform', {
                value: process.platform
            })
        });

        afterEach(() => {
            sandbox.restore();
        });
        it("Execute Bridge Command - linux/mac success", async () => {
            const integer = Q.Promise<number>((resolve) => {
                resolve(0)
            });
            sandbox.stub(taskLib, "exec").returns(integer)

            const res = await synopsysBridge.executeBridgeCommand(bridgeDefaultPath, bridgeDefaultPath, bridgeDefaultPath)
            assert.equal(res, 0)
        });

        it("Execute Bridge Command - linux/mac failure", async () => {
            await synopsysBridge.executeBridgeCommand(bridgeDefaultPath, bridgeDefaultPath, bridgeDefaultPath)
                .catch(errorObj => {
                    console.log(errorObj.message)
                    expect(errorObj.message).includes("failed with exit code 9")
                })
        });
    })

    context("getBridgeUrl", () => {
        let synopsysBridge: SynopsysBridge;
        beforeEach(() => {
            sandbox = sinon.createSandbox();
            synopsysBridge = new SynopsysBridge();
            Object.defineProperty(process, 'platform', {
                value: process.platform
            })
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("returns the value of BRIDGE_DOWNLOAD_URL when it is defined and valid", async () => {
            Object.defineProperty(inputs, "BRIDGE_DOWNLOAD_URL", {
                value: bridgeUrl,
            });

            sandbox.stub(validator, "validateBridgeUrl").returns(true);
            sandbox.stub(synopsysBridge, "checkIfSynopsysBridgeVersionExists").returns(Promise.resolve(false));

            const result = await synopsysBridge.getBridgeUrl();
            assert.equal(result, bridgeUrl);
            Object.defineProperty(inputs, "BRIDGE_DOWNLOAD_URL", {
                value: null,
            });
        });

        it("returns the value of BRIDGE_DOWNLOAD_URL when it is defined, valid and version exists", async () => {
            Object.defineProperty(inputs, "BRIDGE_DOWNLOAD_URL", {
                value: bridgeUrl,
            });

            sandbox.stub(validator, "validateBridgeUrl").returns(true);
            sandbox.stub(synopsysBridge, "checkIfSynopsysBridgeVersionExists").returns(Promise.resolve(true));

            const result = await synopsysBridge.getBridgeUrl();
            assert.equal(result, "");
            Object.defineProperty(inputs, "BRIDGE_DOWNLOAD_URL", {
                value: null,
            });
        });

        it("throws an error when BRIDGE_DOWNLOAD_URL is defined but invalid", async () => {
            Object.defineProperty(inputs, "BRIDGE_DOWNLOAD_URL", {
                value: "invalid-url",
            });
            synopsysBridge.getBridgeUrl().catch(errorObj => {
                expect(errorObj.message).includes("Invalid URL")
            })

            Object.defineProperty(inputs, "BRIDGE_DOWNLOAD_URL", {
                value: undefined,
            });
        });

        it("returns the URL for the specified version when BRIDGE_DOWNLOAD_VERSION is defined and valid", async () => {
            Object.defineProperty(inputs, "BRIDGE_DOWNLOAD_VERSION", {
                value: "0.1.244",
            });
            sandbox.stub(synopsysBridge, "validateBridgeVersion").returns(Promise.resolve(true));
            //sandbox.stub(synopsysBridge, "getVersionUrl").returns(bridgeUrl);
            const result = await synopsysBridge.getBridgeUrl();
            expect(result).equals(bridgeUrl);
        });


        it("throws an error when BRIDGE_DOWNLOAD_VERSION is defined but invalid", async () => {
            Object.defineProperty(inputs, "BRIDGE_DOWNLOAD_VERSION", {
                value: "invalid-version",
            });
            sandbox.stub(synopsysBridge, "validateBridgeVersion").returns(Promise.resolve(false));
            synopsysBridge.getBridgeUrl().catch(errorObj => {
                expect(errorObj.message).includes("Provided bridge version not found in artifactory")
            })
            Object.defineProperty(inputs, "BRIDGE_DOWNLOAD_VERSION", {
                value: undefined,
            });
        });

        it("returns the URL for the latest version when neither BRIDGE_DOWNLOAD_URL nor BRIDGE_DOWNLOAD_VERSION are defined", async () => {

            sandbox.stub(synopsysBridge, "getLatestVersion").returns(Promise.resolve("0.1.244"));
            sandbox.stub(synopsysBridge, "getVersionUrl").returns(bridgeUrl);
            const result = await synopsysBridge.getBridgeUrl();
            expect(result).equals(bridgeUrl);
        });
    });

    context("validateBridgeVersion", () => {
        let synopsysBridge: SynopsysBridge;
        beforeEach(() => {
            sandbox = sinon.createSandbox();
            synopsysBridge = new SynopsysBridge();
            Object.defineProperty(process, 'platform', {
                value: process.platform
            })
        });

        afterEach(() => {
            sandbox.restore();
        });

        let versions: string[];
        versions = ["0.1.244"]
        it("When version is available", async () => {
            sandbox.stub(synopsysBridge, "getAllAvailableBridgeVersions").returns(Promise.resolve(versions));
            const result = await synopsysBridge.validateBridgeVersion("0.1.244")
            expect(result).equals(true);
        });

        it("When version is not available", async () => {
            sandbox.stub(synopsysBridge, "getAllAvailableBridgeVersions").returns(Promise.resolve(versions));
            const result = await synopsysBridge.validateBridgeVersion("0.1.245")
            expect(result).equals(false);
        });


    });

    context("downloadBridge", () => {
        let synopsysBridge: SynopsysBridge;
        beforeEach(() => {
            sandbox = sinon.createSandbox();
            synopsysBridge = new SynopsysBridge();
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("BRIDGE_DOWNLOAD_VERSION is defined and valid", async () => {
            Object.defineProperty(inputs, "BRIDGE_DOWNLOAD_VERSION", {value: "0.1.244"});
            synopsysBridge.bridgeExecutablePath = bridgeDefaultPath
            sandbox.stub(synopsysBridge, "checkIfSynopsysBridgeVersionExists").returns(Promise.resolve(true));

            const result = await synopsysBridge.downloadBridge("/");
            assert.equal(result, bridgeDefaultPath);

            Object.defineProperty(inputs, "BRIDGE_DOWNLOAD_VERSION", {
                value: null,
            });
            synopsysBridge.bridgeExecutablePath = "";
        });

        it("BRIDGE_DOWNLOAD_VERSION is not defined, get Bridge url - success", async () => {
            synopsysBridge.bridgeExecutablePath = bridgeDefaultPath
            sandbox.stub(synopsysBridge, "checkIfSynopsysBridgeVersionExists").returns(Promise.resolve(false));
            sandbox.stub(synopsysBridge, "getBridgeUrl").returns(Promise.resolve(bridgeUrl))

            const downloadFileResponse = {} as DownloadFileResponse
            downloadFileResponse.filePath = bridgeDefaultPath
            sandbox.stub(utility, "getRemoteFile").returns(Promise.resolve(downloadFileResponse))
            sandbox.stub(synopsysBridge, "extractBridge").returns(Promise.resolve(bridgeDefaultPath))

            const result = await synopsysBridge.downloadBridge("/")
            assert.equal(result, bridgeDefaultPath);
        });

        it("BRIDGE_DOWNLOAD_VERSION is not defined, valid without Bridge url", async () => {
            synopsysBridge.bridgeExecutablePath = bridgeDefaultPath
            sandbox.stub(synopsysBridge, "checkIfSynopsysBridgeVersionExists").returns(Promise.resolve(false));
            sandbox.stub(synopsysBridge, "getBridgeUrl").returns(Promise.resolve(undefined));

            const result = await synopsysBridge.downloadBridge("/");
            assert.equal(result, bridgeDefaultPath);

            Object.defineProperty(inputs, "BRIDGE_DOWNLOAD_VERSION", {
                value: null,
            });
        });

        it("BRIDGE_DOWNLOAD_VERSION is not defined, throw exception", async () => {
            synopsysBridge.bridgeExecutablePath = bridgeDefaultPath
            sandbox.stub(synopsysBridge, "checkIfSynopsysBridgeVersionExists").returns(Promise.resolve(false));
            sandbox.stub(synopsysBridge, "getBridgeUrl").throws(new Error());

            await synopsysBridge.downloadBridge("/").catch(errorObj => {
                expect(errorObj.message).includes("Bridge could not be downloaded");
            })
        });
    });

    context("checkIfSynopsysBridgeVersionExists", () => {
        let synopsysBridge: SynopsysBridge;
        beforeEach(() => {
            sandbox = sinon.createSandbox();
            synopsysBridge = new SynopsysBridge();
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("SYNOPSYS_BRIDGE_PATH is defined and valid", async () => {
            Object.defineProperty(inputs, "SYNOPSYS_BRIDGE_PATH", {value: bridgeDefaultPath});
            synopsysBridge.bridgeExecutablePath = bridgeDefaultPath
            sandbox.stub(synopsysBridge, "checkIfVersionExists").returns(Promise.resolve(true));
            sandbox.stub(utility, "checkIfPathExists").returns(true);

            const result = await synopsysBridge.checkIfSynopsysBridgeVersionExists("0.1.244");
            assert.equal(result, true);

            Object.defineProperty(inputs, "SYNOPSYS_BRIDGE_PATH", {
                value: null,
            });
            synopsysBridge.bridgeExecutablePath = "";
        });

        it("SYNOPSYS_BRIDGE_PATH is defined and valid and version does not exists", async () => {
            Object.defineProperty(inputs, "SYNOPSYS_BRIDGE_PATH", {value: "/path/path"});
            synopsysBridge.bridgeExecutablePath = bridgeDefaultPath
            sandbox.stub(synopsysBridge, "checkIfVersionExists").returns(Promise.resolve(false));
            const result = await synopsysBridge.checkIfSynopsysBridgeVersionExists("0.1.244");
            assert.equal(result, false);

            Object.defineProperty(inputs, "SYNOPSYS_BRIDGE_PATH", {
                value: null,
            });
            synopsysBridge.bridgeExecutablePath = "";
        });

        it("SYNOPSYS_BRIDGE_PATH is not defined", async () => {
            sandbox.stub(utility, "checkIfPathExists").returns(true);
            sandbox.stub(synopsysBridge, "checkIfVersionExists").returns(Promise.resolve(true));
            const result = await synopsysBridge.checkIfSynopsysBridgeVersionExists("0.1.244");
            assert.equal(result, true);
        });
    })

    context("getLatestVersion", () => {
        let synopsysBridge: SynopsysBridge;
        beforeEach(() => {
            sandbox = sinon.createSandbox();
            synopsysBridge = new SynopsysBridge();
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("Get Latest Version - success", async () => {

            sandbox.stub(synopsysBridge, "getAllAvailableBridgeVersions").returns(Promise.resolve(['0.1.1', '0.2.1']));

            const result = await synopsysBridge.getLatestVersion();
            assert.equal(result, '0.2.1');
        });
    })

    context("checkIfVersionExists", () => {
        let synopsysBridge: SynopsysBridge;
        beforeEach(() => {
            sandbox = sinon.createSandbox();
            synopsysBridge = new SynopsysBridge();
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("Check If Version Exists - success", async () => {

            sandbox.stub(fs, "readFileSync").returns('Synopsys Bridge Package: 0.1.1');

            const result = await synopsysBridge.checkIfVersionExists('0.1.1', bridgeDefaultPath);
            assert.equal(result, true);
        });

        it("Check If Version Exists - failure", async () => {

            sandbox.stub(fs, "readFileSync").returns('0.1.1');

            const result = await synopsysBridge.checkIfVersionExists('0.1.1', bridgeDefaultPath);
            assert.equal(result, false);
        });

        it("Check If Version Exists - exception", async () => {
            sandbox.stub(fs, "readFileSync").throws(new Error("file not found"))
            await synopsysBridge.checkIfVersionExists('0.1.1', bridgeDefaultPath).catch(errorObj => {
                expect(errorObj.message).includes("file not found")
            })
        });
    })

    context("getAllAvailableBridgeVersions", () => {

        let httpClientStub: SinonStub<any[], Promise<httpc.HttpClientResponse>>;
        let synopsysBridge: SynopsysBridge;
        beforeEach(() => {
            synopsysBridge = new SynopsysBridge();
            httpClientStub = sinon.stub()
        });

        afterEach(() => {
            sinon.restore();
        });

        it("Test getLatestVersion - Patch version", async () => {
            const incomingMessage: IncomingMessage = new IncomingMessage(new Socket())
            const responseBody = "'\\n' + '<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 3.2 Final//EN\">\\n' + '<html>\\n' + '<head><meta name=\"robots\" content=\"noindex\" />\\n' + '<title>Index of bds-integrations-release/com/synopsys/integration/synopsys-action</title>\\n' + '</head>\\n' + '<body>\\n' + '<h1>Index of bds-integrations-release/com/synopsys/integration/synopsys-action</h1>\\n' + '<pre>Name    Last modified      Size</pre><hr/>\\n' + '<pre><a href=\"../\">../</a>\\n' + '<a href=\"0.1.114/\">0.1.114/</a>  17-Oct-2022 19:46    -\\n' + '<a href=\"0.1.72/\">0.1.72/</a>  17-Oct-2022 19:46    -\\n' + '<a href=\"0.1.67/\">0.1.67/</a>  07-Oct-2022 00:35    -\\n' + '<a href=\"0.1.61/\">0.1.61/</a>  04-Oct-2022 23:05    -\\n' + '</pre>\\n' + '<hr/><address style=\"font-size:small;\">Artifactory/7.31.13 Server at sig-repo.synopsys.com Port 80</address></body></html>'"

            const response: ifm.IHttpClientResponse = {
                message: incomingMessage,
                readBody: async () => responseBody
            };

            httpClientStub.resolves(response)
            sinon.stub(httpc, 'HttpClient').returns({
                get: httpClientStub,
            } as any);

            const result = await synopsysBridge.getAllAvailableBridgeVersions()
            assert.includeMembers(result,['0.1.114'])
        })



        it('Test getLatestVersion - Minor version', async () => {
            const incomingMessage: IncomingMessage = new IncomingMessage(new Socket())
            const responseBody = "'\\n' + '<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 3.2 Final//EN\">\\n' + '<html>\\n' + '<head><meta name=\"robots\" content=\"noindex\" />\\n' + '<title>Index of bds-integrations-release/com/synopsys/integration/synopsys-action</title>\\n' + '</head>\\n' + '<body>\\n' + '<h1>Index of bds-integrations-release/com/synopsys/integration/synopsys-action</h1>\\n' + '<pre>Name    Last modified      Size</pre><hr/>\\n' + '<pre><a href=\"../\">../</a>\\n' + '<a href=\"0.1.61/\">0.1.61/</a>  04-Oct-2022 23:05    -\\n' + '<a href=\"0.1.67/\">0.1.67/</a>  07-Oct-2022 00:35    -\\n' + '<a href=\"0.1.72/\">0.1.72/</a>  17-Oct-2022 19:46    -\\n' + '<a href=\"0.2.1/\">0.2.1/</a>  17-Oct-2022 19:58    -\\n' + '</pre>\\n' + '<hr/><address style=\"font-size:small;\">Artifactory/7.31.13 Server at sig-repo.synopsys.com Port 80</address></body></html>'"

            const response: ifm.IHttpClientResponse = {
                message: incomingMessage,
                readBody: async () => responseBody
            };

            httpClientStub.resolves(response)
            sinon.stub(httpc, 'HttpClient').returns({
                get: httpClientStub,
            } as any);

            const result = await synopsysBridge.getAllAvailableBridgeVersions()
            assert.includeMembers(result,['0.2.1'])
        })

      it('Test getLatestVersion - Minor version without sequence', async () => {
          const incomingMessage: IncomingMessage = new IncomingMessage(new Socket())
          const responseBody = "'\\n' +\n" +
              "                '<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 3.2 Final//EN\">\\n' +\n" +
              "                '<html>\\n' +\n" +
              "                '<head><meta name=\"robots\" content=\"noindex\" />\\n' +\n" +
              "                '<title>Index of bds-integrations-release/com/synopsys/integration/synopsys-action</title>\\n' +\n" +
              "                '</head>\\n' +\n" +
              "                '<body>\\n' +\n" +
              "                '<h1>Index of bds-integrations-release/com/synopsys/integration/synopsys-action</h1>\\n' +\n" +
              "                '<pre>Name     Last modified      Size</pre><hr/>\\n' +\n" +
              "                '<pre><a href=\"../\">../</a>\\n' +\n" +
              "                '<a href=\"0.1.114/\">0.1.114/</a>  16-Dec-2022 16:45    -\\n' +\n" +
              "                '<a href=\"0.1.162/\">0.1.162/</a>  24-Jan-2023 18:41    -\\n' +\n" +
              "                '<a href=\"0.1.61/\">0.1.61/</a>   04-Oct-2022 23:05    -\\n' +\n" +
              "                '<a href=\"0.1.67/\">0.1.67/</a>   07-Oct-2022 00:35    -\\n' +\n" +
              "                '<a href=\"0.1.72/\">0.1.72/</a>   17-Oct-2022 19:46    -\\n' +\n" +
              "                '</pre>\\n' +\n" +
              "                '<hr/><address style=\"font-size:small;\">Artifactory/7.31.13 Server at sig-repo.synopsys.com Port 80</address><script type=\"text/javascript\" src=\"/_Incapsula_Resource?SWJIYLWA=719d34d31c8e3a6e6fffd425f7e032f3&ns=1&cb=1747967294\" async></script></body></html>'"

          const response: ifm.IHttpClientResponse = {
              message: incomingMessage,
              readBody: sinon.stub().resolves(responseBody)
          };

          httpClientStub.resolves(response)
          sinon.stub(httpc, 'HttpClient').returns({
              get: httpClientStub,
          } as any);

          const result = await synopsysBridge.getAllAvailableBridgeVersions()
          assert.includeMembers(result,['0.1.162'])
        })

        it('Test getLatestVersion - Major version', async () => {
            const incomingMessage: IncomingMessage = new IncomingMessage(new Socket())
            const responseBody = "'\\n' + '<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 3.2 Final//EN\">\\n' + '<html>\\n' + '<head><meta name=\"robots\" content=\"noindex\" />\\n' + '<title>Index of bds-integrations-release/com/synopsys/integration/synopsys-action</title>\\n' + '</head>\\n' + '<body>\\n' + '<h1>Index of bds-integrations-release/com/synopsys/integration/synopsys-action</h1>\\n' + '<pre>Name    Last modified      Size</pre><hr/>\\n' + '<pre><a href=\"../\">../</a>\\n' + '<a href=\"0.1.61/\">0.1.61/</a>  04-Oct-2022 23:05    -\\n' + '<a href=\"0.1.67/\">0.1.67/</a>  07-Oct-2022 00:35    -\\n' + '<a href=\"0.1.72/\">0.1.72/</a>  17-Oct-2022 19:46    -\\n' + '<a href=\"0.2.1/\">0.2.1/</a>  17-Oct-2022 19:58    -\\n' + '<a href=\"1.0.0/\">1.0.0/</a>  17-Oct-2022 19:58    -\\n' + '</pre>\\n' + '<hr/><address style=\"font-size:small;\">Artifactory/7.31.13 Server at sig-repo.synopsys.com Port 80</address></body></html>'"

            const response: ifm.IHttpClientResponse = {
                message: incomingMessage,
                readBody: sinon.stub().resolves(responseBody)
            };

            httpClientStub.resolves(response)
            sinon.stub(httpc, 'HttpClient').returns({
                get: httpClientStub,
            } as any);

            const result = await synopsysBridge.getAllAvailableBridgeVersions()
            assert.includeMembers(result,['1.0.0'])

        })
    })
})

    });
});