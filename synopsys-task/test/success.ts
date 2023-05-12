import * as path from 'path';
import * as tmrm from "azure-pipelines-task-lib/mock-run";
import * as ta from "azure-pipelines-task-lib/mock-answer";


let taskPath = "/Users/kirann/IdeaProjects/synopsys-extension-bduck/synopsys-task/dist/kiranindex.js"
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tmr.setInput('samplestring', 'human');

tmr.run();