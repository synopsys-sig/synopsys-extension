import * as inputs from '../../../src/synopsys-task/input';
import * as validator from '../../../src/synopsys-task/validator';
import { expect } from 'chai';
import * as mocha from 'mocha';

describe("Validator test", () => {
    context('Polaris validation', () => {
        afterEach(() => {
            Object.defineProperty(inputs, 'POLARIS_SERVER_URL', {value: ''})
            Object.defineProperty(inputs, 'POLARIS_ACCESS_TOKEN', {value: ''})
            Object.defineProperty(inputs, 'POLARIS_APPLICATION_NAME', {value: ''})
            Object.defineProperty(inputs, 'POLARIS_PROJECT_NAME', {value: ''})
            Object.defineProperty(inputs, 'POLARIS_ASSESSMENT_TYPES', {value: []})

            Object.defineProperty(inputs, 'COVERITY_URL', {value: ''})
        });

        it('should return empty array for validateScanType', function () {
            Object.defineProperty(inputs, 'POLARIS_SERVER_URL', {value: 'server_url'});
            Object.defineProperty(inputs, 'COVERITY_URL', {value: 'COVERITY_URL'})
            Object.defineProperty(inputs, 'BLACKDUCK_URL', {value: 'COVERITY_URL'})
            const validationsErrors = validator.validateScanTypes();
            expect(validationsErrors.length).equals(0);
        });

        it('should have error for no scan type provided', function () {
            const validationsErrors = validator.validateScanTypes();
            expect(validationsErrors.length).greaterThan(0);
            expect(validationsErrors[0]).contains('bridge_polaris_serverUrl');
        });

        it('should return empty array for validatePolarisInputs', function () {
            Object.defineProperty(inputs, 'POLARIS_SERVER_URL', {value: 'server_url'})
            Object.defineProperty(inputs, 'POLARIS_ACCESS_TOKEN', {value: 'access_token'})
            Object.defineProperty(inputs, 'POLARIS_APPLICATION_NAME', {value: 'POLARIS_APPLICATION_NAME'})
            Object.defineProperty(inputs, 'POLARIS_PROJECT_NAME', {value: 'POLARIS_PROJECT_NAME'})
            Object.defineProperty(inputs, 'POLARIS_ASSESSMENT_TYPES', {value: ['SCA','sast']});

            const polarisValidationErrors = validator.validatePolarisInputs();
            expect(polarisValidationErrors.length).equals(0);
        });

        it('should return mandatory fields missing error for validatePolarisInputs', function () {
            Object.defineProperty(inputs, 'POLARIS_SERVER_URL', {value: 'server_url'})

            const polarisValidationErrors = validator.validatePolarisInputs();
            expect(polarisValidationErrors.length).greaterThan(0);
            expect(polarisValidationErrors[0]).contains(['[bridge_polaris_accessToken,bridge_polaris_application_name,bridge_polaris_project_name,bridge_polaris_assessment_types] - required parameters for polaris is missing'])
        });
    });

    context('Coverity validation', () => {
        afterEach(() => {
            Object.defineProperty(inputs, 'COVERITY_URL', {value: ''})
            Object.defineProperty(inputs, 'COVERITY_USER_NAME', {value: ''})
            Object.defineProperty(inputs, 'COVERITY_USER_PASSWORD', {value: ''})
            Object.defineProperty(inputs, 'COVERITY_PROJECT_NAME', {value: ''})
            Object.defineProperty(inputs, 'COVERITY_STREAM_NAME', {value: ''})
            Object.defineProperty(inputs, 'COVERITY_INSTALL_DIRECTORY', {value: ''})
            Object.defineProperty(inputs, 'COVERITY_POLICY_VIEW', {value: ''})
        });

        it('should return empty array for validateCoverityInputs', function () {
            Object.defineProperty(inputs, 'COVERITY_URL', {value: 'https://test.com'})
            Object.defineProperty(inputs, 'COVERITY_USER', {value: 'test-user'})
            Object.defineProperty(inputs, 'COVERITY_USER_PASSWORD', {value: 'password'})
            Object.defineProperty(inputs, 'COVERITY_PROJECT_NAME', {value: 'test'})
            Object.defineProperty(inputs, 'COVERITY_STREAM_NAME', {value: 'test'})

            const polarisValidationErrors = validator.validateCoverityInputs();
            expect(polarisValidationErrors.length).equals(0);
        });

        it('should return mandatory fields missing error for validateCoverityInputs', function () {
            Object.defineProperty(inputs, 'COVERITY_URL', {value: 'https://test.com'})

            const coverityValidationErrors = validator.validateCoverityInputs();
            expect(coverityValidationErrors.length).greaterThan(0);
            expect(coverityValidationErrors[0]).contains(['[bridge_coverity_connect_user_password,bridge_coverity_connect_project_name,bridge_coverity_connect_stream_name] - required parameters for coverity is missing'])
        });

        it('should return false for invalid coverity install directory', function () {
            Object.defineProperty(inputs, 'COVERITY_URL', {value: 'https://test.com'})
            const validInstallDirectory = validator.validateCoverityInstallDirectoryParam("test-drectory");
            expect(validInstallDirectory).equals(false)
        });

        it('should return true for valid coverity install directory', function () {
            Object.defineProperty(inputs, 'COVERITY_URL', {value: 'https://test.com'})
            const validInstallDirectory = validator.validateCoverityInstallDirectoryParam(process.cwd());
            expect(validInstallDirectory).equals(true)
        });

    });
    
});