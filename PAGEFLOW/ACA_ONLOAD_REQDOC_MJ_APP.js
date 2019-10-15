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
               
   addRequiredDocument("Local - Affirmation and Consent Form");
   addRequiredDocument("Local - Applicant Request to Release Information Form");
   addRequiredDocument("Local - Deed or Lease");
   addRequiredDocument("Local - Certifwicate of Good Standing from the Sec. of State");
   addRequiredDocument("Local - Diagram of Licensed Premises");
   addRequiredDocument("Local - Funding and Tax Documents");
   addRequiredDocument("Local - Investigation Authorization and Release Form");
   addRequiredDocument("Local - Floor Plan");
   addRequiredDocument("Local - Odor Mitigation Plan");
   addRequiredDocument("Local - Security Plan");
   addRequiredDocument("Local - Site Plan");
   addRequiredDocument("Local - Written Consent from Landlord Allowing MJ Ops");
   addRequiredDocument("Local - Copies of CO Badges for each owner");

   if (!appMatch("Licenses/Marijuana/Retail Store/Application", capId))
   {
      addRequiredDocument("Local - State Associated Key License Application Form");
   }

   if (appMatch("Licenses/Marijuana/Retail Cultivation/Application", capId)|| appMatch("Licenses/Marijuana/Retail Product Manufacturer/Application", capId))
   {
      addRequiredDocument("Local - Mold Prevention Methods");
      addRequiredDocument("Local - Standard Operating Procedures");
   }
   else if (appMatch("Licenses/Marijuana/Retail Store/Application", capId))
   {
      addRequiredDocument("Local - Proof of $400,000 in Liquid Assets");
      addRequiredDocument("Local - Business Plan");
      addRequiredDocument("Local - Proof of Experience");
      addRequiredDocument("Local - Operating Plan");
   }

   var tOwner = getAppSpecific("Type of Ownership");

	if ("Corporation".equals(tOwner) || "LLC".equals(tOwner))
	{
		addRequiredDocument("Local - Articles of Incorporation");
		addRequiredDocument("Local - Bylaws");
	}
	else if ("Individual".equals(tOwner) || "Sole Proprietor".equals(tOwner) || "Partnership".equals(tOwner))
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