import {assert, expect} from "chai";
import * as sinon from "sinon";
import * as diagnostics from "../../../src/synopsys-task/diagnostics";
import * as taskLib from "azure-pipelines-task-lib";
import * as inputs from "../../../src/synopsys-task/input";

describe("Synopsys Bridge upload diagnostics test", () => {
    
    let sandbox: sinon.SinonSandbox;
    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });
    afterEach(() => {
        sandbox.restore();
    });

    context('uploadDiagnostics', () => {

        it('shpould success with valid directory and void/undefined type return', async function () {
            sandbox.stub(taskLib, "exist").returns(true);
            const uploadArtifactStub = sandbox.stub(taskLib, 'uploadArtifact').returns(undefined);
            assert.strictEqual(diagnostics.uploadDiagnostics("test"), undefined);
            expect(uploadArtifactStub.returned(undefined)).to.be.true;
            
        });

        it('upload diagnostics with invalid directory', async function () {
            sandbox.stub(taskLib, "exist").returns(false);
            diagnostics.uploadDiagnostics("test");
        });

    });

    context('uploadSarifResultAsArtifact', () => {

        it('shpould success with sarif file path and void/undefined type return', async function () {
            Object.defineProperty(inputs, 'REPORTS_SARIF_FILE_PATH', {value: 'test-dir/test-path.json'})
            sandbox.stub(taskLib, "exist").returns(true);
            const uploadArtifactStub = sandbox.stub(taskLib, 'uploadArtifact').returns(undefined);
            assert.strictEqual(diagnostics.uploadSarifResultAsArtifact("test"), undefined);
            expect(uploadArtifactStub.returned(undefined)).to.be.true;
        });

        it('shpould success with default sarif file path and void/undefined type return', async function () {
            Object.defineProperty(inputs, 'REPORTS_SARIF_FILE_PATH', {value: './bridge/SARIF Report Generator/test-path.json'})
            sandbox.stub(taskLib, "exist").returns(true);
            const uploadArtifactStub = sandbox.stub(taskLib, 'uploadArtifact').returns(undefined);
            assert.strictEqual(diagnostics.uploadSarifResultAsArtifact("test"), undefined);
            expect(uploadArtifactStub.returned(undefined)).to.be.true;
        });

        it('upload diagnostics with invalid directory', async function () {
            sandbox.stub(taskLib, "exist").returns(false);
            diagnostics.uploadSarifResultAsArtifact("test");
        });

    });

});