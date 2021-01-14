/**
 * #################################################################################################
 * #
 * # Author: Andre Luiz Oneti Carvalho (andreluiz@gea.inatel.br)
 * #
 * # Description: Script to test postman collections
 * #
 * #################################################################################################
 */

const {
  writeFileSync,
  readFileSync,
  readdirSync,
  existsSync,
} = require('fs');

require('dot_functions_utils');

const BASE_PATH = "./result";
const EXECUTION_NAME = "Microsercies API Test";
const REPORT_NAME = process.env.REPORT_NAME || "Report";

var RedBar = 0;
var GreenBar = 0;
var BlackBar = 0;
var OrangeBar = 0;
var YellowBar = 0;
var CollectionNumber = 0;
var missingCollection = 0;

var RedPercent = 0;
var BlackPercent = 0;
var GreenPercent = 0;
var OrangePercent = 0;
var YellowPercent = 0;

var finalHTML = "";

var RedBarHtml = "";
var GreenBarHtml = "";
var BlackBarHtml = "";
var OrangeBarHtml = "";
var YellowBarHtml = "";

var missing = [];

const fileReader = filename => readFileSync(filename, { encoding: "utf-8" })

const files = readdirSync(BASE_PATH, { encoding: "utf-8" });
const filteredFiles = files.filter(file => file.includes(".json"));

finalHTML = fileReader('./HTMLHeader.html');
finalHTML += `\n<body><div class="container">\n<h1>${EXECUTION_NAME}</h1><br><h4><strong>Test Case results</strong></h4>`;

const { total, failed, success } = filteredFiles.reduce((prev, next) => {
  const data = fileReader(`${BASE_PATH}/${next}`);
  const JSONDATA = JSON.parse(data);
  prev.total += JSONDATA.run.stats.assertions.total;
  prev.failed += JSONDATA.run.stats.assertions.failed;
  prev.success += (JSONDATA.run.stats.assertions.total - JSONDATA.run.stats.assertions.failed);
  return prev;
}, { total: 0, failed: 0, success: 0 });

