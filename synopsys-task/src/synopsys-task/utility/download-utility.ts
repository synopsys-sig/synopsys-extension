import * as path from 'path';

import * as taskLib from 'azure-pipelines-task-lib/task';
import * as toolLib from 'azure-pipelines-tool-lib/tool';
import * as fs from 'fs'
import {validateBridgeUrl} from './validators'
var https = require('https');
var request = require('request');
var progress = require('request-progress');

export interface DownloadFileResponse {
  filePath: string
  fileName: string
}

export async function getRemoteFile(destFilePath: string, url: string): Promise<DownloadFileResponse> {
  if (url == null || url.length === 0) {
    throw new Error('URL cannot be empty')
  }

  // if (!validateBridgeUrl(url)) {
  //   throw new Error('Invalid URL')
  // }

  try {
    let fileNameFromUrl = ''
    if (fs.lstatSync(destFilePath).isDirectory()) {
      fileNameFromUrl = url.substring(url.lastIndexOf('/') + 1)
      destFilePath = path.join(destFilePath, fileNameFromUrl || 'bridge.zip')
    }
    console.log("destfilePath:::" + destFilePath)
    const file = fs.createWriteStream(destFilePath);
    const toolPath = await https.get("https://sig-repo.synopsys.com/artifactory/bds-integrations-release/com/synopsys/integration/synopsys-bridge/0.1.244/synopsys-bridge-0.1.244-linux64.zip", function(response:any) {
      response.pipe(fs.createWriteStream(destFilePath));
      console.log("Downloading.............................");
      // after download completed close filestream
      file.on("finish", () => {
          console.log("Download Completed");
          file.close();
          console.log("Download Completed");
          console.log("check exists:::::::::::::********" + fs.existsSync(destFilePath))

      })
    })

    console.log("Downloading............................."+ toolPath);
    const downloadFileResp: DownloadFileResponse = {
      filePath: destFilePath,
      fileName: fileNameFromUrl
    }

    return Promise.resolve(downloadFileResp)
  } catch (error) {
    throw error
  }
}

export async function extractZipped(file: string, destinationPath: string): Promise<boolean> {
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
    await toolLib.extractZip(file, destinationPath)
    console.log('Extraction complete.')
    return Promise.resolve(true)
  } catch (error) {
    console.log('error:'  + console.log('Extraction complete.'))
    return Promise.reject(error)
  }
}