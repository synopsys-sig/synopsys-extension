import * as path from 'path';




import {SYNOPSYS_BRIDGE_DEFAULT_PATH_LINUX, SYNOPSYS_BRIDGE_DEFAULT_PATH_MAC, SYNOPSYS_BRIDGE_DEFAULT_PATH_WINDOWS} from './application-constants'


import * as inputs from './inputs'
import {getRemoteFile} from './utility/utility'

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



  async downloadBridge(tempDir: string){
    try{
    console.log("downloadBridge:::" + tempDir)
    let bridgeUrl = ''
    let bridgeVersion = ''
    const BRIDGE_DOWNLOAD_VERSION = inputs.BRIDGE_DOWNLOAD_VERSION !== undefined ? inputs.BRIDGE_DOWNLOAD_VERSION : "";
    bridgeUrl = inputs.SYNOPSYS_BRIDGE_PATH  !== undefined ? inputs.SYNOPSYS_BRIDGE_PATH : "";
    console.log("BRIDGE_DOWNLOAD_URL:::" + bridgeUrl)
    bridgeVersion = BRIDGE_DOWNLOAD_VERSION
    getRemoteFile(tempDir, bridgeUrl,this.getBridgeDefaultPath())
   
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
