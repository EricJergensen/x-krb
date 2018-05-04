var ParameterValueDO = Java.type("edge.server.pipeline.parameter.ParameterValueDO");
var ArrayList = Java.type("java.util.ArrayList");
var ResultStatusCodeDO = Java.type("edge.server.pipeline.data.document.ResultStatusCodeDO");

var pageFeedName = "getAlertDetailsString";
var countFeedIndex = 0;
var pageFeedIndex = 1;
var alertIdPageVar = "alert_id";
var maxPageRetries = 3;

function main(sourceBundles, outputBundle, jsNodeVars, jsSecVars) {
  var javaNodeVars = jsNodeVars._asJavaCollection();
  var javaSecVars = jsSecVars._asJavaCollection();
  
  var outputData = getData(outputBundle);
  
  var AlertIDs = sourceBundles.get(countFeedIndex).getResultSet().getData();
  
  var sourceRs = sourceBundles.get(pageFeedIndex).getResultSet();
  var outputRs = outputBundle.getResultSet();
  outputRs.copyColumnMappingFrom( sourceRs );
  
  for (var i = 0; i < AlertIDs.length; i++) {
    var AlertID = AlertIDs[i].getValue("alert_ids");
    var pageNodeVars = getNodeVars(javaNodeVars, alertIdPageVar, AlertID);
    var pageSuccess = false;
    var pageResults;
    for (var trial = 1; !pageSuccess && trial <= maxPageRetries; trial++) {
      try {
      	pageResults = dataProducerService.fetch(pageFeedName, pageNodeVars, javaSecVars);
      	if (pageResults.getResultStatusCode() === ResultStatusCodeDO.CURRENT) {
          pageSuccess = true;
        }
      } catch (err) {
        if (trial === maxPageRetries) {
          throw err;
        }
      }
      if (!pageSuccess) {
        print("      error, retrying with vars: " + pageNodeVars);
      }
    }
    
    outputData.addAll(pageResults.getData());
    print("    retrieved rows:  " + pageResults.getData().size());
  }
  return outputBundle;
}

function fetchAttributeDefs(sourceProducers, nodeVar, secVar, transformName, outputBundle) {
  var outputDefs = outputBundle.getDataDef().getDataAttributes();
  
  var producer = sourceProducers.get(pageFeedIndex);
  var sourceDefs = producer.getAttributeDefs(nodeVar._asJavaCollection(), secVar._asJavaCollection());
  CloneUtil.cloneCollection(DataAttributeDO.class, outputDefs, sourceDefs);
  
  for each (var attributeDef in outputDefs) {
    attributeDef.setProducerName(transformName);
  }
}

function getNodeVars(incomingNodeVars, alertIdPageVar, AlertID) {
  var nodeVars = new ArrayList(3);
  
  nodeVars.add(new ParameterValueDO(alertIdPageVar, AlertID));
  
  for each (var nodeVar in incomingNodeVars) {
    if (nodeVar.getName() !== alertIdPageVar) {
      nodeVars.add(nodeVar);
    }
  }
  return nodeVars;
}
