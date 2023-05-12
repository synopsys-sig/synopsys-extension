import * as path from 'path';
import * as tmrm from "azure-pipelines-task-lib/mock-run";
import * as ta from "azure-pipelines-task-lib/mock-answer";

let taskPath = path.join(__dirname, "..", "dist" , "index.js");
console.log("taskPATH::::::" + taskPath)
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tmr.setInput("samplestring", "bad");

tmr.run();
