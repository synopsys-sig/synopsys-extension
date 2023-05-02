import { assert, expect } from "chai";
import * as sinon from "sinon";
import { SynopsysBridge } from "../../../src/synopsys-task/synopsys-bridge";
import * as utility from "../../../src/synopsys-task/utility";
import { DownloadFileResponse } from "../../../src/synopsys-task/model/download-file-response";
import * as path from "path";
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
    });
});