import { expect } from "chai";
import * as sinon from "sinon";
import * as mocha from 'mocha';
import { SynopsysBridge } from "../../../src/synopsys-task/synopsys-bridge";
import * as utility from "../../../src/synopsys-task/utility";
import { DownloadFileResponse } from "../../../src/synopsys-task/model/download-file-response";
import * as path from "path";
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

            const preparedCommand = await synopsysBridge.prepareCommand("/temp");
            expect(preparedCommand).contains("./bridge --stage polaris --state polaris_input.json")

            Object.defineProperty(inputs, 'POLARIS_SERVER_URL', {value: null});
        });

        it('should fail with no scan type provied error', async function () {
            sandbox.stub(validator, "validateScanTypes").returns(["bridge_polaris_serverUrl", "bridge_coverity_connect_url","bridge_blackduck_url"]);

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

        // coverity test cases
        it('should run successfully for coverity command preparation', async function () {
            Object.defineProperty(inputs, 'COVERITY_URL', {value: 'https://test.com'});

            sandbox.stub(validator, "validateScanTypes").returns([]);
            sandbox.stub(SynopsysToolsParameter.prototype, "getFormattedCommandForCoverity").callsFake(() => "./bridge --stage connect --state coverity_input.json");
            sandbox.stub(validator, "validateCoverityInputs").returns([]);

            const preparedCommand = await synopsysBridge.prepareCommand("/temp");
            expect(preparedCommand).contains("./bridge --stage connect --state coverity_input.json")

            Object.defineProperty(inputs, 'COVERITY_URL', {value: null});
        });

        it('should fail with mandatory parameter missing fields for coverity', async function () {
            
            Object.defineProperty(inputs, 'COVERITY_URL', {value: 'https://test.com'});
            sandbox.stub(validator, "validateCoverityInputs").returns(['[bridge_coverity_connect_user_password,bridge_coverity_connect_project_name,bridge_coverity_connect_stream_name] - required parameters for coverity is missing']);
            synopsysBridge.prepareCommand("/temp").catch(errorObje => {
                expect(errorObje.message).equals('[bridge_coverity_connect_user_password,bridge_coverity_connect_project_name,bridge_coverity_connect_stream_name] - required parameters for coverity is missing');
            })
            Object.defineProperty(inputs, 'COVERITY_URL', {value: null})
        });

    });
});