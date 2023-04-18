import {cleanupTempDir, createTempDir} from './utility'
import {SynopsysBridge} from './synopsys-bridge'
import * as constants from './application-constants'
import * as fs from 'fs'
import * as path from 'path';
var https = require('https');
import * as os from 'os'
import * as taskLib from 'azure-pipelines-task-lib/task';
import * as toolLib from 'azure-pipelines-tool-lib/tool';

export async function run() {
  console.log('Synopsys Action started...')
  const tempDir = await createTempDir()
  let formattedCommand = ''

  try {
    
    const appPrefix = "synopsys-extension"
  
    const tempDir  = fs.mkdtemp(path.join(os.tmpdir(), appPrefix), (err, folder) => {
    if (err) throw err;
    console.log(folder);
    console.log("create temp DIR:" + folder)
    const file = fs.createWriteStream(folder +"/synopsys-bridge-0.1.244-linux64.zip");
  
   const request = https.get("https://sig-repo.synopsys.com/artifactory/bds-integrations-release/com/synopsys/integration/synopsys-bridge/0.1.244/synopsys-bridge-0.1.244-linux64.zip", function(response:any) {
      response.pipe(file);
  
      // after download completed close filestream
      file.on("finish", () => {
          file.close();
          console.log("Download Completed");
          console.log("check exists:::::::::::::********" + fs.existsSync(folder+"/synopsys-bridge-0.1.244-linux64.zip"))
  
       fs.stat(folder+"/synopsys-bridge-0.1.244-linux64.zip", (error, stats) => {
            if (error) {
              console.log(error);
            }
            else {
              console.log("Stats object for: 1");
              console.log(stats);
              // Using methods of the Stats object
              console.log("Path is file:", stats.isFile());
              console.log("Path is directory:", stats.isDirectory());
  
              const extractRoot: Promise<string> = toolLib.extractZip(folder +'/synopsys-bridge-0.1.244-linux64.zip',folder);
              console.log("extractRootextractRootextractRoot"+ extractRoot.then(value => {
                 console.log('resolved', value);
                 console.log("osName", osName);
                 taskLib.exec(value+"/synopsys-bridge","--help");
              //    fs.readdir(value, (err, files) => {
              //       files.forEach(file => {
              //         console.log("filesname::::::::::"+file);
              //         if (osName === 'darwin' || osName === 'linux' || osName === 'win32') {
              //           try {
              //              let formattedCommand = 'pwd'
              //             console.log("bridgeExecutablePath:" + "/synopsys-bridge")
              //             //taskLib.exec(value+"/synopsys-bridge","--help");
              //           } catch (errorObject) {
              //             throw errorObject
              //           }
              //         }
              //       });
              // });   
                 cleanupTempDir(value)
               }) )
               extractRoot.catch(error => {
                 console.log('rejected', error);
               });
  
  
             
              const osName: string = process.platform
              console.log("osName:::" + osName)
             
               console.log("osName:::folder" + folder)
              console.log("is DIR: " +  fs.lstatSync(folder).isDirectory())
               
                  console.log("formattedCommandformattedCommandformattedCommandformattedCommand Completed");
                  return -1
            }
      });
      });
  
  //   // 
  // });
  
  })
    return folder
    // Prints: /tmp/foo-itXde2
  });
  } catch (error) {
    throw error
  } finally {
    console.log("tempDir:"+tempDir)
    await cleanupTempDir(tempDir)
  }
 
}

// export function logBridgeExitCodes(message: string): string {
//   var exitCode = message.trim().slice(-1)
//   return constants.EXIT_CODE_MAP.has(exitCode) ? 'Exit Code: ' + exitCode + ' ' + constants.EXIT_CODE_MAP.get(exitCode) : message
// }

run().catch(error => {
  if (error.message != undefined) {
   //setFailed('Workflow failed! '.concat(logBridgeExitCodes(error.message)))
  } else {
   // setFailed('Workflow failed! '.concat(logBridgeExitCodes(error)))
  }
})

