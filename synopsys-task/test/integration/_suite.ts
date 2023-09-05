import * as path from "path";
import * as assert from "assert";
import * as ttm from "azure-pipelines-task-lib/mock-test";

describe("Synopsys task tests", function () {
  before(function () {});

  after(() => {});

  it("should succeed with polaris input", function (done: Mocha.Done) {
    this.timeout(2000);

    let tp = path.join(__dirname, "polaris-scan-success.js");
    let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

    tr.run();
    assert.equal(tr.succeeded, true, "should have succeeded");
    assert.equal(tr.warningIssues.length, 0, "should have no warnings");
    assert.equal(tr.errorIssues.length, 0, "should have 0 error issue");
    assert.notEqual(tr.stdout.indexOf("Synopsys Task workflow execution completed"), -1, "should have the specified log")

    done();
  });

  it("should succeed with coverity input", function (done: Mocha.Done) {
    this.timeout(2000);

    let tp = path.join(__dirname, "coverity-scan-success.js");
    let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

    tr.run();
    assert.equal(tr.succeeded, true, "should have succeeded");
    assert.equal(tr.warningIssues.length, 0, "should have no warnings");
    assert.equal(tr.errorIssues.length, 0, "should have 0 error issue");
    assert.notEqual(tr.stdout.indexOf("Synopsys Task workflow execution completed"), -1, "should have the specified log");
    //assert.equal(tr.stdout.indexOf("blackduckErrors"), -1, "blackduckErrors");
    done();
  });

  it("should succeed with blackduck input", function (done: Mocha.Done) {
    this.timeout(2000);

    let tp = path.join(__dirname, "blackduck-scan-success.js");
    let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

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
    let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

    tr.run();

    assert.equal(tr.failed, true, "should have failed")
    assert.equal(tr.errorIssues.length, 2, "should have 1 error issue");
    assert.equal(tr.errorIssues[1], "Workflow failed! Exit Code: 2 Error from adapter end");
  });

  it('should fail with coverity input', function () {
    this.timeout(2000);

    let tp = path.join(__dirname, "coverity-scan-failure.js");
    let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

    tr.run();

    assert.equal(tr.failed, true, "should have failed")
    assert.equal(tr.errorIssues.length, 2, "should have 1 error issue");
    assert.equal(tr.errorIssues[1], "Workflow failed! Exit Code: 2 Error from adapter end");
  });

  it('should fail with blackduck input', function () {
    this.timeout(2000);

    let tp = path.join(__dirname, "blackduck-scan-failure.js");
    let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

    tr.run();

    assert.equal(tr.failed, true, "should have failed")
    assert.equal(tr.errorIssues.length, 2, "should have 1 error issue");
    assert.equal(tr.errorIssues[1], "Workflow failed! Exit Code: 2 Error from adapter end");
  });

});