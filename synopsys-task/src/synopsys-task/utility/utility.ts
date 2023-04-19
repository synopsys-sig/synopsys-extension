import * as fs from 'fs'
import * as os from 'os'
import path from 'path'
import {APPLICATION_NAME} from '../application-constants'
import * as toolLib from 'azure-pipelines-tool-lib/tool';
import * as taskLib from 'azure-pipelines-task-lib/task';
import {validateBridgeUrl} from '../validators'
var https = require('https');


export function cleanUrl(url: string): string {
  if (url && url.endsWith('/')) {
    return url.slice(0, url.length - 1)
  }
  return url
}

export async function createTempDir(): Promise<string> {
  const appPrefix = APPLICATION_NAME
  
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), appPrefix))
  console.log("tempDir::::::::::::::::::tempDir" + tempDir);

  return tempDir
}



export interface DownloadFileResponse {
  filePath: string
  fileName: string
}

export function getRemoteFile(destFilePath: string, url: string, extractedZipPath: string ): Promise<DownloadFileResponse> {
  if (url == null || url.length === 0) {
    throw new Error('URL cannot be empty')
  }

  let tempDir = destFilePath
  if (!validateBridgeUrl(url)) {
    throw new Error('Invalid URL')
  }

  try {


    let fileNameFromUrl = ''
    if (fs.lstatSync(destFilePath).isDirectory()) {
      fileNameFromUrl = url.substring(url.lastIndexOf('/') + 1)
      destFilePath = path.join(destFilePath, fileNameFromUrl || 'bridge.zip')
    }
    console.log("destfilePath:::" + destFilePath)
    const fileWriteStream = fs.createWriteStream(destFilePath);
     const downloadFileResp: DownloadFileResponse = {
            filePath: destFilePath,
            fileName: fileNameFromUrl
          }
    const toolPath = https.get(url, function(response:any) {
      response.pipe(fileWriteStream);
      console.log("Downloading.............................");
      // after download completed close filestream
      fileWriteStream.on("finish", () => {
          console.log("Download Completed");
          fileWriteStream.close();
          console.log("extractZippedFilePath::::::::::-------------" + extractedZipPath)
          extractZipped(destFilePath, extractedZipPath,tempDir)
    })
  });

    console.log("Downloading............................."+ toolPath);
    console.log("Downloading............................."+ downloadFileResp);
    return Promise.resolve(downloadFileResp)
  } catch (error) {
    throw error
  }
}

export function extractZipped(zippedfilepath: string, destinationPath: string, tempDir:string): Promise<boolean> {
  console.log('Extraction started')
  console.log('zippedfilepath:' + zippedfilepath)
  console.log('Extraction started:destinationPath' + destinationPath)
  if (zippedfilepath == null || zippedfilepath.length === 0) {
    return Promise.reject(new Error('File does not exist'))
  }

  //Extract file name from file with full path
  if (destinationPath == null || destinationPath.length === 0) {
    return Promise.reject(new Error('No destination directory found'))
  }
  console.log('Extraction started')
  try {
    toolLib.extractZip(zippedfilepath, destinationPath).then(
      (value) => {
        console.log("Success::::::::" + value); // Success!
        console.log('Extraction DONE.')
      fs.readdir(destinationPath, (err, files) => {
      files.forEach(file => {
        console.log("filesname::::::::::"+file);

        const osName: string = process.platform
        if (osName === 'darwin' || osName === 'linux') {
          try {
            console.log("bridgeExecutablePath:" + "/synopsys-bridge")
            taskLib.exec(destinationPath+"/synopsys-bridge","--help");
          } catch (errorObject) {
            throw errorObject
          }
        }
        else if (osName === 'win32') {
          try {
            console.log("bridgeExecutablePath:" + "/synopsys-bridge")
            taskLib.exec(destinationPath+"\synopsys-bridge.exe","--help");
          } catch (errorObject) {
            throw errorObject
          }
        }
      });
      cleanupTempDir(tempDir)
      try {
        fs.statSync(tempDir)
        console.log('file or directory exists');
       }
       catch (err) {
        //if (err.code === 'ENOENT') {
        console.log('file or directory does not exist');
        //}
       }
});
      },
      (reason) => {
        console.error(reason); // Error!
      },
    );
    
    return Promise.resolve(true)
  } catch (error) {
    console.log('error:'  + console.log('Extraction complete.'))
    return Promise.reject(error)
  }
}


export async function cleanupTempDir(tempDir: string): Promise<void> {
  console.log("cleaning up tempDir:" + tempDir)
  if (tempDir && fs.existsSync(tempDir)) {
    await taskLib.rmRF(tempDir)
  }
}

export function checkIfGithubHostedAndLinux(): boolean {
  return String(process.env['RUNNER_NAME']).includes('Hosted Agent') && (process.platform === 'linux' || process.platform === 'darwin')
}

export function parseToBoolean(value: string | boolean): boolean {
  if (value !== null && value !== '' && (value.toString().toLowerCase() === 'true' || value === true)) {
    return true
  }
  return false
}

