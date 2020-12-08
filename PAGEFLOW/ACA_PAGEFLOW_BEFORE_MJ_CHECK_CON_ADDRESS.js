/*------------------------------------------------------------------------------------------------------/
| Program :   ACA_PAGEFLOW_BEFORE_MJ_CHECK_CON_ADDRESS 
| Event   : aca page before
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
   var cancel = false;
   var msg = "";
   var br = "<br>"
   var contactList = cap.getContactsGroup();
   var contactListSize = contactList.size();
		
		for (var i = 0; i < contactListSize; i++){
			var contactType = contactList.get(i).getPeople().getContactType()
			//msg+=contactType + br;
			var contactAddressObj = contactList.get(i).getPeople().getContactAddressList();
			if(contactAddressObj!=null){
				//todo
			}else{
				msg+=contactType + br;
				cancel = true;
			}
			
		}
		
	if(cancel){
				
		showMessage = true;
		aa.env.setValue("ErrorMessage","Address is missing for: " +br+ msg +br + "Please enter an address before proceeding" );
		
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