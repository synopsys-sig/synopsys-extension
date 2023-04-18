"use strict";
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
exports.run = void 0;
const utility_1 = require("./synopsys-task/utility/utility");
const synopsys_bridge_1 = require("./synopsys-task/synopsys-bridge");
var https = require('https');
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Synopsys Action started...');
        const tempDir = yield (0, utility_1.createTempDir)();
        let formattedCommand = '';
        try {
            const sb = new synopsys_bridge_1.SynopsysBridge();
            console.log("download bridge");
            // Download bridge
            sb.downloadBridge(tempDir);
            // Execute bridge command
            //return //await sb.executeBridgeCommand(formattedCommand, getWorkSpaceDirectory())
        }
        catch (error) {
            throw error;
        }
        finally {
        }
    });
}
exports.run = run;
// export function logBridgeExitCodes(message: string): string {
//   var exitCode = message.trim().slice(-1)
//   return constants.EXIT_CODE_MAP.has(exitCode) ? 'Exit Code: ' + exitCode + ' ' + constants.EXIT_CODE_MAP.get(exitCode) : message
// }
run().catch(error => {
    if (error.message != undefined) {
        //setFailed('Workflow failed! '.concat(logBridgeExitCodes(error.message)))
    }
    else {
        // setFailed('Workflow failed! '.concat(logBridgeExitCodes(error)))
    }
});