if (existsSync(`${BASE_PATH}/skipFiles.txt`)) {
  let data = fileReader(`${BASE_PATH}/skipFiles.txt`);
  data.trim().split('\n').forEach(item => {
    missing.push(item.replace(/.. FILE NAME WITH SPACE IN PATH NOT PROCESSED: .\//, ''));
  });
}

let successPercent = 0;
let failedPercent = 0;
let successSpaces = 0;
let failedSpaces = 0;

successPercent = 100 * success / total;
failedPercent = 100 - successPercent;

if (successPercent > 9) {
  successSpaces = parseInt(112 * successPercent / 100 - 2);
} else {
  successSpaces = parseInt(112 * successPercent / 100 - 1);
}

if (failedPercent > 9) {
  failedSpaces = parseInt(112 * failedPercent / 100 - 3);
} else {
  failedSpaces = parseInt(112 * failedPercent / 100 - 2);
}

successSpaces = successSpaces < 0 ? 1 : successSpaces;
failedSpaces = failedSpaces < 0 ? 1 : failedSpaces;

let scsstr = successPercent + '';
let fldstr = failedPercent + '';

if (successSpaces + scsstr.length + failedSpaces + fldstr.length > 111) {
  if (successSpaces + scsstr.length > failedSpaces + fldstr.length) {
    successSpaces -= (successSpaces + scsstr.length + failedSpaces + fldstr.length) - 111;
  } else {
    failedSpaces -= (successSpaces + scsstr.length + failedSpaces + fldstr.length) - 111;
  }
}

finalHTML += `<h4>Total Test Cases: ${total} (Passed: ${success} / Failed: ${failed})</h4>
<h4>
  <span style="font-family: monospace, monospace; margin:0; color: #ffffff; background-color: #27ae60">${"&nbsp;".repeat(successSpaces)}${successPercent}%</span><span style="font-family: monospace, monospace; margin:0; color: #ffffff; background-color: #e74c3c">${"&nbsp;".repeat(failedSpaces)}${failedPercent}%</span>
</h4>
		<br>
		<h4><strong>Collection results</strong></h4>
<h4>Total Collections: ${filteredFiles.length}</h4>
ReplaceBar
		<br>
		<h4><strong>Collection Details</strong></h4>
		<h4>Click on the headers to expand Collection details.<br>Inside each Collection click on Request to expand details.</h4>
		<h4>Collection color is based on number of passed assertions compared with total reported per collection.</h4>
		<h5>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="background-color: #27ae60"><strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong></span> 95~100% passed</h5>
		<h5>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="background-color: #ffff00"><strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong></span> <95% passed</h5>
		<h5>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="background-color: #ff9900"><strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong></span> <80% passed</h5>
		<h5>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="background-color: #e74c3c"><strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong></span> <50% passed</h5>
		<h5>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="background-color: #000000"><strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong></span> There are MissingCollection missing HTML Report. Check Missing HTML panel at end of attached report.</h5>
		<br>`;

filteredFiles.forEach((file, index) => {
  const data = fileReader(`${BASE_PATH}/${file}`);
  const JSONDATA = JSON.parse(data);
  let executionTime = JSONDATA.run.timings.completed - JSONDATA.run.timings.started;
  if (executionTime) {
    let TableNumber = index;
    let bgColor = "";
    let total = JSONDATA.run.stats.assertions.total;
    let failed = JSONDATA.run.stats.assertions.failed;
    let success = total - failed;
    success = 100 * success / total;
    if (success >= 95) {
      GreenBar++;
      bgColor = "green";
    } else if (success > 80) {
      YellowBar++;
      bgColor = "yellow";
    } else if (success > 50) {
      OrangeBar++;
      bgColor = "orange";
    } else {
      RedBar++;
      bgColor = "red";
    }

    finalHTML += `<div class="panel-group" id="collapse-request-H${CollectionNumber}P" role="tablist" aria-multiselectable="true">
  <div class="panel panel-default">
  <div class="panel-heading tego-bg-${bgColor}" role="tab" id="requestHead-H${CollectionNumber}">
  <h4 class="panel-title"><a data-toggle="collapse" data-parent="#accordion" href="#requestData-H${CollectionNumber}" aria-controls="collapseOne" aria-expanded="true"><strong>Collection : ${JSONDATA.collection.info.name}<br>[Pass Rate ${success}% / Passed ${total - failed} / Total ${total}] [Execution time ${executionTime}ms]</strong></a></h4>
  </div>
  <div id="requestData-H${CollectionNumber}" class="panel-collapse collapse" role="tabpanel" aria-labelledby="requestHead-H${CollectionNumber}" aria-expanded="true">
  <div class="panel-body">
  <div class="row">
  <div class="col-md-3">Time</div><div class="col-md-9">${JSONDATA.collection.info.name} ${(new Date(JSONDATA.run.timings.started)).toFormat("YYYY-MM-DD HR:MN:SC")}</div>
  <div class="col-md-12">&nbsp;</div>
  <div class="col-md-4">&nbsp;</div><div class="col-md-4"><strong>Total</strong></div><div class="col-md-4"><strong>Failed</strong></div>
  <div class="col-md-4">Iterations</div><div class="col-md-4">${JSONDATA.run.stats.iterations.total}</div><div class="col-md-4">${JSONDATA.run.stats.iterations.failed}</div>
  <div class="col-md-4">Requests</div><div class="col-md-4">${JSONDATA.run.stats.requests.total}</div><div class="col-md-4">${JSONDATA.run.stats.requests.failed}</div>
  <div class="col-md-4">Prerequest Scripts</div><div class="col-md-4">${JSONDATA.run.stats.prerequestScripts.total}</div><div class="col-md-4">${JSONDATA.run.stats.prerequestScripts.failed}</div>
  <div class="col-md-4">Test Scripts</div><div class="col-md-4">${JSONDATA.run.stats.testScripts.total}</div><div class="col-md-4">${JSONDATA.run.stats.testScripts.failed}</div>
  <div class="col-md-4">Assertions</div><div class="col-md-4">${JSONDATA.run.stats.assertions.total}</div><div class="col-md-4">${JSONDATA.run.stats.assertions.failed}</div>
  <div class="col-md-12">&nbsp;</div>
  <div class="col-md-3"><strong>Total Failures</strong></div><div class="col-md-6"><strong>${JSONDATA.run.stats.iterations.failed + JSONDATA.run.stats.requests.failed + JSONDATA.run.stats.prerequestScripts.failed + JSONDATA.run.stats.testScripts.failed + JSONDATA.run.stats.assertions.failed}</strong></div>
  </div>
  <br><h4>Requests</h4>
  <div class="panel-group" id="collapse-request-H'${CollectionNumber}'P'${TableNumber}'" role="tablist" aria-multiselectable="true">`;

    JSONDATA.run.executions.forEach(executed => {
      let {
        protocol,
        host,
        port,
        path
      } = executed.request.url;

      let href = `${protocol}://${host.join()}${port ? ":" : ""}${port}/${path.join("/")}`;

      finalHTML += `<div class="panel-group" id="collapse-request-H${CollectionNumber}P${TableNumber}" role="tablist" aria-multiselectable="true">
    <div class="panel panel-default">
    <div class="panel-heading tego-bg-${(executed.assertions || []).some(item => item.error) && "red" || "green"}" role="tab" id="requestHead-H${CollectionNumber}P${TableNumber}">
    <h4 class="panel-title"><a data-toggle="collapse" data-parent="#accordion" href="#requestData-H${CollectionNumber}P${TableNumber}" aria-controls="collapseOne">${executed.item.name} (Passed ${(executed.assertions || []).filter(item => !item.error).length}/Failed ${(executed.assertions || []).filter(item => item.error).length})</a></h4>
    </div>
    <div id="requestData-H${CollectionNumber}P${TableNumber}" class="panel-collapse collapse" role="tabpanel" aria-labelledby="requestHead-H${CollectionNumber}P${TableNumber}">
    <div class="panel-body">
    <div class="col-md-4">Description</div><div class="col-md-8" style="white-space: pre-wrap;"></div>
    <div class="col-md-12">&nbsp;</div>
    <div class="col-md-4">Method</div><div class="col-md-8">${executed.request.method}</div>
    <div class="col-md-4">URL</div><div class="col-md-8"><a href="${href}" target="_blank">${href}</a></div>
    <div class="col-md-12">&nbsp;</div>
    <div class="col-md-4">Mean time per request</div><div class="col-md-8">${(executed.response || {}).responseTime || "0"}ms</div><br>
    <div class="col-md-4">Mean size per request</div><div class="col-md-8">${executed.response.responseSize || JSONDATA.run.transfers.responseTotal}B</div><br>
    <div class="col-md-12">&nbsp;</div>
    <br><div class="col-md-4">Total passed tests</div><div class="col-md-8">${(executed.assertions || []).filter(item => !item.error).length}</div>
    <div class="col-md-4">Total failed tests</div><div class="col-md-8">${(executed.assertions || []).filter(item => item.error).length}</div><br>
    <div class="col-md-12">&nbsp;</div>
    <br><div class="col-md-4">Status code</div><div class="col-md-8">${(executed.response || executed.requestError || {}).code || ""}</div><br>
    <div class="col-md-12">&nbsp;</div>
    <div class="col-md-4">Tests</div>
    <div class="col-md-8">
    <table class="table table-responsive table-condensed">
    <thead><tr><th>Name</th><th>Pass count</th><th>Fail count</th></tr></thead>`;

      (executed.assertions || []).forEach(item => {
        if (item.error) finalHTML += `<tr><td>${item.assertion}</td><td>0</td><td>1</td></tr>`;
        else finalHTML += `<tr><td>${item.assertion}</td><td>1</td><td>0</td></tr>`;
      });

      finalHTML += `</tbody></table></div></div></div></div></div>`;
      TableNumber++;
    });

    CollectionNumber++;

    finalHTML += `</div></div></div></div></div>`;
  } else {
    missing.push(JSONDATA.collection.info.name);
  }
});

if (missing.length > 0) {
  missingCollection = missing.length;

  // finalHTML += `<div class="panel-group" id="collapse-request-M1" role="tablist" aria-multiselectable="true">
  // <div class="panel panel-default">
  // <div class="panel-heading tego-bg-black" role="tab" id="requestHead-M1">
  // <h4 class="panel-title"><a data-toggle="collapse" data-parent="#accordion" href="#requestData-M1" aria-controls="collapseOne" aria-expanded="false" class="collapsed"><strong>Missing Collection<br>[Missing total ${missingCollection}]</strong></a></h4>
  // </div>
  // <div id="requestData-M1" class="panel-collapse collapse" role="tabpanel" aria-labelledby="requestHead-M1" aria-expanded="false" style="height: 0px;">
  // <div class="panel-body">
  // <h4><strong>File list provided for parsing listed ${missingCollection} files that didn't generated HTML Reports for analysis.</strong></h4>
  // <h4><strong>Please check the Build.log for those requests.</strong></h4>
  // <br><h4><strong>Collections</strong></h4>`;

  finalHTML += `<div class="panel-group" id="collapse-request-M1" role="tablist" aria-multiselectable="true">
  <div class="panel panel-default">
  <div class="panel-heading tego-bg-black" role="tab" id="requestHead-M1">
  <h4 class="panel-title"><a data-toggle="collapse" data-parent="#accordion" href="#requestData-M1" aria-controls="collapseOne" aria-expanded="false" class="collapsed"><strong>Missing Collection<br>[Missing total ${missingCollection}]</strong></a></h4>
  </div>
  <div id="requestData-M1" class="panel-collapse collapse" role="tabpanel" aria-labelledby="requestHead-M1" aria-expanded="false" style="height: 0px;">
  <div class="panel-body">
  <h4><strong>File list provided for parsing listed ${missingCollection} files that didn't generated HTML Reports for analysis.</strong></h4>
  <br><h4><strong>Collections</strong></h4>`;

  missing.forEach(name => {
    BlackBar++;
    finalHTML += `<h4>${name}</h4>`;
  });

  finalHTML += `</div></div></div></div>`;

} else {
  missingCollection = 0;
}

finalHTML += `</div></div></div></div></div></body></html>`;

let MissingCollection = missing.length > 1 ? `${missing.length} Collections` : `${missing.length} Collection`;

CollectionNumber += BlackBar;

finalHTML = finalHTML.replace(/MissingCollection/, MissingCollection);

let pass = 0;

RedPercent = parseInt(100 * RedBar / CollectionNumber);
if (RedPercent < 10) pass = RedPercent + 1;
else pass = RedPercent;
RedBarHtml = `${"&nbsp;".repeat(pass)}${RedPercent}%`;

OrangePercent = parseInt(100 * OrangeBar / CollectionNumber);
if (OrangePercent < 10) pass = OrangePercent + 1;
else pass = OrangePercent;
OrangeBarHtml = `${"&nbsp;".repeat(pass)}${OrangePercent}%`;

YellowPercent = parseInt(100 * YellowBar / CollectionNumber);
if (YellowPercent < 10) pass = YellowPercent + 1;
else pass = YellowPercent;
YellowBarHtml = `${"&nbsp;".repeat(pass)}${YellowPercent}%`;

BlackPercent = parseInt(100 * BlackBar / CollectionNumber);
if (BlackPercent < 10) pass = BlackPercent + 1;
else pass = BlackPercent;
BlackBarHtml = `${"&nbsp;".repeat(pass)}${BlackPercent}%`;

GreenPercent = parseInt(100 * GreenBar / CollectionNumber);
if (missing.length > 0) {
  if (GreenPercent < 10) pass = GreenPercent + 1;
  else pass = GreenPercent - 1;
  GreenBarHtml = `${"&nbsp;".repeat(pass)}${GreenPercent}%`;
} else {
  if (GreenPercent < 10) pass = GreenPercent + 1;
  else pass = GreenPercent;
  GreenBarHtml = `${"&nbsp;".repeat(pass)}${GreenPercent}%`;
}

let Bar = "";
if (missing.length > 0) {
  Bar = `<h4><span style="font-family: monospace, monospace; margin:0; color: #ffffff; background-color: #000000">${BlackBarHtml}</span><span style="font-family: monospace, monospace; margin:0; color: #ffffff; background-color: #e74c3c">${RedBarHtml}</span><span style="font-family: monospace, monospace; margin:0; color: #ffffff; background-color: #ff9900">${OrangeBarHtml}</span><span style="font-family: monospace, monospace; margin:0; color: #000000; background-color: #ffff00">${YellowBarHtml}</span><span style="font-family: monospace, monospace; margin:0; color: #ffffff; background-color: #27ae60">${GreenBarHtml}</span></h4>`;
} else {
  Bar = `<h4><span style="font-family: monospace, monospace; margin:0; color: #ffffff; background-color: #e74c3c">${RedBarHtml}</span><span style="font-family: monospace, monospace; margin:0; color: #ffffff; background-color: #ff9900">${OrangeBarHtml}</span><span style="font-family: monospace, monospace; margin:0; color: #000000; background-color: #ffff00">${YellowBarHtml}</span><span style="font-family: monospace, monospace; margin:0; color: #ffffff; background-color: #27ae60">${GreenBarHtml}</span></h4>`;
}
finalHTML = finalHTML.replace(/ReplaceBar/, Bar);

writeFileSync(`./${REPORT_NAME}.html`, finalHTML, { encoding: "utf-8" });
