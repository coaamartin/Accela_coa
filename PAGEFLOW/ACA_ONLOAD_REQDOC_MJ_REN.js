/*------------------------------------------------------------------------------------------------------/
| Program :   
| Event   : -
|
/------------------------------------------------------------------------------------------------------*/
try
{
   var SCRIPT_VERSION = 3.0
   var cap = aa.env.getValue("CapModel");
   var capId = cap.getCapID();   
   eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
   eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));
   eval(getScriptText("COMMON_ACA_PAGEFLOW_FUNCTIONS"));
   var parent = getRenewalCapByParentCapIDForReview(capId);
   var tOwner = getAppSpecific("Type of Ownership", parent) || "";

   //remove all documents first
   removeAllRequiredDocumentCapCondition();               

   addRequiredDocument("Local - Deed or Lease");
   addRequiredDocument("Local - Diagram of Licensed Premises");
   addRequiredDocument("Local - Employee Certifications");
   addRequiredDocument("Local - Employee List");
   addRequiredDocument("Local - Floor Plan");
   addRequiredDocument("Local - Funding and Tax Documents");
   addRequiredDocument("Local - Security Plan");
   addRequiredDocument("Local - Odor Management Plan");

	if ("Corporation".equals(tOwner) || "LLC".equals(tOwner))
	{
		addRequiredDocument("Local - Bylaws");
	}
	else if ("Individual".equals(tOwner) || "Sole Proprietor".equals(tOwner))
	{
		addRequiredDocument("Local - Operating Agreement");
	}   
}
catch (err) 
{
   aa.env.setValue("ErrorMessage", err.message);
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