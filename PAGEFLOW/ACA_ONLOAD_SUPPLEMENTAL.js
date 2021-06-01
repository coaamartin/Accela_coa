/*------------------------------------------------------------------------------------------------------/
| Program :   
| Event   : Onload Pageflow Supplemental Licenses
|test
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

   if (appMatch("Licenses/Supplemental/After Hours/*", capId)){
	addRequiredDocument("Application Forms");
	addRequiredDocument("Background Information");
	addRequiredDocument("Business Operations");
	addRequiredDocument("Consent Forms");
	addRequiredDocument("Financial Documentation");
	addRequiredDocument("Legal Entity Documents");
	addRequiredDocument("Premise Diagrams");
	addRequiredDocument("Property Forms");
	}

	if (appMatch("Licenses/Supplemental/Door ID Badge/*", capId)){
	addRequiredDocument("Application Forms");
	addRequiredDocument("Background Information");
	}

   if (appMatch("Licenses/Supplemental/Massage Facility/*", capId)){
	addRequiredDocument("Application Forms");
	addRequiredDocument("Background Information");
	addRequiredDocument("Financial Documentation");
	addRequiredDocument("Legal Entity Documents");
	addRequiredDocument("Insurance Documents");
	addRequiredDocument("Property Forms");
	}

	if (appMatch("Licenses/Supplemental/Massage Solo Practitioner/*", capId)){
	addRequiredDocument("Application Forms");
	addRequiredDocument("Background Information");
	addRequiredDocument("Insurance Documents");
	addRequiredDocument("Property Forms");
	}
	
   if (appMatch("Licenses/Supplemental/Pawnbroker/*", capId)){
	addRequiredDocument("Application Forms");
	addRequiredDocument("Background Information");
	addRequiredDocument("Financial Documentation");
	addRequiredDocument("Legal Entity Documents");
	addRequiredDocument("Insurance Documents");
	addRequiredDocument("Property Forms");
	}
	
   if (appMatch("Licenses/Supplemental/Seasonal Licenses/*", capId)){
	var licType = getAppSpecific('Type of License');
	addRequiredDocument("State Liquor Forms");
		if (licType == "Fireworks Stand License"){
		addRequiredDocument("Application Forms");
		addRequiredDocument("Business Operations");
		addRequiredDocument("Insurance Documents");
		addRequiredDocument("Property Forms");
		addRequiredDocument("Premise Diagrams");
		}
		if (licType == "Christmas Tree Lot"){
		addRequiredDocument("Application Forms");
		addRequiredDocument("Business Operations");
		addRequiredDocument("Insurance Documents");
		addRequiredDocument("Premise Diagrams");
		}
		if (licType == "Carnival and Circus"){
		removeAllRequiredDocumentCapCondition();
		}
   }
   if (appMatch("Licenses/Supplemental/Second Hand Dealer/*", capId)){
	addRequiredDocument("Application Forms");
	addRequiredDocument("Background Information");
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
