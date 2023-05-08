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
import * as mocha from 'mocha';
import * as validator from "../../../src/synopsys-task/validator";

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

    context('Coverity command preparation', () => {
        let sandbox: sinon.SinonSandbox;
        let synopsysToolsParameter: SynopsysToolsParameter;
        let coverityStateFile: string;

        beforeEach(() => {
            sandbox = sinon.createSandbox();
            const tempDir = process.cwd();
            coverityStateFile = path.join(tempDir, "coverity_input.json");
            synopsysToolsParameter = new SynopsysToolsParameter(tempDir);
        });

        afterEach(() => {
            taskLib.rmRF(coverityStateFile);
            Object.defineProperty(inputs, 'COVERITY_URL', {value: ''})
            Object.defineProperty(inputs, 'COVERITY_USER', {value: ''})
            Object.defineProperty(inputs, 'COVERITY_USER_PASSWORD', {value: ''})
            Object.defineProperty(inputs, 'COVERITY_PROJECT_NAME', {value: ''})
            Object.defineProperty(inputs, 'COVERITY_STREAM_NAME', {value: ''})
            Object.defineProperty(inputs, 'COVERITY_INSTALL_DIRECTORY', {value: ''})
            Object.defineProperty(inputs, 'COVERITY_POLICY_VIEW', {value: ''})
            sandbox.restore();
        });

        it('should success for coverity command formation with mandatory and optional parameters', function () {
            Object.defineProperty(inputs, 'COVERITY_URL', {value: 'https://test.com'})
            Object.defineProperty(inputs, 'COVERITY_USER', {value: 'test-user'})
            Object.defineProperty(inputs, 'COVERITY_USER_PASSWORD', {value: 'password'})
            Object.defineProperty(inputs, 'COVERITY_PROJECT_NAME', {value: 'test'})
            Object.defineProperty(inputs, 'COVERITY_STREAM_NAME', {value: 'test'})
            Object.defineProperty(inputs, 'COVERITY_INSTALL_DIRECTORY', {value: process.cwd()})
            Object.defineProperty(inputs, 'COVERITY_POLICY_VIEW', {value: 'test'})

            sandbox.stub(validator, "validateCoverityInstallDirectoryParam").returns(true);
            const formattedCommand = synopsysToolsParameter.getFormattedCommandForCoverity();

            const jsonString = fs.readFileSync(coverityStateFile, 'utf-8');
            const jsonData = JSON.parse(jsonString);
            expect(jsonData.data.coverity.connect.url).to.be.equals('https://test.com');
            expect(jsonData.data.coverity.connect.user.name).to.be.equals('test-user');
            expect(jsonData.data.coverity.connect.user.password).to.be.equals('password');
            expect(jsonData.data.coverity.connect.policy.view).to.be.equals('test');
            expect(jsonData.data.coverity.connect.stream.name).to.be.equals('test');
            expect(jsonData.data.coverity.connect.project.name).to.be.equals('test');
            expect(jsonData.data.coverity.install.directory).to.be.equals(process.cwd());        
            expect(formattedCommand).contains('--stage connect');
            expect(formattedCommand).contains('--state '.concat(coverityStateFile));
        });

        it('should success for coverity command formation with mandatory parameters', function () {
            Object.defineProperty(inputs, 'COVERITY_URL', {value: 'https://test.com'})
            Object.defineProperty(inputs, 'COVERITY_USER', {value: 'test-user'})
            Object.defineProperty(inputs, 'COVERITY_USER_PASSWORD', {value: 'password'})
            Object.defineProperty(inputs, 'COVERITY_PROJECT_NAME', {value: 'test'})
            Object.defineProperty(inputs, 'COVERITY_STREAM_NAME', {value: 'test'})

            const formattedCommand = synopsysToolsParameter.getFormattedCommandForCoverity();
            const jsonString = fs.readFileSync(coverityStateFile, 'utf-8');
            const jsonData = JSON.parse(jsonString);
            expect(jsonData.data.coverity.connect.url).to.be.equals('https://test.com');
            expect(jsonData.data.coverity.connect.user.name).to.be.equals('test-user');
            expect(jsonData.data.coverity.connect.user.password).to.be.equals('password');
            expect(jsonData.data.coverity.connect.stream.name).to.be.equals('test');
            expect(jsonData.data.coverity.connect.project.name).to.be.equals('test');   
            expect(formattedCommand).contains('--stage connect');
            expect(formattedCommand).contains('--state '.concat(coverityStateFile));
        });

        it('should success for coverity command formation with invalid coverity install directory', function () {
            Object.defineProperty(inputs, 'COVERITY_URL', {value: 'https://test.com'})
            Object.defineProperty(inputs, 'COVERITY_USER', {value: 'test-user'})
            Object.defineProperty(inputs, 'COVERITY_USER_PASSWORD', {value: 'password'})
            Object.defineProperty(inputs, 'COVERITY_PROJECT_NAME', {value: 'test'})
            Object.defineProperty(inputs, 'COVERITY_STREAM_NAME', {value: 'test'})
            Object.defineProperty(inputs, 'COVERITY_INSTALL_DIRECTORY', {value: 'test-dir'})

            sandbox.stub(validator, "validateCoverityInstallDirectoryParam").returns(false);
            const formattedCommand = synopsysToolsParameter.getFormattedCommandForCoverity();

            const jsonString = fs.readFileSync(coverityStateFile, 'utf-8');
            const jsonData = JSON.parse(jsonString);
            expect(jsonData.data.coverity.connect.url).to.be.equals('https://test.com');
            expect(jsonData.data.coverity.connect.user.name).to.be.equals('test-user');
            expect(jsonData.data.coverity.connect.user.password).to.be.equals('password');
            expect(jsonData.data.coverity.connect.stream.name).to.be.equals('test');
            expect(jsonData.data.coverity.connect.project.name).to.be.equals('test');   
            expect(formattedCommand).contains('--stage connect');
            expect(formattedCommand).contains('--state '.concat(coverityStateFile));
        });
    });
});