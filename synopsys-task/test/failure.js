"use strict";
exports.__esModule = true;
var path = require("path");
var tmrm = require("azure-pipelines-task-lib/mock-run");
var taskPath = path.join(__dirname, "..", "dist", "index.js");
console.log("taskPATH::::::" + taskPath);
var tmr = new tmrm.TaskMockRunner(taskPath);
tmr.setInput("samplestring", "bad");
tmr.run();
