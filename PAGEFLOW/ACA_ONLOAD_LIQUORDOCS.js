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
   var applicantType = null;
   var contactArray = cap.getContactsGroup().toArray();

   //remove all documents first
   removeAllRequiredDocumentCapCondition();

   if (appMatch("Licenses/Liquor/Liquor License/*", capId)){
	var licType = AInfo['Type of License'];
	addRequiredDocument("Application Forms");
//	addRequiredDocument("Business Operations");
//	addRequiredDocument("Premise Diagrams");
//	addRequiredDocument("Legal Entity Documents");
//	addRequiredDocument("Insurance Documents");
//	addRequiredDocument("Property Forms");
		if (AInfo['Type of License'] == 'Arts'){
			addRequiredDocument("Business Operations");
			addRequiredDocument("Premise Diagrams");
			addRequiredDocument("Legal Entity Documents");
			addRequiredDocument("Background Information");
			addRequiredDocument("Property Forms");
			addRequiredDocument("State Liquor Forms");
		}
		if (AInfo['Type of License'] == 'Beer and Wine'){
			addRequiredDocument("Business Operations");
			addRequiredDocument("Premise Diagrams");
			addRequiredDocument("State Liquor Forms");
   }
   }

   if (appMatch("Licenses/Liquor/Common Consumption/*", capId)) //|| appMatch("Licenses/Liquor/Cabaret/Application"))
   {
   addRequiredDocument("Application Forms");
   addRequiredDocument("Business Operations");
   addRequiredDocument("Premise Diagrams");
   addRequiredDocument("Legal Entity Documents");
   addRequiredDocument("Insurance Documents");
   addRequiredDocument("Property Forms");
   }
   else if (appMatch("Licenses/Liquor/Cabaret/Application", capId))
   {
   addRequiredDocument("Application Forms");
   addRequiredDocument("Business Operations");
   addRequiredDocument("Premise Diagrams");
   }

   /*var tOwner = getAppSpecific("Type of Ownership");

	if ("Corporation".equals(tOwner) || "LLC".equals(tOwner))
	{
		addRequiredDocument("Local - Articles of Incorporation");
		addRequiredDocument("Local - Bylaws");
	}
	else if ("Individual".equals(tOwner) || "Sole Proprietor".equals(tOwner) || "Partnership".equals(tOwner))
	{
		addRequiredDocument("Local - Operating Agreement");
	}*/   
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