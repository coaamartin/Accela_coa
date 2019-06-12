logDebug("Creating Parent License");
var contactType = "License Holder";
var licenseType = "Qualified Professional";
var addressType = "Business";
var appName = cap.getSpecialText();
var createdApp = aa.cap.createApp("Licenses", "Professional", "General", "License", appName);
if (!createdApp.getSuccess()) {
	logDebug("**ERROR creating app failed, error: " + createdApp.getErrorMessage());
}
createdApp = createdApp.getOutput();
logDebug("Creating Parent License : " + createdApp.getCustomID());
//add as parent:
var related = aa.cap.createAppHierarchy(createdApp, capId);
if (!related.getSuccess()) {
	logDebug("**ERROR createAppHierarchy failed, error: " + related.getErrorMessage());
}

//copy data:
copyContacts(capId, createdApp);
copyAppSpecific(createdApp);
updateAppStatus("Active", "Active via script", createdApp);

var contact = getContactByType(contactType, capId);

logDebug("Creating Ref LP");
vExpDate = new Date();
vNewExpDate = new Date(vExpDate.getFullYear() + 3, vExpDate.getMonth(), vExpDate.getDate());
vNewExpDate.setDate(1);
if (vNewExpDate.getMonth() == 11) {
   vNewExpDate.setMonth(0);
   vNewExpDate.setFullYear(vNewExpDate.getFullYear() + 1);
} else {
   vNewExpDate.setMonth(vNewExpDate.getMonth() + 1);
}
vNewExpDate = new Date(vNewExpDate - (24*60*60*1000));  

var licenseNbr;

if (contact) {
  var licensesByName = aa.licenseScript.getRefLicensesProfByName(aa.serviceProvider, contact.getFirstName(), contact.getMiddleName(), contact.getLastName());

  if (licensesByName.getSuccess()) {
      licensesByName = licensesByName.getOutput();
   }
  
   if (licensesByName != null && licensesByName.length > 0) {
      licenseNbr = licensesByName[0].getStateLicense();
      logDebug("Using Existing Ref LP: " + licenseNbr);
   }

   if (!licenseNbr) {
      licenseNbr = createdApp.getCustomID();
      createRefLP4Lookup(licenseNbr, licenseType, contactType, addressType);
      logDebug("Created Ref LP: " + createdApp.getCustomID());
   }
   var theRefLP = aa.licenseScript.getRefLicensesProfByLicNbr(aa.serviceProvider, licenseNbr).getOutput();

   if (theRefLP != null && theRefLP.length > 0) {
      logDebug("Updating Ref LP Expiry : " + vNewExpDate);

      theRefLP = theRefLP[0];
      aa.licenseScript.associateLpWithCap(createdApp, theRefLP);
      theRefLP.setLicenseExpirationDate(aa.date.getScriptDateTime(vNewExpDate));
      var editRefResult = aa.licenseScript.editRefLicenseProf(theRefLP);

      rB1ExpResult = aa.expiration.getLicensesByCapID(createdApp).getOutput();
      rB1ExpResult.setExpDate(aa.date.getScriptDateTime(vNewExpDate));
      rB1ExpResult.setExpStatus("Active");
      aa.expiration.editB1Expiration(rB1ExpResult.getB1Expiration());
   }
}

//*********************************************************************************************************************
var newtaskid = createdApp
var workflowResult = aa.workflow.getTasks(newtaskid);

if (workflowResult.getSuccess()) wfObj = workflowResult.getOutput();

for (i in wfObj)
{
   fTask = wfObj[i];
 //  if (ifTracer(fTask.getActiveFlag().equals("Y"), 'child is active'))
 //    fTask.setStatus("Active")
}
    
//**********************************************************************************************************************    
