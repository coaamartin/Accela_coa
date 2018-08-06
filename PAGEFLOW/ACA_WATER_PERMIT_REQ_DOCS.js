/*------------------------------------------------------------------------------------------------------/
| Program : ACA_WATER_PERMIT_REQ_DOCS	
| Event   : -
|
/------------------------------------------------------------------------------------------------------*/
var SCRIPT_VERSION = 3.0
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));
eval(getScriptText("COMMON_ACA_PAGEFLOW_FUNCTIONS"));

var cap = aa.env.getValue("CapModel");
var capId = cap.getCapID();

var phased = getAppSpecific("Is this project going to be phased?");

if (phased == "Yes") {
	removeAllRequiredDocumentCapCondition();
   	addRequiredDocument("Phase Work Plan");
	
}
else{	
	aa.env.setValue("ReturnData", "{'PageFlow': {'HidePage' : 'Y'}}");
}

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
