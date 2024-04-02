import {expect} from "chai";
import * as utility from "../../../src/synopsys-task/utility";
import {
    extractZipped,
    getWorkSpaceDirectory,
    parseToBoolean
} from "../../../src/synopsys-task/utility";
import process from "process";
import * as sinon from "sinon";
import * as toolLib from "azure-pipelines-tool-lib";
import * as toolLibLocal from "../../../src/synopsys-task/download-tool";
import {DownloadFileResponse} from "../../../src/synopsys-task/model/download-file-response";
import * as constants from "../../../src/synopsys-task/application-constant";

describe("Utilities", () => {

    Object.defineProperty(constants, "RETRY_COUNT", {value: 3});
    Object.defineProperty(constants, "RETRY_DELAY_IN_MILLISECONDS", {value: 100});
    Object.defineProperty(constants, "NON_RETRY_HTTP_CODES", {value: new Set([200,201,401,403,416]), configurable: true});

    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    context('Clean Url', () => {
        it('Clean Url', async function () {
            const result = utility.cleanUrl("/temp/");
            expect(result).contains("/temp")
        });

        it('Clean Url - 2', async function () {
            const result = utility.cleanUrl("/temp");
            expect(result).contains("/temp")
        });
    });

    context('getTempDir', () => {
        it('getTempDir', async function () {
            process.env["AGENT_TEMPDIRECTORY"] = "/tmp"
            const result = utility.getTempDir();
            expect(result).contains("/tmp")
            process.env["AGENT_TEMPDIRECTORY"] = ""
        });

    });

    context('extractZipped', () => {

        it('extractZipped - success', async function () {
            sandbox.stub(toolLib, "extractZip").returns(Promise.resolve("/"));
            const result = await utility.extractZipped("bridge.zip", "/dest_path");
            expect(result).equals(true)
        });

        it('extractZipped - failure', async function () {
            sandbox.stub(toolLib, "extractZip").throws(new Error("invalid path"));
            await utility.extractZipped("bridge.zip", "/dest_path").catch(error => {
                expect(error.message).includes("invalid path")})
        });

        it('extractZipped - failure- file name empty', async function () {
            sandbox.stub(toolLib, "extractZip").returns(Promise.resolve("/"));
            await utility.extractZipped("", "/dest_path").catch(errorObj => {
                expect(errorObj.message).includes("File does not exist")
            })
        });

        it('extractZipped - failure- destination path empty', async function () {
            sandbox.stub(toolLib, "extractZip").returns(Promise.resolve("/"));
            await utility.extractZipped("bridge.zip", "").catch(errorObj => {
                expect(errorObj.message).includes("No destination directory found")
            })
        });
    });

    context('getWorkSpaceDirectory', () => {

        it('getWorkSpaceDirectory - success', async function () {
            process.env["BUILD_REPOSITORY_LOCALPATH"] = "/"
            const result = utility.getWorkSpaceDirectory();
            expect(result).equals("/")
            process.env["BUILD_REPOSITORY_LOCALPATH"] = ""
        });
    });

    context('getRemoteFile', async function () {

        it('getRemoteFile - success', async function () {
            const downloadFileResponse = {filePath: "/", fileName: "synopsys-bridge.zip"} as DownloadFileResponse
            sandbox.stub(toolLibLocal, "downloadTool").returns(Promise.resolve("/"));
            const result = await utility.getRemoteFile("/", "https://synopsys.com/synopsys-bridge.zip");
            expect(result.fileName).equals(downloadFileResponse.fileName)
            expect(result.filePath).equals(downloadFileResponse.filePath)
        });

        it('getRemoteFile - failure - url empty', async function () {
            await utility.getRemoteFile("/", "").catch(error => {
                expect(error.message).includes("URL cannot be empty")
            });

        });

        it('getRemoteFile - failure 401', async function () {
            sandbox.stub(toolLibLocal, "downloadTool").throws(new Error("401"))
            await utility.getRemoteFile("/", "https://synopsys.com/synopsys-bridge.zip").catch(error => {
                expect(error.message).contains("401")
            });
        });

        it('getRemoteFile - retry with 500', async function () {
            sandbox.stub(toolLibLocal, "downloadTool").throws(new Error("500"))
            await utility.getRemoteFile("/", "https://synopsys.com/synopsys-bridge.zip").catch(error => {
                expect(error.message).contains("500")
            });
        });

    });

    context('parseToBoolean', () => {

        it('parseToBoolean - true string', async function () {
            const result = utility.parseToBoolean("true");
            expect(result).equals(true)
        });

        it('parseToBoolean - true', async function () {
            const result = utility.parseToBoolean(true);
            expect(result).equals(true)
        });

        it('parseToBoolean - TRUE', async function () {
            const result = utility.parseToBoolean("TRUE");
            expect(result).equals(true)
        });

        it('parseToBoolean - false string', async function () {
            const result = utility.parseToBoolean("false");
            expect(result).equals(false)
        });

        it('parseToBoolean - false', async function () {
            const result = utility.parseToBoolean(false);
            expect(result).equals(false)
        });

        it('parseToBoolean - FALSE', async function () {
            const result = utility.parseToBoolean("FALSE");
            expect(result).equals(false)
        });
    });

    context('isBoolean', () => {

        it('should return true with string value as true', function () {
            const result = utility.isBoolean("true");
            expect(result).equals(true)
        });

        it('should return true with boolean input as true', function () {
            const result = utility.isBoolean(true);
            expect(result).equals(true)
        });

        it('should return true with string value as FALSE', function () {
            const result = utility.isBoolean("FALSE");
            expect(result).equals(true)
        });

        it('should return true with boolean input as false', function () {
            const result = utility.isBoolean(false);
            expect(result).equals(true)
        });

        it('should return false with any random string value', function () {
            const result = utility.isBoolean("test");
            expect(result).equals(false)
        });
    });

    context('getDelimitedInput', () => {

        it('should return an empty array', function () {
            const result = utility.getDelimitedInput([[], [], []]);
            expect(result).to.eql([])
        });

        it('should return an array with values', function () {
            const result = utility.getDelimitedInput([[], ['CRITICAL', 'HIGH'], []]);
            expect(result).to.eql(['CRITICAL', 'HIGH'])
        });

        it('should return an array with values with precedence', function () {
            const result = utility.getDelimitedInput([['CRITICAL', 'BLOCKER'], [], ['CRITICAL', 'HIGH']]);
            expect(result).to.eql(['CRITICAL', 'BLOCKER'])
        });
    });
});
