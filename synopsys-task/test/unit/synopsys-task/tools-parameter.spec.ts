import { expect } from "chai";
import * as sinon from "sinon";
import { SynopsysToolsParameter } from "../../../src/synopsys-task/tools-parameter";
import * as process from "process";
import * as path from "path";
import * as taskLib from "azure-pipelines-task-lib/task";
import * as inputs from "../../../src/synopsys-task/input";
import { Polaris } from "../../../src/synopsys-task/model/polaris";
import { InputData } from "../../../src/synopsys-task/model/input-data";
import * as fs from 'fs';

describe("Synopsys Tools Parameter test", () => {
    context('Polaris command preparation', () => {
        let sandbox: sinon.SinonSandbox;
        let synopsysToolsParameter: SynopsysToolsParameter;
        let polarisStateFile: string;

        beforeEach(() => {
            sandbox = sinon.createSandbox();
            const tempDir = process.cwd();
            polarisStateFile = path.join(tempDir, "polaris_input.json");
            synopsysToolsParameter = new SynopsysToolsParameter(tempDir);
        });

        afterEach(() => {
            const polarisInputJson =
            taskLib.rmRF(polarisStateFile);
            Object.defineProperty(inputs, 'POLARIS_SERVER_URL', {value: ''})
            Object.defineProperty(inputs, 'POLARIS_ACCESS_TOKEN', {value: ''})
            Object.defineProperty(inputs, 'POLARIS_APPLICATION_NAME', {value: ''})
            Object.defineProperty(inputs, 'POLARIS_PROJECT_NAME', {value: ''})
            Object.defineProperty(inputs, 'POLARIS_ASSESSMENT_TYPES', {value: ['SCA','sast']})
            sandbox.restore();
        });

        it('should success for polaris command formation', function () {
            Object.defineProperty(inputs, 'POLARIS_SERVER_URL', {value: 'server_url'})
            Object.defineProperty(inputs, 'POLARIS_ACCESS_TOKEN', {value: 'access_token'})
            Object.defineProperty(inputs, 'POLARIS_APPLICATION_NAME', {value: 'POLARIS_APPLICATION_NAME'})
            Object.defineProperty(inputs, 'POLARIS_PROJECT_NAME', {value: 'POLARIS_PROJECT_NAME'})
            Object.defineProperty(inputs, 'POLARIS_ASSESSMENT_TYPES', {value: ['SCA','sast']});

            const formattedCommand = synopsysToolsParameter.getFormattedCommandForPolaris();

            const jsonString = fs.readFileSync(polarisStateFile, 'utf-8');
            const jsonData = JSON.parse(jsonString);
            expect(jsonData.data.polaris.serverUrl).to.be.contains('server_url');
            expect(jsonData.data.polaris.accesstoken).to.be.contains('access_token');
            expect(jsonData.data.polaris.application.name).to.be.contains('POLARIS_APPLICATION_NAME');
            
            expect(formattedCommand).contains('--stage polaris');
            expect(formattedCommand).contains('--state '.concat(polarisStateFile));
        });

        it('should fail for invalid assessment type', function () {
            Object.defineProperty(inputs, 'POLARIS_ASSESSMENT_TYPES', {value: ['SCA','sast123']})

            try {
                const formattedCommand = synopsysToolsParameter.getFormattedCommandForPolaris();
            } catch (e) {
                const errorObj = e as Error;
                expect(errorObj.message).contains('Invalid value for bridge_polaris_assessment_types')
            }
        });
    });
});