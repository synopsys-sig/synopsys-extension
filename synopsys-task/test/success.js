"use strict";
exports.__esModule = true;
var tmrm = require("azure-pipelines-task-lib/mock-run");
var taskPath = "/Users/kirann/IdeaProjects/synopsys-extension-bduck/synopsys-task/dist/kiranindex.js";
var tmr = new tmrm.TaskMockRunner(taskPath);
tmr.setInput('samplestring', 'human');
tmr.run();
