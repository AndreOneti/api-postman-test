
/**
 *
 * @param {Array} assertions
 * @returns {string}
 */
function createTable(assertions) {

  const table = `<table class="table table-responsive table-condensed">
  <thead>
    <tr>
      <th>Name</th>
      <th>Pass count</th>
      <th>Fail count</th>
    </tr>
  </thead>
  <tbody>
    ${assertions
      .map(item => {
        if (item.error) {
          return `<tr>
      <td>${item.assertion}</td>
      <td>0</td>
      <td>1</td>
    </tr>
    <tr>
      <td></td>
      <td colspan="2">${item.error.name}: ${item.error.message}</td>
    </tr>`;
        } else {
          return `<tr>
      <td>${item.assertion}</td>
      <td>1</td>
      <td>0</td>
    </tr>`;
        }
      }).join("\n    ")}
  </tbody>
</table>`;
  return table;
}

/**
 *
 * @param {*} executed
 * @param {number} CollectionNumber
 * @param {number} TableNumber
 * @returns {string}
 */
function createPanelItem(executed, CollectionNumber, TableNumber) {
  const { protocol, host, port, path, } = executed.request.url;
  const href = `${protocol}://${host.join()}${port ? ":" : ""}${port}/${path.join("/")}`;
  return `<div class="panel-group" id="collapse-request-H${CollectionNumber}P${TableNumber}" role="tablist" aria-multiselectable="true">
  <div class="panel panel-default">
    <div class="panel-heading tego-bg-${(executed.assertions || []).some(item => item.error) && 'red' || 'green'}" role="tab" id="requestHead-H${CollectionNumber}P${TableNumber}">
      <h4 class="panel-title">
        <a data-toggle="collapse" data-parent="#accordion" href="#requestData-H${CollectionNumber}P${TableNumber}" aria-controls="collapseOne">${executed.item.name} (Passed ${(executed.assertions || []).filter(item => !item.error).length}/Failed ${(executed.assertions || []).filter(item => item.error).length})</a>
      </h4>
    </div>
    <div id="requestData-H${CollectionNumber}P${TableNumber}" class="panel-collapse collapse" role="tabpanel" aria-labelledby="requestHead-H${CollectionNumber}P${TableNumber}">
      <div class="panel-body">
        <div class="col-md-4">Description</div>
        <div class="col-md-8" style="white-space: pre-wrap;"></div>
        <div class="col-md-12">&nbsp;</div>
        <div class="col-md-4">Method</div>
        <div class="col-md-8">${executed.request.method}</div>
        <div class="col-md-4">URL</div>
        <div class="col-md-8"><a href="${href}" target="_blank">${href}</a></div>
        <div class="col-md-12">&nbsp;</div>
        <div class="col-md-4">Mean time per request</div>
        <div class="col-md-8">${(executed.response || {}).responseTime || "0"}ms</div><br>
        <div class="col-md-4">Mean size per request</div>
        <div class="col-md-8">${executed.response.responseSize || JSONDATA.run.transfers.responseTotal}B</div><br>
        <div class="col-md-12">&nbsp;</div><br>
        <div class="col-md-4">Total passed tests</div>
        <div class="col-md-8">${(executed.assertions || []).filter(item => !item.error).length}</div>
        <div class="col-md-4">Total failed tests</div>
        <div class="col-md-8">${(executed.assertions || []).filter(item => item.error).length}</div><br>
        <div class="col-md-12">&nbsp;</div><br>
        <div class="col-md-4">Status code</div>
        <div class="col-md-8">${(executed.response || executed.requestError || {}).code || ""}</div><br>
        <div class="col-md-12">&nbsp;</div>
        <div class="col-md-4">Tests</div>
        <div class="col-md-8">
          ${createTable(executed.assertions || [])}
        </div>
      </div>
    </div>
  </div>
</div>`;
}

module.exports = {
  createTable,
  createPanelItem
};
