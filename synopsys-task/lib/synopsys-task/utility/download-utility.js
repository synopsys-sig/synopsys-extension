"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractZipped = exports.getRemoteFile = void 0;
const path = __importStar(require("path"));
const toolLib = __importStar(require("azure-pipelines-tool-lib/tool"));
const fs = __importStar(require("fs"));
const validators_1 = require("../validators");
var https = require('https');
var request = require('request');
var progress = require('request-progress');
function getRemoteFile(destFilePath, url) {
    if (url == null || url.length === 0) {
        throw new Error('URL cannot be empty');
    }
    if (!(0, validators_1.validateBridgeUrl)(url)) {
        throw new Error('Invalid URL');
    }
    try {
        let bridgePath = destFilePath;
        let fileNameFromUrl = '';
        if (fs.lstatSync(destFilePath).isDirectory()) {
            fileNameFromUrl = url.substring(url.lastIndexOf('/') + 1);
            destFilePath = path.join(destFilePath, fileNameFromUrl || 'bridge.zip');
        }
        console.log("destfilePath:::" + destFilePath);
        const file = fs.createWriteStream(destFilePath);
        const downloadFileResp = {
            filePath: destFilePath,
            fileName: fileNameFromUrl
        };
        const toolPath = https.get(url, function (response) {
            response.pipe(file);
            console.log("Downloading.............................");
            // after download completed close filestream
            file.on("finish", () => {
                console.log("Download Completed");
                file.close();
                console.log("Download Completed");
                // console.log("check exists:::::::::::::********" + fs.existsSync(destFilePath))
                // const extractRoot: Promise<string> = toolLib.extractZip(destFilePath,bridgePath+"/kiran");
                // console.log("extractRootextractRootextractRoot"+ extractRoot.then(value => {
                //    console.log('resolved', value);
                //    fs.readdir(value, (err, files) => {
                //       files.forEach(file => {
                //         console.log("filesname::::::::::"+file);
                //         const osName: string = process.platform
                //         if (osName === 'darwin' || osName === 'linux' || osName === 'win32') {
                //           try {
                //              let formattedCommand = 'pwd'
                //             console.log("bridgeExecutablePath:" + "/synopsys-bridge")
                //             taskLib.exec(value+"/synopsys-bridge","--help");
                //           } catch (errorObject) {
                //             throw errorObject
                //           }
                //         }
                //       });
                // });   
                //    //cleanupTempDir(value)
                //  }) )
                return Promise.resolve(downloadFileResp);
            });
        });
        console.log("Downloading............................." + toolPath);
        console.log("Downloading............................." + downloadFileResp);
        return Promise.resolve(downloadFileResp);
    }
    catch (error) {
        throw error;
    }
}
exports.getRemoteFile = getRemoteFile;
function extractZipped(file, destinationPath) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Extraction started');
        console.log('Extraction started:file' + file);
        console.log('Extraction started:destinationPath' + destinationPath);
        if (file == null || file.length === 0) {
            return Promise.reject(new Error('File does not exist'));
        }
        //Extract file name from file with full path
        if (destinationPath == null || destinationPath.length === 0) {
            return Promise.reject(new Error('No destination directory found'));
        }
        console.log('Extraction started');
        try {
            yield toolLib.extractZip(file, destinationPath);
            console.log('Extraction complete.');
            return Promise.resolve(true);
        }
        catch (error) {
            console.log('error:' + console.log('Extraction complete.'));
            return Promise.reject(error);
        }
    });
}
exports.extractZipped = extractZipped;
