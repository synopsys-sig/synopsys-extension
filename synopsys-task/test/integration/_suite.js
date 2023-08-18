"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const assert = __importStar(require("assert"));
const ttm = __importStar(require("azure-pipelines-task-lib/mock-test"));
describe("Sample task tests", function () {
    before(function () { });
    after(() => { });
    it("should succeed with polaris input", function (done) {
        this.timeout(2000);
        let tp = path.join(__dirname, "polaris-scan-success.js");
        let tr = new ttm.MockTestRunner(tp);
        tr.run();
        assert.equal(tr.succeeded, true, "should have succeeded");
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have 0 error issue");
        assert.notEqual(tr.stdout.indexOf("Synopsys Task workflow execution completed"), -1, "should have the specified log");
        done();
    });
    it("should succeed with coverity input", function (done) {
        this.timeout(2000);
        let tp = path.join(__dirname, "coverity-scan-success.js");
        let tr = new ttm.MockTestRunner(tp);
        tr.run();
        assert.equal(tr.succeeded, true, "should have succeeded");
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have 0 error issue");
        assert.notEqual(tr.stdout.indexOf("Synopsys Task workflow execution completed"), -1, "should have the specified log");
        //assert.equal(tr.stdout.indexOf("blackduckErrors"), -1, "blackduckErrors");
        done();
    });
    it("should succeed with blackduck input", function (done) {
        this.timeout(2000);
        let tp = path.join(__dirname, "blackduck-scan-success.js");
        let tr = new ttm.MockTestRunner(tp);
        tr.run();
        assert.equal(tr.succeeded, true, "should have succeeded");
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have 0 error issue");
        assert.notEqual(tr.stdout.indexOf("Synopsys Task workflow execution completed"), -1, "should have the specified log");
        //assert.equal(tr.stdout.indexOf("blackduckErrors"), -1, "blackduckErrors");
        done();
    });
    it('should fail with polaris input', function () {
        this.timeout(2000);
        let tp = path.join(__dirname, "polaris-scan-failure.js");
        let tr = new ttm.MockTestRunner(tp);
        tr.run();
        assert.equal(tr.failed, true, "should have failed");
        assert.equal(tr.errorIssues.length, 2, "should have 1 error issue");
        assert.equal(tr.errorIssues[1], "Workflow failed! Exit Code: 2 Error from adapter end");
    });
    it('should fail with coverity input', function () {
        this.timeout(2000);
        let tp = path.join(__dirname, "coverity-scan-failure.js");
        let tr = new ttm.MockTestRunner(tp);
        tr.run();
        assert.equal(tr.failed, true, "should have failed");
        assert.equal(tr.errorIssues.length, 2, "should have 1 error issue");
        assert.equal(tr.errorIssues[1], "Workflow failed! Exit Code: 2 Error from adapter end");
    });
    it('should fail with blackduck input', function () {
        this.timeout(2000);
        let tp = path.join(__dirname, "blackduck-scan-failure.js");
        let tr = new ttm.MockTestRunner(tp);
        tr.run();
        assert.equal(tr.failed, true, "should have failed");
        assert.equal(tr.errorIssues.length, 2, "should have 1 error issue");
        assert.equal(tr.errorIssues[1], "Workflow failed! Exit Code: 2 Error from adapter end");
    });
});
