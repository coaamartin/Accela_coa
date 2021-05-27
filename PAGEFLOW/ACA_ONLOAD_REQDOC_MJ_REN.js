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
   var useAppSpecificGroupName = false;
   eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
   eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));
   eval(getScriptText("COMMON_ACA_PAGEFLOW_FUNCTIONS"));
   var parent = getParentCapID4Renewal(capId);
   var tOwner = getAppSpecific_local("Type of Ownership", parent) || "";

   //remove all documents first
   removeAllRequiredDocumentCapCondition();               

   addRequiredDocument("Local - Deed or Lease");
   addRequiredDocument("Local - Diagram of Licensed Premises");
   //addRequiredDocument("Local - Employee Certifications");
   //addRequiredDocument("Local - Employee List");
   addRequiredDocument("Local - Floor Plan");
   //addRequiredDocument("Local - Funding and Tax Documents");
   addRequiredDocument("Local - Security Plan");
   addRequiredDocument("Local - Odor Mitigation Plan");
   addRequiredDocument("State - Business License Renewal Application");
	if ("Corporation".equals(tOwner) || "LLC".equals(tOwner))
	{
      //addRequiredDocument("Local - Articles of Incorporation");
      //addRequiredDocument("Local - Bylaws");
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

function getAppSpecific_local(itemName)  // optional: itemCap
{
   var updated = false;
   var i=0;
   var itemCap = capId;
   if (arguments.length == 2) itemCap = arguments[1]; // use cap ID specified in args
      
   if (useAppSpecificGroupName)
   {
      if (itemName.indexOf(".") < 0)
         { logDebug("**WARNING: editAppSpecific requires group name prefix when useAppSpecificGroupName is true.") ; return false }
      
      
      var itemGroup = itemName.substr(0,itemName.indexOf("."));
      var itemName = itemName.substr(itemName.indexOf(".")+1);
   }
   
    var appSpecInfoResult = aa.appSpecificInfo.getByCapID(itemCap);
   if (appSpecInfoResult.getSuccess())
   {
      var appspecObj = appSpecInfoResult.getOutput();
      
      if (itemName != "")
      {
         for (i in appspecObj)
            if( appspecObj[i].getCheckboxDesc() == itemName && (!useAppSpecificGroupName || appspecObj[i].getCheckboxType() == itemGroup) )
            {
               return appspecObj[i].getChecklistComment();
               break;
            }
      } // item name blank
   } 
   else
      { logDebug( "**ERROR: getting app specific info for Cap : " + appSpecInfoResult.getErrorMessage()) }
}

