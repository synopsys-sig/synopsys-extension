import {expect} from "chai";
import * as sinon from "sinon";
import {SynopsysToolsParameter} from "../../../src/synopsys-task/tools-parameter";
import * as process from "process";
import * as path from "path";
import * as taskLib from "azure-pipelines-task-lib/task";
import * as inputs from "../../../src/synopsys-task/input";
import * as fs from 'fs';
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
            Object.defineProperty(inputs, 'POLARIS_BRANCH_NAME', {value: ''})
            Object.defineProperty(inputs, 'POLARIS_ASSESSMENT_TYPES', {value: ['SCA','sast']})
            Object.defineProperty(inputs, 'POLARIS_TRIAGE', {value: ''})
            sandbox.restore();
        });

        it('should success for polaris command formation', function () {
            Object.defineProperty(inputs, 'POLARIS_SERVER_URL', {value: 'server_url'})
            Object.defineProperty(inputs, 'POLARIS_ACCESS_TOKEN', {value: 'access_token'})
            Object.defineProperty(inputs, 'POLARIS_APPLICATION_NAME', {value: 'POLARIS_APPLICATION_NAME'})
            Object.defineProperty(inputs, 'POLARIS_PROJECT_NAME', {value: 'POLARIS_PROJECT_NAME'})
            Object.defineProperty(inputs, 'POLARIS_BRANCH_NAME', {value: 'POLARIS_BRANCH_NAME'})
            Object.defineProperty(inputs, 'POLARIS_ASSESSMENT_TYPES', {value: ['SCA','sast']});
            Object.defineProperty(inputs, 'POLARIS_BRANCH_NAME', {value: 'feature1'})


            const formattedCommand = synopsysToolsParameter.getFormattedCommandForPolaris();

            const jsonString = fs.readFileSync(polarisStateFile, 'utf-8');
            const jsonData = JSON.parse(jsonString);
            expect(jsonData.data.polaris.serverUrl).to.be.contains('server_url');
            expect(jsonData.data.polaris.accesstoken).to.be.contains('access_token');
            expect(jsonData.data.polaris.application.name).to.be.contains('POLARIS_APPLICATION_NAME');
            expect(jsonData.data.polaris.branch.name).to.be.contains('feature1');

            expect(formattedCommand).contains('--stage polaris');

            polarisStateFile = '"'.concat(polarisStateFile).concat('"');
            expect(formattedCommand).contains('--input '.concat(polarisStateFile));
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
            Object.defineProperty(inputs, 'COVERITY_LOCAL', {value: false})
            Object.defineProperty(inputs, 'COVERITY_VERSION', {value: ''})
            sandbox.restore();
        });

        it('should success for coverity command formation with mandatory and optional parameters', async function () {
            Object.defineProperty(inputs, 'COVERITY_URL', {value: 'https://test.com'})
            Object.defineProperty(inputs, 'COVERITY_USER', {value: 'test-user'})
            Object.defineProperty(inputs, 'COVERITY_USER_PASSWORD', {value: 'password'})
            Object.defineProperty(inputs, 'COVERITY_PROJECT_NAME', {value: 'test'})
            Object.defineProperty(inputs, 'COVERITY_STREAM_NAME', {value: 'test'})
            Object.defineProperty(inputs, 'COVERITY_INSTALL_DIRECTORY', {value: process.cwd()})
            Object.defineProperty(inputs, 'COVERITY_POLICY_VIEW', {value: 'test'})
            Object.defineProperty(inputs, 'COVERITY_LOCAL', {value: true})
            Object.defineProperty(inputs, 'COVERITY_VERSION', {value: '2022.12.0'})

            sandbox.stub(validator, "validateCoverityInstallDirectoryParam").returns(true);
            const formattedCommand = await synopsysToolsParameter.getFormattedCommandForCoverity();

            const jsonString = fs.readFileSync(coverityStateFile, 'utf-8');
            const jsonData = JSON.parse(jsonString);
            expect(jsonData.data.coverity.connect.url).to.be.equals('https://test.com');
            expect(jsonData.data.coverity.connect.user.name).to.be.equals('test-user');
            expect(jsonData.data.coverity.connect.user.password).to.be.equals('password');
            expect(jsonData.data.coverity.connect.policy.view).to.be.equals('test');
            expect(jsonData.data.coverity.connect.stream.name).to.be.equals('test');
            expect(jsonData.data.coverity.connect.project.name).to.be.equals('test');
            expect(jsonData.data.coverity.install.directory).to.be.equals(process.cwd());        
            expect(jsonData.data.coverity.local).to.be.equals(true);
            expect(jsonData.data.coverity.version).to.be.equals('2022.12.0');
            expect(formattedCommand).contains('--stage connect');

            coverityStateFile = '"'.concat(coverityStateFile).concat('"');
            expect(formattedCommand).contains('--input '.concat(coverityStateFile));
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
            expect(formattedCommand).contains(Promise.resolve('--stage connect'));

            coverityStateFile = '"'.concat(coverityStateFile).concat('"');
            expect(formattedCommand).contains(Promise.resolve('--input '.concat(coverityStateFile)));
        });


        it('should success for coverity command formation with PR comment',  async function () {
            Object.defineProperty(inputs, 'COVERITY_URL', {value: 'https://test.com'})
            Object.defineProperty(inputs, 'COVERITY_USER', {value: 'test-user'})
            Object.defineProperty(inputs, 'COVERITY_USER_PASSWORD', {value: 'password'})
            Object.defineProperty(inputs, 'COVERITY_AUTOMATION_PRCOMMENT', {value: 'true'})
            Object.defineProperty(inputs, 'AZURE_TOKEN', {value: 'token'})
            sandbox.stub(validator, "validateCoverityInstallDirectoryParam").returns(true);
            const formattedCommand = await synopsysToolsParameter.getFormattedCommandForCoverity();
            const jsonString = fs.readFileSync(coverityStateFile, 'utf-8');
            const jsonData = JSON.parse(jsonString);
            expect(jsonData.data.coverity.connect.url).to.be.equals('https://test.com');
            expect(jsonData.data.coverity.connect.user.name).to.be.equals('test-user');
            expect(jsonData.data.coverity.connect.user.password).to.be.equals('password');
            expect(jsonData.data.coverity.automation.prcomment).to.be.equals(true)

            expect(formattedCommand).contains('--stage connect');

            coverityStateFile = '"'.concat(coverityStateFile).concat('"');
            expect(formattedCommand).contains('--input '.concat(coverityStateFile));
        });

        it('should success for coverity command formation with invalid coverity install directory', async function () {
            Object.defineProperty(inputs, 'COVERITY_URL', {value: 'https://test.com'})
            Object.defineProperty(inputs, 'COVERITY_USER', {value: 'test-user'})
            Object.defineProperty(inputs, 'COVERITY_USER_PASSWORD', {value: 'password'})
            Object.defineProperty(inputs, 'COVERITY_PROJECT_NAME', {value: 'test'})
            Object.defineProperty(inputs, 'COVERITY_STREAM_NAME', {value: 'test'})
            Object.defineProperty(inputs, 'COVERITY_INSTALL_DIRECTORY', {value: 'test-dir'})

            sandbox.stub(validator, "validateCoverityInstallDirectoryParam").returns(false);
            const formattedCommand = await synopsysToolsParameter.getFormattedCommandForCoverity();

            const jsonString = fs.readFileSync(coverityStateFile, 'utf-8');
            const jsonData = JSON.parse(jsonString);
            expect(jsonData.data.coverity.connect.url).to.be.equals('https://test.com');
            expect(jsonData.data.coverity.connect.user.name).to.be.equals('test-user');
            expect(jsonData.data.coverity.connect.user.password).to.be.equals('password');
            expect(jsonData.data.coverity.connect.stream.name).to.be.equals('test');
            expect(jsonData.data.coverity.connect.project.name).to.be.equals('test');   
            expect(formattedCommand).contains('--stage connect');

            coverityStateFile = '"'.concat(coverityStateFile).concat('"');
            expect(formattedCommand).contains('--input '.concat(coverityStateFile));
        });
    });

    context('Black Duck command preparation', () => {
        let sandbox: sinon.SinonSandbox;
        let synopsysToolsParameter: SynopsysToolsParameter;
        let blackduckStateFile: string;

        beforeEach(() => {
            sandbox = sinon.createSandbox();
            const tempDir = process.cwd();
            blackduckStateFile = path.join(tempDir, "bd_input.json");
            synopsysToolsParameter = new SynopsysToolsParameter(tempDir);
        });

        afterEach(() => {
            taskLib.rmRF(blackduckStateFile);
            Object.defineProperty(inputs, 'BLACKDUCK_URL', {value: ''})
            Object.defineProperty(inputs, 'BLACKDUCK_API_TOKEN', {value: ''})
            Object.defineProperty(inputs, 'BLACKDUCK_INSTALL_DIRECTORY', {value: ''})
            Object.defineProperty(inputs, 'BLACKDUCK_SCAN_FULL', {value: ''})
            Object.defineProperty(inputs, 'BLACKDUCK_SCAN_FAILURE_SEVERITIES', {value: ''})
            Object.defineProperty(inputs, 'BLACKDUCK_FIXPR_ENABLED', {value: ''})
            Object.defineProperty(inputs, 'BLACKDUCK_FIXPR_MAXCOUNT', {value: ''})
            Object.defineProperty(inputs, 'BLACKDUCK_FIXPR_CREATE_SINGLE_PR', {value: ''})
            Object.defineProperty(inputs, 'BLACKDUCK_FIXPR_FILTER_SEVERITIES', {value: ''})
            Object.defineProperty(inputs, 'BLACKDUCK_FIXPR_LONG_TERM_GUIDANCE', {value: ''})
            sandbox.restore();
        });

         it('should success for blackduck command formation with mandatory and some optional parameters', function () {
            Object.defineProperty(inputs, 'BLACKDUCK_URL', {value: 'https://test.com'})
            Object.defineProperty(inputs, 'BLACKDUCK_API_TOKEN', {value: 'token'})
            Object.defineProperty(inputs, 'BLACKDUCK_INSTALL_DIRECTORY', {value: 'test'})
            Object.defineProperty(inputs, 'BLACKDUCK_SCAN_FULL', {value: 'true'})
            Object.defineProperty(inputs, 'BLACKDUCK_SCAN_FAILURE_SEVERITIES', {value : ["BLOCKER","CRITICAL","TRIVIAL"]})
            
             sandbox.stub(validator, "validateBlackduckFailureSeverities").returns(true);
             const formattedCommand = synopsysToolsParameter.getFormattedCommandForBlackduck();
             const jsonString = fs.readFileSync(blackduckStateFile, 'utf-8');
             const jsonData = JSON.parse(jsonString);
             expect(jsonData.data.blackduck.url).to.be.equals('https://test.com');
             expect(jsonData.data.blackduck.token).to.be.equals('token');    
             expect(formattedCommand).contains(Promise.resolve('--stage blackduck'));

             blackduckStateFile = '"'.concat(blackduckStateFile).concat('"');
             expect(formattedCommand).contains(Promise.resolve('--input '.concat(blackduckStateFile)));
         });

         it('should success for blackduck command formation with PR COMMENT', async function () {
            Object.defineProperty(inputs, 'BLACKDUCK_URL', {value: 'https://test.com'})
            Object.defineProperty(inputs, 'BLACKDUCK_API_TOKEN', {value: 'token'})
             Object.defineProperty(inputs, 'BLACKDUCK_AUTOMATION_PRCOMMENT', {value: 'true'})
             Object.defineProperty(inputs, 'AZURE_TOKEN', {value: 'token'})

             sandbox.stub(SynopsysToolsParameter.prototype, <any>"getAzureRepoInfo");

             sandbox.stub(validator, "validateBlackduckFailureSeverities").returns(true);
             const formattedCommand = await synopsysToolsParameter.getFormattedCommandForBlackduck();
             const jsonString = fs.readFileSync(blackduckStateFile, 'utf-8');
             const jsonData = JSON.parse(jsonString);
             expect(jsonData.data.blackduck.url).to.be.equals('https://test.com');
             expect(jsonData.data.blackduck.token).to.be.equals('token');
             expect(jsonData.data.blackduck.automation.prcomment).to.be.equals(true);
             expect(formattedCommand).contains('--stage blackduck');

             blackduckStateFile = '"'.concat(blackduckStateFile).concat('"');
             expect(formattedCommand).contains('--input '.concat(blackduckStateFile));
         });

         it('should fail for invalid bridge_blackduck_scan_failure_severities', function () {
            Object.defineProperty(inputs, 'BLACKDUCK_SCAN_FAILURE_SEVERITIES', {value: ['SCA','sast123']})

            synopsysToolsParameter.getFormattedCommandForBlackduck().catch(errorObj =>{
                    expect(errorObj.message).contains('Invalid value for bridge_blackduck_scan_failure_severities')})
        });

        it('should success for blackduck command formation with fix pr true', async function () {
            Object.defineProperty(inputs, 'BLACKDUCK_URL', {value: 'https://test.com'})
            Object.defineProperty(inputs, 'BLACKDUCK_API_TOKEN', {value: 'token'})
            Object.defineProperty(inputs, 'BLACKDUCK_FIXPR_ENABLED', {value: 'true'})
            Object.defineProperty(inputs, 'AZURE_TOKEN', {value: 'token'})
            
            sandbox.stub(validator, "validateBlackduckFailureSeverities").returns(true);
            const getStubVariable = sandbox.stub(taskLib, "getVariable")

            getStubVariable.withArgs("System.TeamFoundationCollectionUri").returns("https://dev.azure.com/test-org/")
            getStubVariable.withArgs("System.TeamProject").returns("test-project")
            getStubVariable.withArgs("Build.Repository.Name").returns("test-repo")
            getStubVariable.withArgs("Build.SourceBranchName").returns("test-branch")

             const formattedCommand = await synopsysToolsParameter.getFormattedCommandForBlackduck();
             const jsonString = fs.readFileSync(blackduckStateFile, 'utf-8');
             const jsonData = JSON.parse(jsonString);
             expect(jsonData.data.blackduck.url).to.be.equals('https://test.com');
             expect(jsonData.data.blackduck.token).to.be.equals('token');     
             expect(formattedCommand).contains('--stage blackduck');

            blackduckStateFile = '"'.concat(blackduckStateFile).concat('"');
             expect(formattedCommand).contains('--input '.concat(blackduckStateFile));
         });

        it('should success for blackduck command formation with fix pr true and fix pr optional params', async function () {
            Object.defineProperty(inputs, 'BLACKDUCK_URL', {value: 'https://test.com'})
            Object.defineProperty(inputs, 'BLACKDUCK_API_TOKEN', {value: 'token'})
            Object.defineProperty(inputs, 'BLACKDUCK_FIXPR_ENABLED', {value: true})
            Object.defineProperty(inputs, 'BLACKDUCK_FIXPR_MAXCOUNT', {value: 1})
            Object.defineProperty(inputs, 'BLACKDUCK_FIXPR_CREATE_SINGLE_PR', {value: 'false'})
            Object.defineProperty(inputs, 'BLACKDUCK_FIXPR_FILTER_SEVERITIES', {value: ['CRITICAL', 'HIGH']})
            Object.defineProperty(inputs, 'BLACKDUCK_FIXPR_UPGRADE_GUIDANCE', {value: ['LONG_TERM']})
            Object.defineProperty(inputs, 'AZURE_TOKEN', {value: 'token'})

            sandbox.stub(validator, "validateBlackduckFailureSeverities").returns(true);
            const getStubVariable = sandbox.stub(taskLib, "getVariable")

            getStubVariable.withArgs("System.TeamFoundationCollectionUri").returns("https://dev.azure.com/test-org/")
            getStubVariable.withArgs("System.TeamProject").returns("test-project")
            getStubVariable.withArgs("Build.Repository.Name").returns("test-repo")
            getStubVariable.withArgs("Build.SourceBranchName").returns("test-branch")

            const formattedCommand = await synopsysToolsParameter.getFormattedCommandForBlackduck();
            const jsonString = fs.readFileSync(blackduckStateFile, 'utf-8');
            const jsonData = JSON.parse(jsonString);
            expect(jsonData.data.blackduck.url).to.be.equals('https://test.com');
            expect(jsonData.data.blackduck.token).to.be.equals('token');
            expect(jsonData.data.blackduck.fixpr.enabled).to.be.equals(true);
            expect(jsonData.data.blackduck.fixpr.maxCount).to.be.equals(1);
            expect(jsonData.data.blackduck.fixpr.createSinglePR).to.be.equals(false);
            expect(jsonData.data.blackduck.fixpr.useUpgradeGuidance).to.be.contains('LONG_TERM');
            expect(formattedCommand).contains('--stage blackduck');

            blackduckStateFile = '"'.concat(blackduckStateFile).concat('"');
            expect(formattedCommand).contains('--input '.concat(blackduckStateFile));
        });

        it('should fail for black duck fix pr true,max count and create single pr true', async function () {
            Object.defineProperty(inputs, 'BLACKDUCK_URL', {value: 'https://test.com'})
            Object.defineProperty(inputs, 'BLACKDUCK_API_TOKEN', {value: 'token'})
            Object.defineProperty(inputs, 'BLACKDUCK_FIXPR_ENABLED', {value: 'true'})
            Object.defineProperty(inputs, 'BLACKDUCK_FIXPR_MAXCOUNT', {value: 1})
            Object.defineProperty(inputs, 'BLACKDUCK_FIXPR_CREATE_SINGLE_PR', {value: 'true'})
            Object.defineProperty(inputs, 'AZURE_TOKEN', {value: 'token'})

            try {
                const formattedCommand = await synopsysToolsParameter.getFormattedCommandForBlackduck();
            } catch (e) {
                const errorObj = e as Error;
                expect(errorObj.message).contains('bridge_blackduck_fixpr_maxCount is not applicable with bridge_blackduck_fixpr_createSinglePR')
            }
        });

        it('should fail for invalid value of blackduck fix pr max count', async function () {
            Object.defineProperty(inputs, 'BLACKDUCK_URL', {value: 'https://test.com'})
            Object.defineProperty(inputs, 'BLACKDUCK_API_TOKEN', {value: 'token'})
            Object.defineProperty(inputs, 'BLACKDUCK_FIXPR_ENABLED', {value: 'true'})
            Object.defineProperty(inputs, 'BLACKDUCK_FIXPR_MAXCOUNT', {value: 'invalid-value'})

            try {
                const formattedCommand = await synopsysToolsParameter.getFormattedCommandForBlackduck();
            } catch (e) {
                const errorObj = e as Error;
                expect(errorObj.message).contains('Invalid value for bridge_blackduck_fixpr_maxCount')
            }
        });

        it('should fail for invalid azure token value with fix pr true', function () {
            Object.defineProperty(inputs, 'BLACKDUCK_URL', {value: 'https://test.com'})
            Object.defineProperty(inputs, 'BLACKDUCK_API_TOKEN', {value: 'token'})
            Object.defineProperty(inputs, 'BLACKDUCK_FIXPR_ENABLED', {value: 'true'})
            const getStubVariable = sandbox.stub(taskLib, "getVariable")
            getStubVariable.withArgs("System.AccessToken").returns("")
            try {
                const formattedCommand = synopsysToolsParameter.getFormattedCommandForBlackduck();
            } catch (e) {
                const errorObj = e as Error;
                console.log("errorObj",errorObj)
                expect(errorObj.message).equals('Missing required azure token for fix pull request/automation comment')
            }
        });

        it('should form blackduck command but with undefined azure values', async function () {
            Object.defineProperty(inputs, 'BLACKDUCK_URL', {value: 'https://test.com'})
            Object.defineProperty(inputs, 'BLACKDUCK_API_TOKEN', {value: 'token'})
            Object.defineProperty(inputs, 'BLACKDUCK_FIXPR_ENABLED', {value: 'true'})
            Object.defineProperty(inputs, 'AZURE_TOKEN', {value: 'token'})

            const getStubVariable = sandbox.stub(taskLib, "getVariable")

            getStubVariable.withArgs("Build.SourceBranchName").returns("")

            const formattedCommand = await synopsysToolsParameter.getFormattedCommandForBlackduck();
             const jsonString = fs.readFileSync(blackduckStateFile, 'utf-8');
             const jsonData = JSON.parse(jsonString);
             expect(jsonData.data.blackduck.url).to.be.equals('https://test.com');
             expect(jsonData.data.blackduck.token).to.be.equals('token');    
             expect(formattedCommand).contains('--stage blackduck');

            blackduckStateFile = '"'.concat(blackduckStateFile).concat('"');
             expect(formattedCommand).contains('--input '.concat(blackduckStateFile));
        });

        it('should success for blackduck command formation with mandatory parameters', async function () {
            Object.defineProperty(inputs, 'BLACKDUCK_URL', {value: 'https://test.com'})
            Object.defineProperty(inputs, 'BLACKDUCK_API_TOKEN', {value: 'token'})
           
            const formattedCommand = await synopsysToolsParameter.getFormattedCommandForBlackduck();
            const jsonString = fs.readFileSync(blackduckStateFile, 'utf-8');
            const jsonData = JSON.parse(jsonString);
            expect(jsonData.data.blackduck.url).to.be.equals('https://test.com');
            expect(jsonData.data.blackduck.token).to.be.equals('token');   
            expect(formattedCommand).contains('--stage blackduck');

            blackduckStateFile = '"'.concat(blackduckStateFile).concat('"');
            expect(formattedCommand).contains('--input '.concat(blackduckStateFile));
        });

        it('should success for blackduck command formation with invalid blackduck install directory', async function () {
            Object.defineProperty(inputs, 'BLACKDUCK_URL', {value: 'https://test.com'})
            Object.defineProperty(inputs, 'BLACKDUCK_API_TOKEN', {value: 'token'})
            Object.defineProperty(inputs, 'BLACKDUCK_INSTALL_DIRECTORY', {value: 'test'})
            Object.defineProperty(inputs, 'BLACKDUCK_SCAN_FULL', {value: 'false'})
            Object.defineProperty(inputs, 'BLACKDUCK_SCAN_FAILURE_SEVERITIES', {value : ["BLOCKER","CRITICAL","TRIVIAL"]})
            
            sandbox.stub(validator, "validateBlackduckFailureSeverities").returns(false);
            const formattedCommand = await synopsysToolsParameter.getFormattedCommandForBlackduck();

            const jsonString = fs.readFileSync(blackduckStateFile, 'utf-8');
            const jsonData = JSON.parse(jsonString);
            expect(jsonData.data.blackduck.url).to.be.equals('https://test.com');
            expect(jsonData.data.blackduck.token).to.be.equals('token');   
            expect(formattedCommand).contains('--stage blackduck');

            blackduckStateFile = '"'.concat(blackduckStateFile).concat('"');
            expect(formattedCommand).contains('--input '.concat(blackduckStateFile));
        });

        it('should success for blackduck command formation with sarif report create', async function () {
            Object.defineProperty(inputs, 'BLACKDUCK_URL', {value: 'https://test.com'})
            Object.defineProperty(inputs, 'BLACKDUCK_API_TOKEN', {value: 'token'})
            Object.defineProperty(inputs, 'BLACKDUCK_REPORTS_SARIF_CREATE', {value: true})

            sandbox.stub(validator, "validateBlackduckFailureSeverities").returns(true);

            const formattedCommand = await synopsysToolsParameter.getFormattedCommandForBlackduck();
            const jsonString = fs.readFileSync(blackduckStateFile, 'utf-8');
            const jsonData = JSON.parse(jsonString);
            expect(jsonData.data.blackduck.url).to.be.equals('https://test.com');
            expect(jsonData.data.blackduck.token).to.be.equals('token');
            expect(jsonData.data.reports.sarif.create).to.be.equals(true);
            expect(formattedCommand).contains('--stage blackduck');

            blackduckStateFile = '"'.concat(blackduckStateFile).concat('"');
            expect(formattedCommand).contains('--input '.concat(blackduckStateFile));
        });

        it('should success for blackduck command formation with sarif report parameters', async function () {
            Object.defineProperty(inputs, 'BLACKDUCK_URL', {value: 'https://test.com'})
            Object.defineProperty(inputs, 'BLACKDUCK_API_TOKEN', {value: 'token'})
            Object.defineProperty(inputs, 'BLACKDUCK_REPORTS_SARIF_CREATE', {value: true})
            Object.defineProperty(inputs, 'BLACKDUCK_REPORTS_SARIF_SEVERITIES', {value: ['CRITICAL','HIGH']})
            Object.defineProperty(inputs, 'BLACKDUCK_REPORTS_SARIF_FILE_PATH', {value: 'test-path'})
            Object.defineProperty(inputs, 'BLACKDUCK_REPORTS_SARIF_GROUP_SCA_ISSUES', {value: false})

            sandbox.stub(validator, "validateBlackduckFailureSeverities").returns(true);

            const formattedCommand = await synopsysToolsParameter.getFormattedCommandForBlackduck();
            console.log(formattedCommand)
            const jsonString = fs.readFileSync(blackduckStateFile, 'utf-8');
            const jsonData = JSON.parse(jsonString);
            expect(jsonData.data.blackduck.url).to.be.equals('https://test.com');
            expect(jsonData.data.blackduck.token).to.be.equals('token');
            expect(jsonData.data.reports.sarif.create).to.be.equals(true);
            expect(jsonData.data.reports.sarif.file.path).to.be.equals('test-path');
            expect(jsonData.data.reports.sarif.severities).to.be.contains('CRITICAL');
            expect(jsonData.data.reports.sarif.groupSCAIssues).to.be.equals(false);
            expect(formattedCommand).contains('--stage blackduck');

            blackduckStateFile = '"'.concat(blackduckStateFile).concat('"');
            expect(formattedCommand).contains('--input '.concat(blackduckStateFile));
        });
    });
});