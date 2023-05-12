"use strict";
exports.__esModule = true;
var tmrm = require("azure-pipelines-task-lib/mock-run");
var process = require("process");
var taskPath = "/Users/kirann/IdeaProjects/synopsys-extension-bduck/synopsys-task/dist/index.js";
var tmr = new tmrm.TaskMockRunner(taskPath);
tmr.setInput('bridge_polaris_project_name', 'http://testurl.com');
// tmr.setInput('POLARIS_ACCESS_TOKEN', 'accessTokenTest')
// tmr.setInput('POLARIS_APPLICATION_NAME', 'testapplicaiton')
// tmr.setInput('POLARIS_PROJECT_NAME','testprojectname')
// tmr.setInput('POLARIS_ASSESSMENT_TYPES', "'SCA','sast'")
process.env['AGENT_TEMPDIRECTORY'] = '/tmp';
tmr.run();
