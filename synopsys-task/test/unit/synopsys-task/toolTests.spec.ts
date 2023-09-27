import assert = require('assert');
import path = require('path');
import fs = require('fs');
import * as tl from 'azure-pipelines-task-lib/task';
import * as toolLib from '../../../src/synopsys-task/download-tool';
import * as sinon from "sinon";
import process from "process";
import {afterEach} from "mocha";

let cachePath = path.join(process.cwd(), 'CACHE');
let tempPath = path.join(process.cwd(), 'TEMP');

describe('Tool Tests', function () {
    const fileName = "synopsys-bridge.zip"
    let sandbox: sinon.SinonSandbox;
    before(function () {
        sandbox = sinon.createSandbox();
        process.env["AGENT_TEMPDIRECTORY"] = __dirname

    });

    after(function () {
        process.env["AGENT_TEMPDIRECTORY"] = ""
        sandbox.restore();

    });

    beforeEach(function () {

        if(fs.existsSync(__dirname.concat(fileName))) {
            fs.rmSync(__dirname.concat(fileName))
        }
    })

    afterEach(function () {
        if(fs.existsSync(__dirname.concat(fileName))) {
            fs.rmSync(__dirname.concat(fileName))
        }
    })

    it('downloads a 100 byte file', function () {

        return new Promise<void>(async (resolve, reject) => {
            try {
                let downPath: string = await toolLib.downloadTool("https://httpbingo.org/bytes/100", fileName);
                toolLib.debug('downloaded path: ' + downPath);
                sandbox.stub(toolLib, "_getFileSizeOnDisk").returns(100)
                sandbox.stub(fs, "existsSync").returns(false)

                assert(tl.exist(downPath), 'downloaded file exists');
                assert.equal(fs.statSync(downPath).size, 100, 'downloaded file is the correct size');
                resolve();

            }
            catch (err) {
                reject(err);
            }
        });
    });

    it('downloads a 100 byte file after a redirect', function () {

        return new Promise<void>(async (resolve, reject) => {
            try {
                let downPath: string = await toolLib.downloadTool("https://httpbingo.org/redirect-to?url=" + encodeURI('https://httpbingo.org/bytes/100') + "&status_code=302", fileName);
                toolLib.debug('downloaded path: ' + downPath);

                assert(tl.exist(downPath), 'downloaded file exists');
                assert.equal(fs.statSync(downPath).size, 100, 'downloaded file is the correct size');

                resolve();
            }
            catch (err) {
                reject(err);
            }
        });
    });

    it('downloads to an absolute path', function () {
        this.timeout(5000);

        return new Promise<void>(async(resolve, reject)=> {
            try {
                let tempDownloadFolder: string = 'temp_' + Math.floor(Math.random() * 2000000000);
                let absolutePath: string = path.join(tempPath, tempDownloadFolder);
                let downPath: string = await toolLib.downloadTool("https://httpbingo.org/bytes/100", absolutePath);
                toolLib.debug('downloaded path: ' + downPath);
                
                assert(tl.exist(downPath), 'downloaded file exists');
                assert(absolutePath == downPath);

                resolve();
            }
            catch(err) {
                reject(err);
            }
        });
    });

    it('has status code in exception dictionary for HTTP error code responses', async function() {
        return new Promise<void>(async(resolve, reject)=> {
            try {
                let errorCodeUrl: string = "https://httpbingo.org/status/400";
                await toolLib.downloadTool(errorCodeUrl, fileName);
            } 
            catch (err: any){
                assert.equal(err.message, "400", 'status code exists');
                resolve();
            }
        });
    });

    it('works with redirect code 302', async function () {
        return new Promise<void>(async(resolve, reject)=> {
            try {
                let statusCodeUrl: string = "https://httpbingo.org/redirect-to?url=https%3A%2F%2Fexample.com%2F&status_code=302";
                let downPath: string = await toolLib.downloadTool(statusCodeUrl, fileName);
                resolve();
            } 
            catch (err){        
                reject(err);
            }
        });
    });
});
