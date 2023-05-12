import {assert, expect} from "chai";
import * as sinon from "sinon";
import {SinonStub} from "sinon";
import * as diagnostics from "../../../src/synopsys-task/diagnostics";
import * as inputs from "../../../src/synopsys-task/input";
import * as constants from "../../../src/synopsys-task/application-constant";
import fs from "fs";
import * as taskLib from "azure-pipelines-task-lib";
import * as Q from "q";
import * as httpc from "typed-rest-client/HttpClient";
import * as ifm from "typed-rest-client/Interfaces";
import {IncomingMessage} from "http";
import {Socket} from "net";
import * as mocha from "mocha";

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
            const uploadArtifactFunc = sandbox.stub().returns(undefined);
            uploadArtifactFunc.withArgs("containerFolder","folderOrFilePath","artifactName");
            sandbox.stub(taskLib, "uploadArtifact").callsFake(uploadArtifactFunc);
            const result = await diagnostics.uploadDiagnostics("test");
            assert.strictEqual(result, undefined);
        });

        // it('shpould fail for error from taksLib uploadArtifact fucntion', async function () {
        //     sandbox.stub(taskLib, "exist").returns(true);
        //     const uploadArtifactFunc = sandbox.stub().throws(new Error("Error uploading artifacts"))
        //     uploadArtifactFunc.withArgs("containerFolder","folderOrFilePath","artifactName");
        //     sandbox.stub(taskLib, "uploadArtifact").callsFake(uploadArtifactFunc);
        //     await diagnostics.uploadDiagnostics("test").catch(errorObj => {
        //         expect(errorObj.message).includes("Error uploading artifacts");
        //     })
        // });

        it('upload diagnostics with invalid directory', async function () {
            sandbox.stub(taskLib, "exist").returns(false);
            await diagnostics.uploadDiagnostics("test");
        });

    });

});