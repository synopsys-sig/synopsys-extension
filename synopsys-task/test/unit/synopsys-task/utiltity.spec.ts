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
import {DownloadFileResponse} from "../../../src/synopsys-task/model/download-file-response";

describe("Utilities", () => {

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
            sandbox.stub(toolLib, "downloadTool").returns(Promise.resolve("/"));
            const result = await utility.getRemoteFile("/", "https://synopsys.com/synopsys-bridge.zip");
            expect(result.fileName).equals(downloadFileResponse.fileName)
            expect(result.filePath).equals(downloadFileResponse.filePath)
        });

        it('getRemoteFile - failure - url empty', async function () {
            await utility.getRemoteFile("/", "").catch(error => {
                expect(error.message).includes("URL cannot be empty")
            });

        });

        it('getRemoteFile - failure', async function () {
            sandbox.stub(toolLib, "downloadTool").throws(new Error("404"))
            await utility.getRemoteFile("/", "https://synopsys.com/synopsys-bridge.zip").catch(error => {
                expect(error).equals("Synopsys bridge download has been failed")
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
});
