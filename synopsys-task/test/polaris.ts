import * as tmrm from "azure-pipelines-task-lib/mock-run";
import * as ta from "azure-pipelines-task-lib/mock-answer";
import * as process from 'process';
import * as path from 'path';


let taskPath = path.join(__dirname, "..", "dist" , "index.js");
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tmr.setInput('bridge_polaris_project_name', 'http://testurl.com')
// tmr.setInput('POLARIS_ACCESS_TOKEN', 'accessTokenTest')
// tmr.setInput('POLARIS_APPLICATION_NAME', 'testapplicaiton')
// tmr.setInput('POLARIS_PROJECT_NAME','testprojectname')
// tmr.setInput('POLARIS_ASSESSMENT_TYPES', "'SCA','sast'")

process.env['AGENT_TEMPDIRECTORY'] = '/tmp';

tmr.run();