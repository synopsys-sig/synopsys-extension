import {expect} from "chai";
import * as utility from "../../../src/synopsys-task/utility";
import {
    checkIfPathExists,
    extractZipped,
    getWorkSpaceDirectory,
    parseToBoolean
} from "../../../src/synopsys-task/utility";
import process from "process";
import * as sinon from "sinon";
import fs from "fs";
import * as toolLib from "azure-pipelines-tool-lib";

describe("Utilities", () => {

    let sandbox: sinon.SinonSandbox;

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


    context('checkIfPathExists', () => {

        beforeEach(() => {
            sandbox = sinon.createSandbox();
        });

        afterEach(() => {
            sandbox.restore();
        });

        it('checkIfPathExists', async function () {
            sandbox.stub(fs, "existsSync").returns(true);
            const result = utility.checkIfPathExists("/");
            expect(result).equals(true)
        });
    });


    context('extractZipped', () => {

        beforeEach(() => {
            sandbox = sinon.createSandbox();
        });

        afterEach(() => {
            sandbox.restore();
        });

        it('extractZipped - success', async function () {
            sandbox.stub(toolLib, "extractZip").returns(Promise.resolve("/"));
            const result = await utility.extractZipped("bridge.zip", "/dest_path");
            expect(result).equals(true)
        });

        it('extractZipped - failure- file name empty', async function () {
            let file
            sandbox.stub(toolLib, "extractZip").returns(Promise.resolve("/"));
            await utility.extractZipped("", "/dest_path").catch(errorObj => {
                expect(errorObj.message).includes("File does not exist")
            })
        });

        it('extractZipped - failure- destination path empty', async function () {
            let file
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
            process.env["BUILD_REPOSITORY_LOCALPATH"] = undefined
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
