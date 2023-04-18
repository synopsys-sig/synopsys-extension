import * as path from 'path';

import * as taskLib from 'azure-pipelines-task-lib/task';
import * as azdev from "azure-devops-node-api";
import * as toolLib from 'azure-pipelines-tool-lib/tool';

import {BRIDGE_DOWNLOAD_URL, SYNOPSYS_BRIDGE_PATH} from './inputs'

import {SYNOPSYS_BRIDGE_DEFAULT_PATH_LINUX, SYNOPSYS_BRIDGE_DEFAULT_PATH_MAC, SYNOPSYS_BRIDGE_DEFAULT_PATH_WINDOWS} from './application-constants'

import {cleanupTempDir} from './utility/utility'
import * as inputs from './inputs'
import {DownloadFileResponse, extractZipped, getRemoteFile} from './utility/download-utility'
import {SynopsysToolsParameter} from './tools-parameter'
import fs from 'fs'

import {validateBlackDuckInputs, validateCoverityInputs, validatePolarisInputs, validateScanTypes} from './validators'
import * as constants from './application-constants'
import {HttpClient} from 'typed-rest-client/HttpClient'
import DomParser from 'dom-parser'


export class SynopsysBridge {
  bridgeExecutablePath: string
  bridgeArtifactoryURL: string
  bridgeUrlPattern: string
  WINDOWS_PLATFORM = 'win64'
  LINUX_PLATFORM = 'linux64'
  MAC_PLATFORM = 'macosx'

  constructor() {
    this.bridgeExecutablePath = ''
    this.bridgeArtifactoryURL = 'https://sig-repo.synopsys.com/artifactory/bds-integrations-release/com/synopsys/integration/synopsys-bridge/'
    this.bridgeUrlPattern = this.bridgeArtifactoryURL.concat('/$version/synopsys-bridge-$version-$platform.zip ')
  }

  private getBridgeDefaultPath(): string {
    let bridgeDefaultPath = ''
    const osName = process.platform

    if (osName === 'darwin') {
      bridgeDefaultPath = path.join(process.env['HOME'] as string, SYNOPSYS_BRIDGE_DEFAULT_PATH_MAC)
    } else if (osName === 'linux') {
      bridgeDefaultPath = path.join(process.env['HOME'] as string, SYNOPSYS_BRIDGE_DEFAULT_PATH_LINUX)
    } else if (osName === 'win32') {
      bridgeDefaultPath = path.join(process.env['USERPROFILE'] as string, SYNOPSYS_BRIDGE_DEFAULT_PATH_WINDOWS)
    }

    return bridgeDefaultPath
  }


async prepareCommand(tempDir: string): Promise<string> {
    try {
      let formattedCommand = ''
      const invalidParams: string[] = validateScanTypes()
      const polarisCommandFormatter = new SynopsysToolsParameter(tempDir)
      formattedCommand = formattedCommand.concat(polarisCommandFormatter.getFormattedCommandForPolaris())
      
      // if (invalidParams.length === 3) {
      //   return Promise.reject(new Error('Requires at least one scan type: ('.concat(constants.POLARIS_SERVER_URL_KEY).concat(',').concat(constants.COVERITY_URL_KEY).concat(',').concat(constants.BLACKDUCK_URL_KEY).concat(')')))
      // }
      // // validating and preparing command for polaris
      // const polarisErrors: string[] = validatePolarisInputs()
      // if (polarisErrors.length === 0 && inputs.POLARIS_SERVER_URL) {
      //   const polarisCommandFormatter = new SynopsysToolsParameter(tempDir)
      //   formattedCommand = formattedCommand.concat(polarisCommandFormatter.getFormattedCommandForPolaris())
      // }

      // // validating and preparing command for coverity
      // const coverityErrors: string[] = validateCoverityInputs()
      // if (coverityErrors.length === 0 && inputs.COVERITY_URL) {
      //   const coverityCommandFormatter = new SynopsysToolsParameter(tempDir)
      //   formattedCommand = formattedCommand.concat(coverityCommandFormatter.getFormattedCommandForCoverity())
      // }

      // // validating and preparing command for blackduck
      // const blackduckErrors: string[] = validateBlackDuckInputs()
      // if (blackduckErrors.length === 0 && inputs.BLACKDUCK_URL) {
      //   const blackDuckCommandFormatter = new SynopsysToolsParameter(tempDir)
      //   formattedCommand = formattedCommand.concat(blackDuckCommandFormatter.getFormattedCommandForBlackduck())
      // }

      // let validationErrors: string[] = []
      // validationErrors = validationErrors.concat(polarisErrors)
      // validationErrors = validationErrors.concat(coverityErrors)
      // validationErrors = validationErrors.concat(blackduckErrors)
      // if (formattedCommand.length === 0) {
      //   return Promise.reject(new Error(validationErrors.join(',')))
      // }
      // if (validationErrors.length > 0) {
      //   console.log(new Error(validationErrors.join(',')))
      // }

      console.log('Formatted command is - '.concat(formattedCommand))
      return formattedCommand
    } catch (e) {
      const errorObject = e as Error
     // await cleanupTempDir(tempDir)
      console.log(errorObject.stack === undefined ? '' : errorObject.stack.toString())
      return Promise.reject(errorObject.message)
    }
  }

  async downloadBridge(tempDir: string){
    try{
    console.log("downloadBridge:::" + tempDir)
    console.log("downloadBridge:::New" + tempDir)
    let bridgeUrl = ''
    let bridgeVersion = ''
    const BRIDGE_DOWNLOAD_VERSION = inputs.BRIDGE_DOWNLOAD_VERSION !== undefined ? inputs.BRIDGE_DOWNLOAD_VERSION : "";
    bridgeUrl = inputs.SYNOPSYS_BRIDGE_PATH  !== undefined ? inputs.SYNOPSYS_BRIDGE_PATH : "";
    console.log("BRIDGE_DOWNLOAD_URL:::" + bridgeUrl)
    bridgeVersion = BRIDGE_DOWNLOAD_VERSION
    const downloadResponse: DownloadFileResponse = await getRemoteFile(tempDir, bridgeUrl)
    console.log("downloadResponse.fileName" + downloadResponse.fileName)
    console.log("downloadResponse.filePath" + downloadResponse.filePath)
   


    const extractZippedFilePath: string = inputs.SYNOPSYS_BRIDGE_PATH || this.getBridgeDefaultPath()
    console.log("extractZippedFilePath::::::::::---------------stat-" + extractZippedFilePath)
    await extractZipped(downloadResponse.filePath, extractZippedFilePath)
  }
    catch(error){
      console.log("error:"+error)
    } 
  }



  getVersionUrl(version: string): string {
    const osName = process.platform

    let bridgeDownloadUrl = this.bridgeUrlPattern.replace('$version', version)
    bridgeDownloadUrl = bridgeDownloadUrl.replace('$version', version)
    if (osName === 'darwin') {
      bridgeDownloadUrl = bridgeDownloadUrl.replace('$platform', this.MAC_PLATFORM)
    } else if (osName === 'linux') {
      bridgeDownloadUrl = bridgeDownloadUrl.replace('$platform', this.LINUX_PLATFORM)
    } else if (osName === 'win32') {
      bridgeDownloadUrl = bridgeDownloadUrl.replace('$platform', this.WINDOWS_PLATFORM)
    }

    return bridgeDownloadUrl
  }
}
