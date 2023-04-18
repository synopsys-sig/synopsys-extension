import * as path from 'path';

import * as taskLib from 'azure-pipelines-task-lib/task';
import * as toolLib from 'azure-pipelines-tool-lib/tool';
import * as fs from 'fs'
import * as os from 'os'
import {validateBridgeUrl} from '../validators'
var https = require('https');
var request = require('request');
var progress = require('request-progress');

export interface DownloadFileResponse {
  filePath: string
  fileName: string
}

export function getRemoteFile(destFilePath: string, url: string): Promise<DownloadFileResponse> {
  if (url == null || url.length === 0) {
    throw new Error('URL cannot be empty')
  }

  if (!validateBridgeUrl(url)) {
    throw new Error('Invalid URL')
  }

  try {

    let bridgePath = destFilePath;
    let fileNameFromUrl = ''
    if (fs.lstatSync(destFilePath).isDirectory()) {
      fileNameFromUrl = url.substring(url.lastIndexOf('/') + 1)
      destFilePath = path.join(destFilePath, fileNameFromUrl || 'bridge.zip')
    }
    console.log("destfilePath:::" + destFilePath)
    const file = fs.createWriteStream(destFilePath);
     const downloadFileResp: DownloadFileResponse = {
            filePath: destFilePath,
            fileName: fileNameFromUrl
          }
    const toolPath = https.get(url, function(response:any) {
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
          return Promise.resolve(downloadFileResp)
      })
    })

    console.log("Downloading............................."+ toolPath);
    console.log("Downloading............................."+ downloadFileResp);
    return Promise.resolve(downloadFileResp)
  } catch (error) {
    throw error
  }
}

export function extractZipped(file: string, destinationPath: string): Promise<boolean> {
  console.log('Extraction started')
  console.log('Extraction started:file' + file)
  console.log('Extraction started:destinationPath' + destinationPath)
  if (file == null || file.length === 0) {
    return Promise.reject(new Error('File does not exist'))
  }

  //Extract file name from file with full path
  if (destinationPath == null || destinationPath.length === 0) {
    return Promise.reject(new Error('No destination directory found'))
  }
  console.log('Extraction started')
  try {
    toolLib.extractZip(file, destinationPath)
    console.log('Extraction complete.')
    return Promise.resolve(true)
  } catch (error) {
    console.log('error:'  + console.log('Extraction complete.'))
    return Promise.reject(error)
  }
}


