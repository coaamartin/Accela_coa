/*
When any fees are Invoiced in the Fee Tab, it needs to email the applicant and the contractor that fees are owed and they can click the link to go online to login to their account to view and pay their fees. 

Written by JMAIN
*/

if (balanceDue > 0)
{
  //email the applicant
  var contact = "Applicant"; //Cont
  var template = "BLD_INVOICEDFEES";
  var emailparams = aa.util.newHashtable();
  //emailparams.put("$$invoideFees$$", feesString);
  emailContacts1(contact, template, emailparams, "", "", "N", "");
}


function emailContacts1(sendEmailToContactTypes, emailTemplate, vEParams, reportTemplate, vRParams) {
  var vChangeReportName = "";
  var conTypeArray = [];
  var x = 0;
  var vConType;
  var vAsyncScript = "SEND_EMAIL_TO_CONTACTS_ASYNC";
  var envParameters = aa.util.newHashMap();
  var vAddAdHocTask = true;

  //Ad-hoc Task Requested
  if (arguments.length > 5) {
    vAddAdHocTask = arguments[5]; // use provided prefrence for adding an ad-hoc task for manual notification
    if (vAddAdHocTask == "N") {
  logDebug("No adhoc task");      
      vAddAdHocTask = false;
    }
  }
  
  //Change Report Name Requested
  if (arguments.length > 6) {
    vChangeReportName = arguments[6]; // use provided report name
  }

logDebug("Provided contact types to send to: " + sendEmailToContactTypes);
  
  //Check to see if provided contact type(s) is/are valid
  if (sendEmailToContactTypes != "All" && sendEmailToContactTypes != null && sendEmailToContactTypes != '') {
    conTypeArray = sendEmailToContactTypes.split(",");
  }
  for (x in conTypeArray) {
    //check all that are not "Primary"
    vConType = conTypeArray[x];
  
  }
  //Check if any types remain. If not, don't continue processing
  if ((sendEmailToContactTypes != "All" && sendEmailToContactTypes != null && sendEmailToContactTypes != '') && conTypeArray.length <= 0) {
    logDebug(vConType + " is not a valid contact type. No actions will be taken for this type.");
    return false; 
  }
  else if((sendEmailToContactTypes != "All" && sendEmailToContactTypes != null && sendEmailToContactTypes != '') && conTypeArray.length > 0) {
    sendEmailToContactTypes = conTypeArray.toString();
  }
  
logDebug("Validated contact types to send to: " + sendEmailToContactTypes); 
  //Save variables to the hash table and call sendEmailASync script. This allows for the email to contain an ACA deep link for the document
  envParameters.put("sendEmailToContactTypes", sendEmailToContactTypes);
  envParameters.put("emailTemplate", emailTemplate);
  envParameters.put("vEParams", vEParams);
  envParameters.put("reportTemplate", reportTemplate);
  envParameters.put("vRParams", vRParams);
  envParameters.put("vChangeReportName", vChangeReportName);
  envParameters.put("CapId", capId);
  envParameters.put("vAddAdHocTask", vAddAdHocTask);
  
  //Start modification to support batch script
  var vEvntTyp = aa.env.getValue("eventType");
  if (vEvntTyp == "Batch Process") {
    aa.env.setValue("sendEmailToContactTypes", sendEmailToContactTypes);
    aa.env.setValue("emailTemplate", emailTemplate);
    aa.env.setValue("vEParams", vEParams);
    aa.env.setValue("reportTemplate", reportTemplate);
    aa.env.setValue("vRParams", vRParams);
    aa.env.setValue("vChangeReportName", vChangeReportName);
    aa.env.setValue("CapId", capId);
    aa.env.setValue("vAddAdHocTask", vAddAdHocTask);    
    //call sendEmailASync script
    logDebug("Attempting to run Non-Async: " + vAsyncScript);
    aa.includeScript(vAsyncScript);
  }
  else {
    //call sendEmailASync script
    logDebug("Attempting to run Async: " + vAsyncScript);
    aa.runAsyncScript(vAsyncScript, envParameters);
  }
  //End modification to support batch script
  
  return true;
}