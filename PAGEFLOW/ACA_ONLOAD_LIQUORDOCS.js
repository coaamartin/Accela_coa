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

   if (appMatch("Licenses/Liquor/Liquor License/Application", capId)){
	var appType = getAppSpecific('Type of Application');
	var licType = getAppSpecific('Type of Change');
	addRequiredDocument("State Liquor Forms");
		if (licType == "Addition of Optional Premise"){
		addRequiredDocument("Premise Diagrams");
		addRequiredDocument("Property Forms");
		}
		if (licType == "Change of Location"){
		addRequiredDocument("Business Operations");
		addRequiredDocument("Premise Diagrams");
		addRequiredDocument("Property Forms");
		}
		if (licType == "Change of Ownership Structure"){
		addRequiredDocument("Background Information");
		addRequiredDocument("Business Operations");
		addRequiredDocument("Consent Forms");
		addRequiredDocument("Financial Documentation");
		addRequiredDocument("Legal Entity Documents");
		}
		if (licType == "Modification of Premise"){
		addRequiredDocument("Premise Diagrams");
		addRequiredDocument("Property Forms");
		}
		if (licType == "Name Change"){
		addRequiredDocument("Legal Entity Documents");
		}
		if (licType == "Registered Manager"){
		addRequiredDocument("Background Information");
		}
		if (licType == "Sidewalk Service"){
		addRequiredDocument("Business Operations");
		addRequiredDocument("Premise Diagrams");
		}
		if (licType == "Storage Permit"){
		addRequiredDocument("Premise Diagrams");
		addRequiredDocument("Property Forms");
		}
		if (appType == "Transfer") {
			addRequiredDocument("Background Information");
			addRequiredDocument("Business Operations");
			addRequiredDocument("Consent Forms");
			addRequiredDocument("Financial Documentation");
			addRequiredDocument("Premise Diagrams");
			addRequiredDocument("Legal Entity Documents");
			addRequiredDocument("Property Forms");
		}
		if (appType == "New Application") {
			addRequiredDocument("Background Information");
			addRequiredDocument("Business Operations");
			addRequiredDocument("Consent Forms");
			addRequiredDocument("Financial Documentation");
			addRequiredDocument("Premise Diagrams");
			addRequiredDocument("Legal Entity Documents");
			addRequiredDocument("Property Forms");
		}
   }
   if (appMatch("Licenses/Liquor/Liquor License/Renewal", capId)){
//	var licType = getAppSpecific('Type of License');
	addRequiredDocument("Background Information");
	addRequiredDocument("Business Operations");
	addRequiredDocument("Consent Forms");
	addRequiredDocument("Financial Documentation");
	addRequiredDocument("Premise Diagrams");
	addRequiredDocument("Legal Entity Documents");
	addRequiredDocument("State Liquor Forms");
	addRequiredDocument("Property Forms");
   }
   if (appMatch("Licenses/Liquor/Liquor License/Amendment", capId)){
	var licType = getAppSpecific('Type of Change');
	addRequiredDocument("State Liquor Forms");
		if (licType == "Addition of Opotional Premise"){
		addRequiredDocument("Premise Diagrams");
		addRequiredDocument("Property Forms");
		}
		if (licType == "Change of Location"){
		addRequiredDocument("Business Operations");
		addRequiredDocument("Premise Diagrams");
		addRequiredDocument("Property Forms");
		}
		if (licType == "Change of Ownership Structure"){
		addRequiredDocument("Background Information");
		addRequiredDocument("Business Operations");
		addRequiredDocument("Consent Forms");
		addRequiredDocument("Financial Documentation");
		addRequiredDocument("Legal Entity Documents");
		}
		if (licType == "Modification of Premise"){
		addRequiredDocument("Premise Diagrams");
		addRequiredDocument("Property Forms");
		}
		if (licType == "Name Change"){
		addRequiredDocument("Legal Entity Documents");
		}
		if (licType == "Registered Manager"){
		addRequiredDocument("Background Information");
		}
		if (licType == "Sidewalk Service"){
		addRequiredDocument("Business Operations");
		addRequiredDocument("Premise Diagrams");
		}
		if (licType == "Storage Permit"){
		addRequiredDocument("Premise Diagrams");
		addRequiredDocument("Property Forms");
		}
   }

   if (appMatch("Licenses/Liquor/Common Consumption/*", capId)){
   addRequiredDocument("Application Forms");
   addRequiredDocument("Business Operations");
   addRequiredDocument("Premise Diagrams");
   addRequiredDocument("Legal Entity Documents");
   addRequiredDocument("Insurance Documents");
   addRequiredDocument("Property Forms");
   }
   if (appMatch("Licenses/Liquor/Cabaret/*", capId)){
   addRequiredDocument("Application Forms");
   addRequiredDocument("Business Operations");
   addRequiredDocument("Premise Diagrams");
   }
//   if (appMatch("Licenses/Liquor/Tasting Permit/Permit", capId)){
//   addRequiredDocument("Application Forms");
//   }
   if (appMatch("Licenses/Liquor/Tasting License/*", capId)){
   addRequiredDocument("Application Forms");
   }
   if (appMatch("Licenses/Liquor/Liquor Permit/*", capId)){
   addRequiredDocument("Application Forms");
   addRequiredDocument("Business Operations");
   addRequiredDocument("Premise Diagrams");
   addRequiredDocument("Legal Entity Documents");
   addRequiredDocument("Property Forms");
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