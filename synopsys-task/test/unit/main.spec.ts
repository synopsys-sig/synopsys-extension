import {assert, expect} from "chai";
import * as sinon from "sinon";
import * as main from "../../src/main";
import * as inputs from "../../src/synopsys-task/input";
import { SynopsysBridge } from "../../src/synopsys-task/synopsys-bridge";
import * as diagnostics from "../../src/synopsys-task/diagnostics";
import fs from "fs";
import * as taskLib from "azure-pipelines-task-lib";
import * as Q from "q";
import * as httpc from "typed-rest-client/HttpClient";
import * as ifm from "typed-rest-client/Interfaces";
import {IncomingMessage} from "http";
import {Socket} from "net";
import * as mocha from "mocha";

describe("Main function test cases", () => {

    let sandbox: sinon.SinonSandbox;
    let synopsysBridge: SynopsysBridge;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        synopsysBridge = new SynopsysBridge();
        process.env['BUILD_REPOSITORY_LOCALPATH']  = '/tmp'
    });
    afterEach(() => {
        Object.defineProperty(inputs, 'ENABLE_NETWORK_AIRGAP', {value: false});
        sandbox.restore();
        process.env['BUILD_REPOSITORY_LOCALPATH']  = ''
    });

    context('uploadDiagnostics', () => {

        it('should call upload diagnostics: success with value true', async () => {
            Object.defineProperty(inputs, 'INCLUDE_DIAGNOSTICS', {value: 'true'});
            sandbox.stub(SynopsysBridge.prototype, 'prepareCommand').resolves("test command")
            sandbox.stub(SynopsysBridge.prototype, 'downloadAndExtractBridge').resolves("test-path")
            sandbox.stub(SynopsysBridge.prototype, 'executeBridgeCommand').resolves(0)
            sandbox.stub(diagnostics, 'uploadDiagnostics').returns(undefined)
            main.run()
            assert.strictEqual(diagnostics.uploadDiagnostics("test"), undefined);
        });


        it('should call upload diagnostics: success with value false', async () => {
            Object.defineProperty(inputs, 'INCLUDE_DIAGNOSTICS', {value: 'false'});
            sandbox.stub(SynopsysBridge.prototype, 'prepareCommand').resolves("test command")
            sandbox.stub(SynopsysBridge.prototype, 'downloadAndExtractBridge').resolves("test-path")
            sandbox.stub(SynopsysBridge.prototype, 'executeBridgeCommand').resolves(0)
            sandbox.stub(diagnostics, 'uploadDiagnostics').returns(undefined)
            main.run()
            assert.strictEqual(diagnostics.uploadDiagnostics("test"), undefined);
        });


        it('should call upload diagnostics: failure', async () => {
            Object.defineProperty(inputs, 'INCLUDE_DIAGNOSTICS', {value: 'true'});
            sandbox.stub(SynopsysBridge.prototype, 'prepareCommand').resolves("test command")
            sandbox.stub(SynopsysBridge.prototype, 'downloadAndExtractBridge').resolves("test-path")
            sandbox.stub(SynopsysBridge.prototype, 'executeBridgeCommand').resolves(0)
            sandbox.stub(diagnostics,'uploadDiagnostics').throws(new Error("Error uploading artifacts"))
            main.run().catch(errorObj => {
                expect(errorObj.message).includes("Error uploading artifacts");
            })
        });

    });

    context('main function', () => {
        it('main failure', async () => {
            main.run().catch(errorObj => {
                expect(errorObj.message).includes("Requires at least one scan type");
            })
        });
    });

    context('air gap function', () => {
        it('air gap enabled: success', async () => {
            Object.defineProperty(inputs, 'ENABLE_NETWORK_AIRGAP', {value: true});
            sandbox.stub(SynopsysBridge.prototype, 'prepareCommand').resolves("test command")
            sandbox.stub(SynopsysBridge.prototype, 'getSynopsysBridgePath').resolves("test command")
            sandbox.stub(SynopsysBridge.prototype, 'downloadAndExtractBridge').resolves("test-path")
            sandbox.stub(SynopsysBridge.prototype, 'executeBridgeCommand').resolves(0)
            main.run()
        });

        it('air gap enabled: failure', async () => {
            Object.defineProperty(inputs, 'ENABLE_NETWORK_AIRGAP', {value: true});
            sandbox.stub(SynopsysBridge.prototype, 'prepareCommand').resolves("test command")
            sandbox.stub(SynopsysBridge.prototype, 'downloadAndExtractBridge').resolves("test-path")
            sandbox.stub(SynopsysBridge.prototype, 'executeBridgeCommand').resolves(0)
            main.run().catch(errorObj => {
                expect(errorObj.message).includes("Synopsys Default Bridge path does not exist");
            })
        });
    });
});