/*------------------------------------------------------------------------------------------------------/
| Program : ACA_WATER_PERMIT_REQ_DOCS	
| Event   : -
|
/------------------------------------------------------------------------------------------------------*/
var SCRIPT_VERSION = 3.0
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));

//var debug;

var cap = aa.env.getValue("CapModel");
var capId = cap.getCapID();

var isTempLic = getAppSpecific("Amend Temporary Restaurant License");

//if (isTempLic == "CHECKED") {
	//Remove all docs
	removeAllRequiredDocumentCapCondition();
   	addRequiredDocument("Suhail Tetsing... ");
	
//}
//else{	
//	aa.env.setValue("ReturnData", "{'PageFlow': {'HidePage' : 'Y'}}");
//}

//aa.env.setValue("ErrorMessage", debug);


function getScriptText(vScriptName) {
   var servProvCode = aa.getServiceProviderCode();
   if (arguments.length > 1) {
      servProvCode = arguments[1]; // use different serv prov code
   }
   vScriptName = vScriptName.toUpperCase();
   var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
   try {
      var emseScript = emseBiz.getScriptByPK(servProvCode, vScriptName, "ADMIN");
      return emseScript.getScriptText() + "";
   } catch (err) {
      return "";
   }
}

function removeAllRequiredDocumentCapCondition()
{
    //delete documents
   var entityModel = aa.proxyInvoker.newInstance("com.accela.v360.document.EntityModel").getOutput();
   entityModel.setServiceProviderCode('AURORACO');
   entityModel.setEntityType("TMP_CAP");
   entityModel.setEntityID(capId);

   var documentlist = aa.document.getDocumentListByEntity(capId, 'TMP_CAP').getOutput();
   var documentBiz = aa.proxyInvoker.newInstance("com.accela.aa.ads.ads.DocumentBusiness").getOutput();

   for (var d = 0; d < documentlist.size(); d ++ )
   {
      var documentItem = documentlist.get(d);
      documentBiz.removeDocument4Partial(entityModel, 'AURORACO', documentItem.getDocumentNo());
   }
   
   //delete conditions
   var result = aa.capCondition.getCapConditions(capId);
   var condMap = {};
   var conditions = {};
   var capConds = result.getOutput();
   for(var i = 0; i < capConds.length; i ++ )
   {
      aa.capCondition.deleteCapCondition(capId, capConds[i].getConditionNumber());
   }
}

function addRequiredDocument(DocumentName)
{
    var capConditionScriptModel = aa.capCondition.getNewConditionScriptModel().getOutput();
    capConditionScriptModel.setCapID(capId)
    capConditionScriptModel.setConditionGroup("Required Document")
    capConditionScriptModel.setConditionType("Required Document")
    capConditionScriptModel.setConditionDescription(DocumentName)
    capConditionScriptModel.setImpactCode("Notice")
    capConditionScriptModel.setConditionStatus("Applied")
    capConditionScriptModel.setInheritable("N")
    capConditionScriptModel.setConditionComment(DocumentName)
    var result = aa.capCondition.createCapCondition(capConditionScriptModel);
    if (result.getSuccess())
        logDebug("Successfully add Cap Condition to: " + capId + " (Required Document) " + DocumentName );
    else
        logDebug( "**ERROR: Add Cap Condition to:" + capId + " (Required Document): " + result.getErrorMessage());
}